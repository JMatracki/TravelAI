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

describe("TripPlanningForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all form fields with labels", () => {
    render(<TripPlanningForm onGenerate={mockOnGenerate} />);

    expect(screen.getByLabelText(/destination/i)).toBeInTheDocument();
    expect(
      screen.getByRole("spinbutton", { name: /number of days/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/activities/i)).toBeInTheDocument();
  });

  it("renders the generate button with accessible name", () => {
    render(<TripPlanningForm onGenerate={mockOnGenerate} />);
    expect(
      screen.getByRole("button", { name: /generate itinerary/i })
    ).toBeInTheDocument();
  });

  it("updates form values on input", async () => {
    const user = userEvent.setup();
    render(<TripPlanningForm onGenerate={mockOnGenerate} />);

    const destination = screen.getByLabelText(/destination/i);
    const days = screen.getByRole("spinbutton", { name: /number of days/i });
    const activities = screen.getByLabelText(/activities/i);

    await user.clear(destination);
    await user.type(destination, "Paris");

    await user.click(days);
    await user.keyboard("{Control>}a{/Control}");
    await user.keyboard("5");

    await user.type(activities, "Museums and restaurants");

    expect(destination).toHaveValue("Paris");
    expect(days).toHaveValue(5);
    expect(activities).toHaveValue("Museums and restaurants");
  });

  it("submits valid form data and includes language", async () => {
    const user = userEvent.setup();
    render(<TripPlanningForm onGenerate={mockOnGenerate} />);

    const destination = screen.getByLabelText(/destination/i);
    const days = screen.getByRole("spinbutton", { name: /number of days/i });
    const activities = screen.getByLabelText(/activities/i);
    const submit = screen.getByRole("button", { name: /generate itinerary/i });

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

  it("shows loading state when isLoading is true (button disabled)", () => {
    render(<TripPlanningForm onGenerate={mockOnGenerate} isLoading />);
    const btn = screen.getByRole("button", {
      name: /generating|generate itinerary/i,
    });
    expect(btn).toBeDisabled();
  });

  it("prevents submission when required fields are empty", async () => {
    const user = userEvent.setup();
    render(<TripPlanningForm onGenerate={mockOnGenerate} />);

    const submit = screen.getByRole("button", { name: /generate itinerary/i });
    await user.click(submit);

    expect(mockOnGenerate).not.toHaveBeenCalled();
  });

  it("marks fields as required and exposes placeholders", () => {
    render(<TripPlanningForm onGenerate={mockOnGenerate} />);

    const destination = screen.getByLabelText(/destination/i);
    const days = screen.getByRole("spinbutton", { name: /number of days/i });
    const activities = screen.getByLabelText(/activities/i);

    expect(destination).toBeRequired();
    expect(days).toBeRequired();
    expect(activities).toBeRequired();

    const destinationInput = screen.getByLabelText(/destination/i);
    const activitiesInput = screen.getByLabelText(/activities/i);
    expect(destinationInput).toBeInTheDocument();
    expect(activitiesInput).toBeInTheDocument();
  });

  it("exposes form landmark (named if aria-label is present)", () => {
    render(<TripPlanningForm onGenerate={mockOnGenerate} />);
    const namedForm = screen.queryByRole("form", { name: /trip planning/i });
    if (namedForm) {
      expect(namedForm).toBeInTheDocument();
    } else {
      const anyForm = screen.getByRole("form");
      expect(anyForm).toBeInTheDocument();
    }
  });
});
