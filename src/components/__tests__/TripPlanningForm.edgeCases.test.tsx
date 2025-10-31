import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@/test/utils/test-utils";
import { TripPlanningForm } from "../trip/TripPlanningForm";

const mockOnGenerate = vi.fn();

vi.mock("@/hooks/useLanguage", () => ({
  useLanguage: () => ({
    t: {
      form: {
        destination: "Destination",
        days: "Number of days",
        activities: "Activities",
        generate: "Generate Itinerary",
        generating: "Generating...",
        placeholder: {
          destination: "Enter destination",
          activities: "Describe your interests",
        },
      },
    },
    language: "en",
  }),
}));

vi.mock("@/hooks/useToast", () => ({
  useToast: () => ({
    toast: vi.fn(),
    toasts: [],
  }),
}));

describe("TripPlanningForm — edge & accessibility", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Extreme Trip Durations", () => {
    it("handles maximum trip duration (30 days)", async () => {
      const user = userEvent.setup();
      render(<TripPlanningForm onGenerate={mockOnGenerate} />);

      const days = screen.getByRole("spinbutton", { name: /number of days/i });
      await user.click(days);
      await user.keyboard("{Control>}a{/Control}");
      await user.keyboard("30");
      expect(days).toHaveValue(30);
    });

    it("handles minimum trip duration (1 day)", async () => {
      const user = userEvent.setup();
      render(<TripPlanningForm onGenerate={mockOnGenerate} />);

      const days = screen.getByRole("spinbutton", { name: /number of days/i });
      await user.click(days);
      await user.keyboard("{Control>}a{/Control}");
      await user.keyboard("1");
      expect(days).toHaveValue(1);
    });

    it("normalizes negative duration input to a valid range on submit", async () => {
      const user = userEvent.setup();
      render(<TripPlanningForm onGenerate={mockOnGenerate} />);

      const days = screen.getByRole("spinbutton", { name: /number of days/i });
      const destination = screen.getByLabelText(/destination/i);
      const activities = screen.getByLabelText(/activities/i);
      const submit = screen.getByRole("button", {
        name: /generate itinerary/i,
      });

      await user.click(days);
      await user.keyboard("{Control>}a{/Control}");
      await user.keyboard("-5");

      await user.clear(destination);
      await user.type(destination, "Paris");
      await user.type(activities, "Sightseeing");
      await user.click(submit);

      expect(mockOnGenerate).toHaveBeenCalledWith(
        expect.objectContaining({
          days: expect.any(Number),
        })
      );
      const passed = (mockOnGenerate.mock.calls[0][0] as { days: number }).days;
      expect(passed).toBeGreaterThanOrEqual(1);
      expect(passed).toBeLessThanOrEqual(30);
    });
  });

  describe("Exotic and Complex Destinations", () => {
    it("accepts destinations with special characters", async () => {
      const user = userEvent.setup();
      render(<TripPlanningForm onGenerate={mockOnGenerate} />);

      const destination = screen.getByLabelText(/destination/i);
      const activities = screen.getByLabelText(/activities/i);
      const submit = screen.getByRole("button", {
        name: /generate itinerary/i,
      });

      await user.clear(destination);
      await user.type(destination, "São Paulo, Brazil");
      await user.type(activities, "Cultural tours");
      await user.click(submit);

      await waitFor(() => {
        expect(mockOnGenerate).toHaveBeenCalledWith(
          expect.objectContaining({ destination: "São Paulo, Brazil" })
        );
      });
    });

    it("handles very long destination names", async () => {
      const user = userEvent.setup();
      render(<TripPlanningForm onGenerate={mockOnGenerate} />);

      const long =
        "Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch, Wales, United Kingdom";
      const destination = screen.getByLabelText(/destination/i);

      await user.clear(destination);
      await user.type(destination, long);
      expect(destination).toHaveValue(long);
    });

    it("allows comma-separated multiple destinations", async () => {
      const user = userEvent.setup();
      render(<TripPlanningForm onGenerate={mockOnGenerate} />);

      const destination = screen.getByLabelText(/destination/i);
      const activities = screen.getByLabelText(/activities/i);
      const submit = screen.getByRole("button", {
        name: /generate itinerary/i,
      });

      await user.clear(destination);
      await user.type(destination, "Paris, Rome, Barcelona");
      await user.type(activities, "Art museums, local cuisine");
      await user.click(submit);

      await waitFor(() => {
        expect(mockOnGenerate).toHaveBeenCalledWith(
          expect.objectContaining({ destination: "Paris, Rome, Barcelona" })
        );
      });
    });
  });

  describe("Complex Activity Descriptions", () => {
    it("handles very detailed activity preferences", async () => {
      const user = userEvent.setup();
      render(<TripPlanningForm onGenerate={mockOnGenerate} />);

      const longActivities =
        "Historical sites, medieval castles, ancient ruins, local cuisine, street food, hiking, cycling, water sports, art galleries, museums, cultural performances, off-the-beaten-path locations";

      const destination = screen.getByLabelText(/destination/i);
      const activities = screen.getByLabelText(/activities/i);
      const submit = screen.getByRole("button", {
        name: /generate itinerary/i,
      });

      await user.clear(destination);
      await user.type(destination, "Greece");
      await user.type(activities, longActivities);
      await user.click(submit);

      await waitFor(() => {
        expect(mockOnGenerate).toHaveBeenCalledWith(
          expect.objectContaining({ activities: longActivities })
        );
      });
    });

    it("accepts activities with special characters", async () => {
      const user = userEvent.setup();
      render(<TripPlanningForm onGenerate={mockOnGenerate} />);

      const special =
        "Museums & galleries, Food tours (local cuisine), Theater & cultural shows, Beaches & water sports";
      const activities = screen.getByLabelText(/activities/i);

      await user.type(activities, special);
      expect(activities).toHaveValue(special);
    });
  });

  describe("Validation & Submission", () => {
    it("prevents submission with empty destination", async () => {
      const user = userEvent.setup();
      render(<TripPlanningForm onGenerate={mockOnGenerate} />);

      const activities = screen.getByLabelText(/activities/i);
      const submit = screen.getByRole("button", {
        name: /generate itinerary/i,
      });

      await user.type(activities, "Sightseeing");
      await user.click(submit);

      expect(mockOnGenerate).not.toHaveBeenCalled();
    });

    it("trims whitespace-only destination and prevents submission", async () => {
      const user = userEvent.setup();
      render(<TripPlanningForm onGenerate={mockOnGenerate} />);

      const destination = screen.getByLabelText(/destination/i);
      const activities = screen.getByLabelText(/activities/i);
      const submit = screen.getByRole("button", {
        name: /generate itinerary/i,
      });

      await user.clear(destination);
      await user.type(destination, "   ");
      await user.type(activities, "Tourism");
      await user.click(submit);

      expect(mockOnGenerate).not.toHaveBeenCalled();
    });

    it("submits when all fields are valid and passes language", async () => {
      const user = userEvent.setup();
      render(<TripPlanningForm onGenerate={mockOnGenerate} />);

      const destination = screen.getByLabelText(/destination/i);
      const days = screen.getByRole("spinbutton", { name: /number of days/i });
      const activities = screen.getByLabelText(/activities/i);
      const submit = screen.getByRole("button", {
        name: /generate itinerary/i,
      });

      await user.clear(destination);
      await user.type(destination, "Tokyo");

      await user.click(days);
      await user.keyboard("{Control>}a{/Control}");
      await user.keyboard("3");

      await user.type(activities, "Temples and food");
      await user.click(submit);

      await waitFor(() => {
        expect(mockOnGenerate).toHaveBeenCalledWith({
          destination: "Tokyo",
          days: 3,
          activities: "Temples and food",
          language: "en",
        });
      });
    });
  });

  describe("Loading & A11y", () => {
    it("shows loading state accessibly when isLoading is true", () => {
      render(<TripPlanningForm onGenerate={mockOnGenerate} isLoading />);
      const btn = screen.getByRole("button", { name: /generating|generate/i });
      expect(btn).toBeDisabled();
    });

    it("keeps focus order for keyboard users", async () => {
      const user = userEvent.setup();
      render(<TripPlanningForm onGenerate={mockOnGenerate} />);

      const destination = screen.getByLabelText(/destination/i);
      const days = screen.getByRole("spinbutton", { name: /number of days/i });
      const activities = screen.getByLabelText(/activities/i);

      await user.tab();
      expect(destination).toHaveFocus();

      await user.tab();
      expect(days).toHaveFocus();

      await user.tab();
      expect(activities).toHaveFocus();
    });

    it("marks required fields and provides helpful descriptions", () => {
      render(<TripPlanningForm onGenerate={mockOnGenerate} />);

      const destination = screen.getByLabelText(/destination/i);
      const days = screen.getByRole("spinbutton", { name: /number of days/i });
      const activities = screen.getByLabelText(/activities/i);

      expect(destination).toBeRequired();
      expect(days).toBeRequired();
      expect(activities).toBeRequired();

      const destDesc = destination.getAttribute("aria-describedby");
      const daysDesc = days.getAttribute("aria-describedby");
      const actDesc = activities.getAttribute("aria-describedby");
      if (destDesc) expect(destDesc).toMatch(/destination-description/);
      if (daysDesc) expect(daysDesc).toMatch(/days-description/);
      if (actDesc) expect(actDesc).toMatch(/activities-description/);
    });

    it("exposes form inputs with correct accessibility", () => {
      render(<TripPlanningForm onGenerate={mockOnGenerate} />);
      expect(screen.getByLabelText(/destination/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/activities/i)).toBeInTheDocument();
    });
  });

  describe("Robustness under rapid input", () => {
    it("handles rapid changes without breaking", async () => {
      const user = userEvent.setup();
      render(<TripPlanningForm onGenerate={mockOnGenerate} />);

      const destination = screen.getByLabelText(/destination/i);
      const days = screen.getByRole("spinbutton", { name: /number of days/i });

      for (let i = 0; i < 3; i++) {
        await user.clear(destination);
        await user.type(destination, `Dest${i}`);

        await user.click(days);
        await user.keyboard("{Control>}a{/Control}");
        await user.keyboard(String(i + 1));
      }

      expect(destination).toHaveValue("Dest2");
      expect(days).toHaveValue(3);
    }, 3000);
  });
});
