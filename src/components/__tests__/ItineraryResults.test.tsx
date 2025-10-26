import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@/test/utils/test-utils";
import { ItineraryResults } from "../trip/ItineraryResults";

const mockOnSave = vi.fn();

const mockItinerary = {
  id: "1",
  destination: "Paris",
  days: 3,
  content: "## Day 1\nVisit the Eiffel Tower\n## Day 2\nExplore the Louvre",
  estimatedCost: 500,
  createdAt: new Date().toISOString(),
};

vi.mock("@/hooks/useLanguage", () => ({
  useLanguage: () => ({
    t: {
      results: {
        title: "Travel Plan",
        duration: "Duration",
        days: "days",
        estimatedCost: "Estimated Cost",
        perPerson: "per person",
        unknownPlace: "Unknown Place",
        save: "Save Itinerary",
        saved: "Saved!",
        export: "Export to PDF",
      },
      toasts: {
        saveSuccess: "Itinerary saved successfully",
        pdfError: "Failed to export PDF",
      },
    },
  }),
}));

vi.mock("@/hooks/useToast", () => ({
  useToast: () => ({
    toast: vi.fn(),
    toasts: [],
  }),
}));

vi.mock("jspdf", () => ({
  default: vi.fn().mockImplementation(() => ({
    setFont: vi.fn(),
    setFontSize: vi.fn(),
    text: vi.fn(),
    splitTextToSize: vi.fn().mockReturnValue(["Line 1", "Line 2"]),
    addPage: vi.fn(),
    save: vi.fn(),
    internal: {
      pageSize: {
        height: 800,
      },
    },
  })),
}));

describe("ItineraryResults Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders itinerary information", () => {
    render(<ItineraryResults itinerary={mockItinerary} onSave={mockOnSave} />);

    expect(screen.getByText("Paris")).toBeInTheDocument();
    expect(screen.getByText("$500")).toBeInTheDocument();
    expect(screen.getByText("per person")).toBeInTheDocument();
  });

  it("renders itinerary content", () => {
    render(<ItineraryResults itinerary={mockItinerary} onSave={mockOnSave} />);

    expect(screen.getByText(/Visit the Eiffel Tower/)).toBeInTheDocument();
    expect(screen.getByText(/Explore the Louvre/)).toBeInTheDocument();
  });

  it("renders action buttons", () => {
    render(<ItineraryResults itinerary={mockItinerary} onSave={mockOnSave} />);

    expect(
      screen.getByRole("button", { name: /save this itinerary/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /export itinerary as pdf/i })
    ).toBeInTheDocument();
  });

  it("calls onSave when save button is clicked", async () => {
    const user = userEvent.setup();
    render(<ItineraryResults itinerary={mockItinerary} onSave={mockOnSave} />);

    const saveButton = screen.getByRole("button", {
      name: /save this itinerary/i,
    });
    await user.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith(mockItinerary);
  });

  it("shows saved state after saving", async () => {
    const user = userEvent.setup();
    render(<ItineraryResults itinerary={mockItinerary} onSave={mockOnSave} />);

    const saveButton = screen.getByRole("button", {
      name: /save this itinerary/i,
    });
    await user.click(saveButton);

    expect(screen.getByText("Saved!")).toBeInTheDocument();
  });

  it("handles PDF export", async () => {
    const user = userEvent.setup();
    render(<ItineraryResults itinerary={mockItinerary} onSave={mockOnSave} />);

    const exportButton = screen.getByRole("button", {
      name: /export itinerary as pdf/i,
    });
    await user.click(exportButton);

    expect(exportButton).toBeInTheDocument();
  });

  it("handles missing itinerary data gracefully", () => {
    const incompleteItinerary = {
      id: "1",
      destination: "",
      days: 0,
      content: "",
      estimatedCost: 0,
      createdAt: "",
    };

    render(
      <ItineraryResults itinerary={incompleteItinerary} onSave={mockOnSave} />
    );

    expect(screen.getByText("$0")).toBeInTheDocument();
    expect(screen.getByText("per person")).toBeInTheDocument();
  });

  it("has correct semantic structure", () => {
    render(<ItineraryResults itinerary={mockItinerary} onSave={mockOnSave} />);

    const article = screen.getByRole("article");
    expect(article).toBeInTheDocument();
  });
});
