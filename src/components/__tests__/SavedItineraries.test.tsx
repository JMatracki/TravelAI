import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@/test/utils/test-utils";
import { SavedItineraries } from "../trip/SavedItineraries";

const mockProps = {
  onDelete: vi.fn(),
  onClearAll: vi.fn(),
  onView: vi.fn(),
};

const nowIso = new Date().toISOString();
const yesterdayIso = new Date(Date.now() - 86400000).toISOString();

const mockItineraries = [
  {
    id: "1",
    destination: "Paris",
    days: 3,
    content: "Test itinerary 1",
    estimatedCost: 500,
    createdAt: nowIso,
  },
  {
    id: "2",
    destination: "Tokyo",
    days: 5,
    content: "Test itinerary 2",
    estimatedCost: 800,
    createdAt: yesterdayIso,
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

describe("SavedItineraries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders saved itineraries as clickable cards", () => {
    render(<SavedItineraries itineraries={mockItineraries} {...mockProps} />);

    const cards = screen.getAllByRole("button", {
      name: /view itinerary for/i,
    });
    expect(cards).toHaveLength(2);

    expect(cards[0]).toHaveTextContent(/paris/i);
    expect(cards[0]).toHaveTextContent(/3\s*days/i);
    expect(cards[1]).toHaveTextContent(/tokyo/i);
    expect(cards[1]).toHaveTextContent(/5\s*days/i);
  });

  it("shows per-person costs on cards", () => {
    render(<SavedItineraries itineraries={mockItineraries} {...mockProps} />);

    const cards = screen.getAllByRole("button", {
      name: /view itinerary for/i,
    });
    expect(cards[0]).toHaveTextContent(/\$500\s*per person/i);
    expect(cards[1]).toHaveTextContent(/\$800\s*per person/i);
  });

  it("shows creation dates", () => {
    render(<SavedItineraries itineraries={mockItineraries} {...mockProps} />);
    const dates = screen.getAllByText(/\d{1,2}[./-]\d{1,2}[./-]\d{4}/);
    expect(dates.length).toBeGreaterThanOrEqual(2);
  });

  it("renders delete button for each itinerary and calls onDelete with the correct id", async () => {
    const user = userEvent.setup();
    render(<SavedItineraries itineraries={mockItineraries} {...mockProps} />);

    const parisDelete = screen.getAllByRole("button", { name: /delete/i })[0];
    await user.click(parisDelete);

    expect(mockProps.onDelete).toHaveBeenCalledTimes(1);
    expect(mockProps.onDelete).toHaveBeenCalledWith("1");
  });

  it("calls onView with itinerary object when a card is activated", async () => {
    const user = userEvent.setup();
    render(<SavedItineraries itineraries={mockItineraries} {...mockProps} />);

    const parisCardBtn = screen.getByRole("button", {
      name: /view itinerary for.*paris/i,
    });
    await user.click(parisCardBtn);

    expect(mockProps.onView).toHaveBeenCalledTimes(1);
    expect(mockProps.onView).toHaveBeenCalledWith(mockItineraries[0]);
  });

  it("renders 'Clear All' button when there are itineraries and triggers onClearAll", async () => {
    const user = userEvent.setup();
    render(<SavedItineraries itineraries={mockItineraries} {...mockProps} />);

    const clearBtn = screen.getByRole("button", { name: /clear all/i });
    expect(clearBtn).toBeInTheDocument();

    await user.click(clearBtn);
    expect(mockProps.onClearAll).toHaveBeenCalledTimes(1);
  });

  it("does not render 'Clear All' when list is empty", () => {
    render(<SavedItineraries itineraries={[]} {...mockProps} />);

    expect(
      screen.queryByRole("button", { name: /clear all/i })
    ).not.toBeInTheDocument();
  });

  it("handles missing data gracefully (cost=0, unknown date)", () => {
    const incomplete = [
      {
        id: "x",
        destination: "",
        days: 0,
        content: "",
        estimatedCost: 0,
        createdAt: "",
      },
    ];
    render(<SavedItineraries itineraries={incomplete} {...mockProps} />);

    const card = screen.getByRole("button", { name: /view itinerary for/i });
    expect(card).toHaveTextContent(/\$0\s*per person/i);
    expect(card).toHaveTextContent(/unknown date/i);
  });

  it("supports keyboard activation for viewing (Enter/Space)", async () => {
    const user = userEvent.setup();
    render(<SavedItineraries itineraries={mockItineraries} {...mockProps} />);

    const cardBtn = screen.getByRole("button", {
      name: /view itinerary for.*paris/i,
    });
    cardBtn.focus();
    expect(cardBtn).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(mockProps.onView).toHaveBeenCalledTimes(1);

    await user.keyboard(" ");
    expect(mockProps.onView).toHaveBeenCalledTimes(2);
  });
});
