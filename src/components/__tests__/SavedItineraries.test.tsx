import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { render } from "@/test/utils/test-utils";
import { SavedItineraries } from "../trip/SavedItineraries";

const mockProps = {
  onDelete: vi.fn(),
  onClearAll: vi.fn(),
  onView: vi.fn(),
};

const mockItineraries = [
  {
    id: "1",
    destination: "Paris",
    days: 3,
    content: "Test itinerary 1",
    estimatedCost: 500,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    destination: "Tokyo",
    days: 5,
    content: "Test itinerary 2",
    estimatedCost: 800,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

vi.mock("@/hooks/useLanguage", () => ({
  useLanguage: () => ({
    t: {
      saved: {
        title: "Saved Itineraries",
        empty: "No saved itineraries yet",
        delete: "Delete",
        clear: "Clear All",
        days: "days",
      },
      results: {
        perPerson: "per person",
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

describe("SavedItineraries Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders saved itineraries", () => {
    render(<SavedItineraries itineraries={mockItineraries} {...mockProps} />);

    expect(screen.getByText("Paris")).toBeInTheDocument();
    expect(screen.getByText("Tokyo")).toBeInTheDocument();
    expect(screen.getByText("3 days")).toBeInTheDocument();
    expect(screen.getByText("5 days")).toBeInTheDocument();
  });

  it("renders delete buttons for each itinerary", () => {
    render(<SavedItineraries itineraries={mockItineraries} {...mockProps} />);

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    expect(deleteButtons).toHaveLength(2);
  });

  it("renders clear all button when there are itineraries", () => {
    render(<SavedItineraries itineraries={mockItineraries} {...mockProps} />);

    expect(
      screen.getByRole("button", { name: /clear all/i })
    ).toBeInTheDocument();
  });

  it("does not render clear all button when no itineraries", () => {
    render(<SavedItineraries itineraries={[]} {...mockProps} />);

    expect(
      screen.queryByRole("button", { name: /clear all/i })
    ).not.toBeInTheDocument();
  });

  it("shows estimated costs", () => {
    render(<SavedItineraries itineraries={mockItineraries} {...mockProps} />);

    expect(screen.getByText("$500 per person")).toBeInTheDocument();
    expect(screen.getByText("$800 per person")).toBeInTheDocument();
  });

  it("shows creation dates", () => {
    render(<SavedItineraries itineraries={mockItineraries} {...mockProps} />);

    const dates = screen.getAllByText(/\d{1,2}\.\d{1,2}\.\d{4}/);
    expect(dates).toHaveLength(2);
  });

  it("handles missing data gracefully", () => {
    const incompleteItineraries = [
      {
        id: "1",
        destination: "",
        days: 0,
        content: "",
        estimatedCost: 0,
        createdAt: "",
      },
    ];

    render(
      <SavedItineraries itineraries={incompleteItineraries} {...mockProps} />
    );

    expect(screen.getByText("$0 per person")).toBeInTheDocument();
    expect(screen.getByText("Unknown date")).toBeInTheDocument();
  });

  it("has correct semantic structure", () => {
    render(<SavedItineraries itineraries={mockItineraries} {...mockProps} />);

    const sections = screen.getAllByRole("region");
    expect(sections.length).toBeGreaterThan(0);
  });
});
