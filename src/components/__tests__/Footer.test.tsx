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
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("renders GitHub link with accessible name", () => {
    render(<Footer />);
    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent("JMatracki");
  });

  it("points to the correct URL and opens in a new tab safely", () => {
    render(<Footer />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://github.com/JMatracki");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
