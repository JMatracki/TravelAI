import { describe, it, expect } from "vitest";
import { translations } from "../translations";

describe("Translations", () => {
  it("has complete English translations", () => {
    expect(translations.en).toBeDefined();
    expect(translations.en.hero).toBeDefined();
    expect(translations.en.form).toBeDefined();
    expect(translations.en.results).toBeDefined();
    expect(translations.en.saved).toBeDefined();
    expect(translations.en.nav).toBeDefined();
    expect(translations.en.footer).toBeDefined();
    expect(translations.en.toasts).toBeDefined();
  });

  it("has complete Polish translations", () => {
    expect(translations.pl).toBeDefined();
    expect(translations.pl.hero).toBeDefined();
    expect(translations.pl.form).toBeDefined();
    expect(translations.pl.results).toBeDefined();
    expect(translations.pl.saved).toBeDefined();
    expect(translations.pl.nav).toBeDefined();
    expect(translations.pl.footer).toBeDefined();
    expect(translations.pl.toasts).toBeDefined();
  });

  it("has same structure for both languages", () => {
    const enKeys = Object.keys(translations.en);
    const plKeys = Object.keys(translations.pl);

    expect(enKeys).toEqual(plKeys);
  });

  it("has all required keys in hero section", () => {
    expect(translations.en.hero.title).toBeDefined();
    expect(translations.en.hero.subtitle).toBeDefined();
    expect(translations.en.hero.cta).toBeDefined();
  });

  it("has all required keys in form section", () => {
    const formKeys = Object.keys(translations.en.form);
    expect(formKeys.length).toBeGreaterThan(0);
  });

  it("has all required keys in saved section", () => {
    expect(translations.en.saved.title).toBeDefined();
    expect(translations.en.saved.empty).toBeDefined();
    expect(translations.en.saved.delete).toBeDefined();
    expect(translations.en.saved.clear).toBeDefined();
    expect(translations.en.saved.days).toBeDefined();
  });

  it("has all required keys in results section", () => {
    expect(translations.en.results.title).toBeDefined();
    expect(translations.en.results.duration).toBeDefined();
    expect(translations.en.results.days).toBeDefined();
    expect(translations.en.results.estimatedCost).toBeDefined();
    expect(translations.en.results.perPerson).toBeDefined();
    expect(translations.en.results.unknownPlace).toBeDefined();
  });

  it("has all required keys in toasts section", () => {
    expect(translations.en.toasts.generating).toBeDefined();
    expect(translations.en.toasts.success).toBeDefined();
    expect(translations.en.toasts.error).toBeDefined();
    expect(translations.en.toasts.saved).toBeDefined();
    expect(translations.en.toasts.pdfSuccess).toBeDefined();
    expect(translations.en.toasts.pdfError).toBeDefined();
    expect(translations.en.toasts.saveSuccess).toBeDefined();
  });

  it("has non-empty string values", () => {
    const checkNonEmpty = (obj: Record<string, unknown>, path = "") => {
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key;
        if (typeof value === "object" && value !== null) {
          checkNonEmpty(value as Record<string, unknown>, currentPath);
        } else if (typeof value === "string") {
          expect(value.trim().length).toBeGreaterThan(0);
        }
      }
    };

    checkNonEmpty(translations.en);
    checkNonEmpty(translations.pl);
  });
});
