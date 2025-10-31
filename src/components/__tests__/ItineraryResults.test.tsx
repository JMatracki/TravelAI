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

const mockToast = vi.fn();

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
    toast: mockToast,
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
      pageSize: { height: 800 },
    },
  })),
}));

describe("ItineraryResults", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders itinerary information", () => {
    render(<ItineraryResults itinerary={mockItinerary} onSave={mockOnSave} />);

    const article = screen.getByRole("article");
    expect(article).toHaveTextContent("Paris");
    expect(article).toHaveTextContent("$500");
    expect(article).toHaveTextContent("per person");
  });

  it("renders markdown content from itinerary", () => {
    render(<ItineraryResults itinerary={mockItinerary} onSave={mockOnSave} />);
    expect(screen.getByText(/Visit the Eiffel Tower/)).toBeInTheDocument();
    expect(screen.getByText(/Explore the Louvre/)).toBeInTheDocument();
  });

  it("renders action buttons with accessible names", () => {
    render(<ItineraryResults itinerary={mockItinerary} onSave={mockOnSave} />);

    expect(
      screen.getByRole("button", { name: /save.*itinerary/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /export.*pdf/i })
    ).toBeInTheDocument();
  });

  it("calls onSave when save button is clicked and shows saved state", async () => {
    render(<ItineraryResults itinerary={mockItinerary} onSave={mockOnSave} />);

    const saveButton = screen.getByRole("button", { name: /save.*itinerary/i });
    await userEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith(mockItinerary);
    expect(saveButton).toHaveTextContent(/saved/i);
  });

  it("handles PDF export", async () => {
    render(<ItineraryResults itinerary={mockItinerary} onSave={mockOnSave} />);

    const exportButton = screen.getByRole("button", { name: /export.*pdf/i });
    await userEvent.click(exportButton);

    expect(exportButton).toBeInTheDocument();
  });

  it("shows toast when save is clicked", async () => {
    render(<ItineraryResults itinerary={mockItinerary} onSave={mockOnSave} />);

    const saveButton = screen.getByRole("button", { name: /save.*itinerary/i });
    await userEvent.click(saveButton);

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Saved!",
        description: expect.any(String),
      })
    );
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

    const article = screen.getByRole("article");
    expect(article).toHaveTextContent("$0");
    expect(article).toHaveTextContent("per person");
  });

  it("has correct semantic structure", () => {
    render(<ItineraryResults itinerary={mockItinerary} onSave={mockOnSave} />);
    const section = document.querySelector("section[role='article']");
    expect(section).toBeInTheDocument();
  });
});
