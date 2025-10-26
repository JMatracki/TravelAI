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

  it("renders hero title and subtitle", () => {
    render(<Hero onGetStarted={mockOnGetStarted} />);

    expect(
      screen.getByText("Plan Your Perfect Journey with AI")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Create personalized travel itineraries")
    ).toBeInTheDocument();
  });

  it("renders call-to-action button", () => {
    render(<Hero onGetStarted={mockOnGetStarted} />);

    const ctaButton = screen.getByRole("button", { name: /start planning/i });
    expect(ctaButton).toBeInTheDocument();
  });

  it("calls onGetStarted when CTA button is clicked", async () => {
    const user = userEvent.setup();
    render(<Hero onGetStarted={mockOnGetStarted} />);

    const ctaButton = screen.getByRole("button", { name: /start planning/i });
    await user.click(ctaButton);

    expect(mockOnGetStarted).toHaveBeenCalledTimes(1);
  });

  it("has correct semantic structure", () => {
    render(<Hero onGetStarted={mockOnGetStarted} />);

    const heroSection = document.querySelector("section");
    expect(heroSection).toBeInTheDocument();
  });
});
