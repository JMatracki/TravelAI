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

describe("TripPlanningForm - Edge Cases", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Extreme Trip Durations", () => {
    it("handles maximum trip duration (30 days)", async () => {
      const user = userEvent.setup();
      render(<TripPlanningForm onGenerate={mockOnGenerate} />);

      const daysInput = screen.getByLabelText(/number of days/i);

      await user.click(daysInput);
      await user.keyboard("{Control>}a{/Control}");
      await user.keyboard("30");

      expect(daysInput).toHaveValue(30);
    });

    it("handles minimum trip duration (1 day)", async () => {
      const user = userEvent.setup();
      render(<TripPlanningForm onGenerate={mockOnGenerate} />);

      const daysInput = screen.getByLabelText(/number of days/i);

      await user.click(daysInput);
      await user.keyboard("{Control>}a{/Control}");
      await user.keyboard("1");

      expect(daysInput).toHaveValue(1);
    });

    it("handles negative trip duration input", async () => {
      const user = userEvent.setup();
      render(<TripPlanningForm onGenerate={mockOnGenerate} />);

      const daysInput = screen.getByLabelText(/number of days/i);
      const generateButton = screen.getByRole("button", {
        name: /generate itinerary/i,
      });

      await user.click(daysInput);
      await user.keyboard("{Control>}a{/Control}");
      await user.keyboard("-5");

      await user.clear(screen.getByLabelText(/destination/i));
      await user.type(screen.getByLabelText(/destination/i), "Paris");
      await user.type(screen.getByLabelText(/activities/i), "Sightseeing");

      await user.click(generateButton);

      expect(mockOnGenerate).toHaveBeenCalledWith(
        expect.objectContaining({
          days: 15,
        })
      );
    });
  });

  describe("Exotic and Complex Destinations", () => {
    it("handles destinations with special characters", async () => {
      const user = userEvent.setup();
      render(<TripPlanningForm onGenerate={mockOnGenerate} />);

      const destinationInput = screen.getByLabelText(/destination/i);
      const generateButton = screen.getByRole("button", {
        name: /generate itinerary/i,
      });

      await user.clear(destinationInput);
      await user.type(destinationInput, "São Paulo, Brazil");
      await user.type(screen.getByLabelText(/activities/i), "Cultural tours");
      await user.click(generateButton);

      await waitFor(() => {
        expect(mockOnGenerate).toHaveBeenCalledWith(
          expect.objectContaining({
            destination: "São Paulo, Brazil",
          })
        );
      });
    });

    it("handles very long destination names", async () => {
      const user = userEvent.setup();
      render(<TripPlanningForm onGenerate={mockOnGenerate} />);

      const longDestination =
        "Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch, Wales, United Kingdom";
      const destinationInput = screen.getByLabelText(/destination/i);

      await user.clear(destinationInput);
      await user.type(destinationInput, longDestination);

      expect(destinationInput).toHaveValue(longDestination);
    });

    it("handles multiple destinations", async () => {
      const user = userEvent.setup();
      render(<TripPlanningForm onGenerate={mockOnGenerate} />);

      const destinationInput = screen.getByLabelText(/destination/i);
      const generateButton = screen.getByRole("button", {
        name: /generate itinerary/i,
      });

      await user.clear(destinationInput);
      await user.type(destinationInput, "Paris, Rome, Barcelona");
      await user.type(
        screen.getByLabelText(/activities/i),
        "Art museums, local cuisine"
      );
      await user.click(generateButton);

      await waitFor(() => {
        expect(mockOnGenerate).toHaveBeenCalledWith(
          expect.objectContaining({
            destination: "Paris, Rome, Barcelona",
          })
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

      const activitiesInput = screen.getByLabelText(/activities/i);
      const generateButton = screen.getByRole("button", {
        name: /generate itinerary/i,
      });

      await user.clear(screen.getByLabelText(/destination/i));
      await user.type(screen.getByLabelText(/destination/i), "Greece");
      await user.type(activitiesInput, longActivities);
      await user.click(generateButton);

      await waitFor(
        () => {
          expect(mockOnGenerate).toHaveBeenCalledWith(
            expect.objectContaining({
              activities: longActivities,
            })
          );
        },
        { timeout: 10000 }
      );
    });

    it("handles activities with special characters", async () => {
      const user = userEvent.setup();
      render(<TripPlanningForm onGenerate={mockOnGenerate} />);

      const specialActivities =
        "Museums & galleries, Food tours (local cuisine), Theater & cultural shows, Beaches & water sports";
      const activitiesInput = screen.getByLabelText(/activities/i);

      await user.type(activitiesInput, specialActivities);

      expect(activitiesInput).toHaveValue(specialActivities);
    });
  });

  describe("Form Validation Edge Cases", () => {
    it("prevents submission with empty destination", async () => {
      const user = userEvent.setup();
      render(<TripPlanningForm onGenerate={mockOnGenerate} />);

      const generateButton = screen.getByRole("button", {
        name: /generate itinerary/i,
      });
      const activitiesInput = screen.getByLabelText(/activities/i);

      await user.type(activitiesInput, "Sightseeing");
      await user.click(generateButton);

      expect(mockOnGenerate).not.toHaveBeenCalled();
    });

    it("prevents submission with only whitespace in destination", async () => {
      const user = userEvent.setup();
      render(<TripPlanningForm onGenerate={mockOnGenerate} />);

      const destinationInput = screen.getByLabelText(/destination/i);
      const generateButton = screen.getByRole("button", {
        name: /generate itinerary/i,
      });

      await user.clear(destinationInput);
      await user.type(destinationInput, "   ");
      await user.type(screen.getByLabelText(/activities/i), "Tourism");
      await user.click(generateButton);

      expect(mockOnGenerate).not.toHaveBeenCalled();
    });

    it("handles form submission during loading state", async () => {
      const user = userEvent.setup();
      render(<TripPlanningForm onGenerate={mockOnGenerate} isLoading={true} />);

      const generateButton = screen.getByRole("button");

      expect(generateButton).toBeDisabled();

      await user.click(generateButton);

      expect(mockOnGenerate).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility Edge Cases", () => {
    it("maintains focus management during form interactions", async () => {
      const user = userEvent.setup();
      render(<TripPlanningForm onGenerate={mockOnGenerate} />);

      const destinationInput = screen.getByLabelText(/destination/i);
      const daysInput = screen.getByLabelText(/number of days/i);
      const activitiesInput = screen.getByLabelText(/activities/i);

      await user.tab();
      expect(destinationInput).toHaveFocus();

      await user.tab();
      expect(daysInput).toHaveFocus();

      await user.tab();
      expect(activitiesInput).toHaveFocus();
    });

    it("provides proper ARIA labels for screen readers", () => {
      render(<TripPlanningForm onGenerate={mockOnGenerate} />);

      const destinationInput = screen.getByLabelText(/destination/i);
      const daysInput = screen.getByLabelText(/number of days/i);
      const activitiesInput = screen.getByLabelText(/activities/i);

      expect(destinationInput).toHaveAttribute("aria-required", "true");
      expect(daysInput).toHaveAttribute("aria-required", "true");
      expect(activitiesInput).toHaveAttribute("aria-required", "true");

      expect(destinationInput).toHaveAttribute(
        "aria-describedby",
        "destination-description"
      );
      expect(daysInput).toHaveAttribute("aria-describedby", "days-description");
      expect(activitiesInput).toHaveAttribute(
        "aria-describedby",
        "activities-description"
      );
    });
  });

  describe("Performance Edge Cases", () => {
    it("handles rapid form interactions without breaking", async () => {
      const user = userEvent.setup();
      render(<TripPlanningForm onGenerate={mockOnGenerate} />);

      const destinationInput = screen.getByLabelText(/destination/i);
      const daysInput = screen.getByLabelText(/number of days/i);

      for (let i = 0; i < 3; i++) {
        await user.clear(destinationInput);
        await user.type(destinationInput, `Dest${i}`);

        await user.click(daysInput);
        await user.keyboard("{Control>}a{/Control}");
        await user.keyboard(String(i + 1));
      }

      expect(destinationInput).toHaveValue("Dest2");
      expect(daysInput).toHaveValue(3);
    }, 10000);
  });
});
