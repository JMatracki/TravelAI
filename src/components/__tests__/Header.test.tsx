import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@/test/utils/test-utils";
import { Header } from "../layout/Header";

const mockSetLanguage = vi.fn();
const mockSetTheme = vi.fn();

vi.mock("@/hooks/useLanguage", () => ({
  useLanguage: () => ({
    language: "en",
    setLanguage: mockSetLanguage,
    t: {
      nav: {
        language: "Change language",
        theme: "Toggle theme",
      },
    },
  }),
}));

vi.mock("@/hooks/useTheme", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: mockSetTheme,
  }),
}));

describe("Header Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders logo and navigation", () => {
    render(<Header />);

    expect(screen.getByText("TravelAI")).toBeInTheDocument();
    expect(screen.getByTitle("Go to home page")).toBeInTheDocument();
  });

  it("renders language and theme toggle buttons", () => {
    render(<Header />);

    const languageButton = screen.getByRole("button", {
      name: /change language/i,
    });
    const themeButton = screen.getByRole("button", { name: /toggle theme/i });

    expect(languageButton).toBeInTheDocument();
    expect(themeButton).toBeInTheDocument();
  });

  it("toggles language on language button click", async () => {
    const user = userEvent.setup();
    render(<Header />);

    const languageButton = screen.getByRole("button", {
      name: /change language/i,
    });
    await user.click(languageButton);

    expect(mockSetLanguage).toHaveBeenCalledWith("pl");
  });

  it("toggles theme on theme button click", async () => {
    const user = userEvent.setup();
    render(<Header />);

    const themeButton = screen.getByRole("button", { name: /toggle theme/i });
    await user.click(themeButton);

    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  it("has correct ARIA labels", () => {
    render(<Header />);

    expect(screen.getByLabelText("Main navigation")).toBeInTheDocument();
    expect(screen.getByLabelText(/change language/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/toggle theme/i)).toBeInTheDocument();
  });

  it("logo link has correct href and title", () => {
    render(<Header />);

    const logoLink = screen.getByTitle("Go to home page");
    expect(logoLink).toHaveAttribute("href", "/");
  });
});
