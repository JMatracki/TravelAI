import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useItinerary } from "../useItinerary";
import { apiService } from "@/lib/api/apiService";
import type { Itinerary } from "@/types/itinerary";

vi.mock("@/lib/api/apiService", () => ({
  apiService: {
    generateItinerary: vi.fn(),
  },
}));

describe("useItinerary Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns initial state", () => {
    const { result } = renderHook(() => useItinerary());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(typeof result.current.generateItinerary).toBe("function");
  });

  it("generates itinerary successfully", async () => {
    const mockItinerary = {
      id: "1",
      destination: "Paris",
      days: 3,
      content: "Test itinerary",
      estimatedCost: 500,
      createdAt: new Date().toISOString(),
    };

    const mockGenerateItinerary = vi.mocked(apiService.generateItinerary);
    mockGenerateItinerary.mockResolvedValue(mockItinerary);

    const { result } = renderHook(() => useItinerary());

    const formData = {
      destination: "Paris",
      days: 3,
      activities: "Sightseeing",
      language: "en" as const,
    };

    await act(async () => {
      await result.current.generateItinerary(formData);
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockItinerary);
    });

    expect(vi.mocked(apiService.generateItinerary)).toHaveBeenCalledWith(
      formData
    );
  });

  it("handles generation error", async () => {
    const error = new Error("Generation failed");
    const mockGenerateItinerary = vi.mocked(apiService.generateItinerary);
    mockGenerateItinerary.mockRejectedValue(error);

    const { result } = renderHook(() => useItinerary());

    const formData = {
      destination: "Paris",
      days: 3,
      activities: "Sightseeing",
      language: "en" as const,
    };

    await act(async () => {
      try {
        await result.current.generateItinerary(formData);
      } catch (err) {
        console.warn(err);
      }
    });

    expect(result.current.error).toBe("Generation failed");
  });

  it("sets loading state during generation", async () => {
    let resolvePromise: (value: Itinerary) => void;
    const promise = new Promise<Itinerary>((resolve) => {
      resolvePromise = resolve;
    });

    const mockGenerateItinerary = vi.mocked(apiService.generateItinerary);
    mockGenerateItinerary.mockReturnValue(promise);

    const { result } = renderHook(() => useItinerary());

    const formData = {
      destination: "Paris",
      days: 3,
      activities: "Sightseeing",
      language: "en" as const,
    };

    act(() => {
      result.current.generateItinerary(formData);
    });

    expect(result.current.isLoading).toBe(true);

    resolvePromise!({
      id: "1",
      destination: "Paris",
      days: 3,
      content: "Test itinerary",
      estimatedCost: 500,
      createdAt: new Date().toISOString(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });
});
