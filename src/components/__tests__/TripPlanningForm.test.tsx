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

describe("TripPlanningForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders form fields", () => {
    render(<TripPlanningForm onGenerate={mockOnGenerate} />);

    expect(screen.getByLabelText(/destination/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/number of days/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/activities/i)).toBeInTheDocument();
  });

  it("renders generate button", () => {
    render(<TripPlanningForm onGenerate={mockOnGenerate} />);

    const generateButton = screen.getByRole("button", {
      name: /generate itinerary/i,
    });
    expect(generateButton).toBeInTheDocument();
  });

  it("updates form values on input", async () => {
    const user = userEvent.setup();
    render(<TripPlanningForm onGenerate={mockOnGenerate} />);

    const destinationInput = screen.getByLabelText(/destination/i);
    const daysInput = screen.getByLabelText(/number of days/i);
    const activitiesInput = screen.getByLabelText(/activities/i);

    await user.clear(destinationInput);
    await user.type(destinationInput, "Paris");

    await user.click(daysInput);
    await user.keyboard("{Control>}a{/Control}");
    await user.keyboard("5");

    await user.type(activitiesInput, "Museums and restaurants");

    expect(destinationInput).toHaveValue("Paris");
    expect(daysInput).toHaveValue(5);
    expect(activitiesInput).toHaveValue("Museums and restaurants");
  });

  it("calls onGenerate with form data on submit", async () => {
    const user = userEvent.setup();
    render(<TripPlanningForm onGenerate={mockOnGenerate} />);

    const destinationInput = screen.getByLabelText(/destination/i);
    const daysInput = screen.getByLabelText(/number of days/i);
    const activitiesInput = screen.getByLabelText(/activities/i);
    const generateButton = screen.getByRole("button", {
      name: /generate itinerary/i,
    });

    await user.clear(destinationInput);
    await user.type(destinationInput, "Tokyo");

    await user.click(daysInput);
    await user.keyboard("{Control>}a{/Control}");
    await user.keyboard("3");

    await user.type(activitiesInput, "Temples and food");
    await user.click(generateButton);

    await waitFor(() => {
      expect(mockOnGenerate).toHaveBeenCalledWith({
        destination: "Tokyo",
        days: 3,
        activities: "Temples and food",
        language: "en",
      });
    });
  });

  it("shows loading state when isLoading is true", () => {
    render(<TripPlanningForm onGenerate={mockOnGenerate} isLoading={true} />);

    const generateButton = screen.getByRole("button");
    expect(generateButton).toBeDisabled();
  });

  it("validates required fields", async () => {
    const user = userEvent.setup();
    render(<TripPlanningForm onGenerate={mockOnGenerate} />);

    const generateButton = screen.getByRole("button");
    await user.click(generateButton);

    expect(mockOnGenerate).not.toHaveBeenCalled();
  });

  it("has correct form structure", () => {
    render(<TripPlanningForm onGenerate={mockOnGenerate} />);

    const form = screen.getByRole("form");
    expect(form).toBeInTheDocument();
  });
});
