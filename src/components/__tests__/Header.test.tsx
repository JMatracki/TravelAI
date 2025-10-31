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

  it("renders main navigation and home link with accessible name", () => {
    render(<Header />);
    expect(screen.getByLabelText("Main navigation")).toBeInTheDocument();
    const homeLink = screen.getByRole("link");
    expect(homeLink).toHaveAttribute("href", "/");
    expect(homeLink).toHaveTextContent("TravelAI");
  });

  it("renders language and theme toggle buttons", () => {
    render(<Header />);
    expect(
      screen.getByRole("button", { name: /change language/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /toggle theme/i })
    ).toBeInTheDocument();
  });

  it("invokes language change on language button click", async () => {
    render(<Header />);
    await userEvent.click(
      screen.getByRole("button", { name: /change language/i })
    );
    expect(mockSetLanguage).toHaveBeenCalledTimes(1);
  });

  it("invokes theme toggle on click", async () => {
    render(<Header />);
    await userEvent.click(
      screen.getByRole("button", { name: /toggle theme/i })
    );
    expect(mockSetTheme).toHaveBeenCalledTimes(1);
  });

  it("supports keyboard activation for toggles (a11y)", async () => {
    render(<Header />);
    const themeBtn = screen.getByRole("button", { name: /toggle theme/i });
    themeBtn.focus();
    await userEvent.keyboard("{Enter}");
    expect(mockSetTheme).toHaveBeenCalledTimes(1);
  });

  it("logo link leads to home with a clear accessible name", () => {
    render(<Header />);
    const home = screen.getByRole("link");
    expect(home).toHaveAttribute("href", "/");
    expect(home).toHaveTextContent("TravelAI");
  });
});
