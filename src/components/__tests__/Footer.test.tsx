import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { render } from "@/test/utils/test-utils";
import { Footer } from "../layout/Footer";

vi.mock("@/hooks/useLanguage", () => ({
  useLanguage: () => ({
    t: {
      footer: {
        powered: "AI-Powered",
        openSource: "Open Source",
      },
    },
  }),
}));

vi.mock("@/hooks/useTheme", () => ({
  useTheme: () => ({
    theme: "light",
  }),
}));

describe("Footer Component", () => {
  it("renders footer content", () => {
    render(<Footer />);

    expect(screen.getByText("AI-Powered")).toBeInTheDocument();
    expect(screen.getByText("Open Source")).toBeInTheDocument();
  });

  it("has correct semantic structure", () => {
    render(<Footer />);

    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
  });

  it("renders with correct classes", () => {
    render(<Footer />);

    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveClass(
      "border-t",
      "border-glass-border",
      "bg-card/50",
      "backdrop-blur-glass"
    );
  });
});
