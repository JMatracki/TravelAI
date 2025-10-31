import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@/test/utils/test-utils";
import { Hero } from "../common/Hero";

const mockOnGetStarted = vi.fn();

vi.mock("@/hooks/useLanguage", () => ({
  useLanguage: () => ({
    t: {
      hero: {
        title: "Plan Your Perfect Journey with AI",
        subtitle: "Create personalized travel itineraries",
        cta: "Start Planning",
      },
      footer: {
        powered: "AI-Powered",
      },
    },
  }),
}));

describe("Hero Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exposes a top-level heading for the section", () => {
    render(<Hero onGetStarted={mockOnGetStarted} />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toBeInTheDocument();
  });

  it("provides a landmark region for the hero (aria-label)", () => {
    render(<Hero onGetStarted={mockOnGetStarted} />);
    const region = screen.getByLabelText(/hero/i);
    expect(region).toBeInTheDocument();
  });

  it("renders a CTA button with an accessible name", () => {
    render(<Hero onGetStarted={mockOnGetStarted} />);
    const cta = screen.getByRole("button");
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAccessibleName();
  });

  it("invokes onGetStarted when CTA is activated via mouse", async () => {
    render(<Hero onGetStarted={mockOnGetStarted} />);
    const cta = screen.getByRole("button");
    await userEvent.click(cta);
    expect(mockOnGetStarted).toHaveBeenCalledTimes(1);
  });

  it("is keyboard-accessible (Enter/Space activate the CTA)", async () => {
    render(<Hero onGetStarted={mockOnGetStarted} />);
    const cta = screen.getByRole("button");
    cta.focus();
    expect(cta).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    expect(mockOnGetStarted).toHaveBeenCalledTimes(1);

    await userEvent.keyboard(" ");
    expect(mockOnGetStarted).toHaveBeenCalledTimes(2);
  });

  it("button is focusable in tab order", () => {
    render(<Hero onGetStarted={mockOnGetStarted} />);
    const cta = screen.getByRole("button");
    expect(cta).toHaveProperty("tabIndex", 0);
  });
});
