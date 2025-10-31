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

describe("useItinerary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns initial state", () => {
    const { result } = renderHook(() => useItinerary());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(typeof result.current.generateItinerary).toBe("function");
    expect(typeof result.current.clearError).toBe("function");
    expect(typeof result.current.clearData).toBe("function");
  });

  it("generates itinerary successfully and returns the value", async () => {
    const mockItinerary: Itinerary = {
      id: "1",
      destination: "Paris",
      days: 3,
      content: "Test itinerary",
      estimatedCost: 500,
      createdAt: new Date().toISOString(),
    };

    vi.mocked(apiService.generateItinerary).mockResolvedValue(mockItinerary);
    const { result } = renderHook(() => useItinerary());

    const formData = {
      destination: "Paris",
      days: 3,
      activities: "Sightseeing",
      language: "en" as const,
    };

    let returned: Itinerary | undefined;

    await act(async () => {
      returned = await result.current.generateItinerary(formData);
    });

    expect(result.current.isLoading).toBe(false);

    expect(result.current.data).toEqual(mockItinerary);
    expect(returned).toEqual(mockItinerary);

    expect(result.current.error).toBeNull();

    expect(apiService.generateItinerary).toHaveBeenCalledTimes(1);
    expect(apiService.generateItinerary).toHaveBeenCalledWith(formData);
  });

  it("clears previous error at the start of a new request", async () => {
    vi.mocked(apiService.generateItinerary).mockRejectedValueOnce(
      new Error("Boom")
    );
    const { result } = renderHook(() => useItinerary());

    await act(async () => {
      await result.current
        .generateItinerary({
          destination: "X",
          days: 1,
          activities: "Y",
          language: "en",
        })
        .catch(() => {});
    });
    expect(result.current.error).toBe("Boom");

    const ok: Itinerary = {
      id: "ok",
      destination: "OK",
      days: 2,
      content: "OK",
      estimatedCost: 1,
      createdAt: new Date().toISOString(),
    };
    vi.mocked(apiService.generateItinerary).mockResolvedValueOnce(ok);

    await act(async () => {
      await result.current.generateItinerary({
        destination: "OK",
        days: 2,
        activities: "OK",
        language: "en",
      });
    });

    expect(result.current.error).toBeNull();
    expect(result.current.data).toEqual(ok);
  });

  it("handles generation error (Error instance) and propagates rejection", async () => {
    const err = new Error("Generation failed");
    vi.mocked(apiService.generateItinerary).mockRejectedValue(err);

    const { result } = renderHook(() => useItinerary());

    await act(async () => {
      await expect(
        result.current.generateItinerary({
          destination: "Paris",
          days: 3,
          activities: "Sightseeing",
          language: "en",
        })
      ).rejects.toThrow("Generation failed");
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe("Generation failed");
  });

  it("handles non-Error rejection with a default message", async () => {
    vi.mocked(apiService.generateItinerary).mockRejectedValue("nope");

    const { result } = renderHook(() => useItinerary());

    await act(async () => {
      await expect(
        result.current.generateItinerary({
          destination: "Rome",
          days: 2,
          activities: "Food",
          language: "en",
        })
      ).rejects.toBe("nope");
    });

    expect(result.current.error).toBe("Failed to generate itinerary");
  });

  it("sets loading state during generation and unsets after resolve", async () => {
    let resolvePromise!: (value: Itinerary) => void;
    const pending = new Promise<Itinerary>((res) => (resolvePromise = res));

    vi.mocked(apiService.generateItinerary).mockReturnValue(
      pending as unknown as Promise<Itinerary>
    );

    const { result } = renderHook(() => useItinerary());

    act(() => {
      result.current.generateItinerary({
        destination: "Paris",
        days: 3,
        activities: "Sightseeing",
        language: "en",
      });
    });

    expect(result.current.isLoading).toBe(true);

    resolvePromise({
      id: "1",
      destination: "Paris",
      days: 3,
      content: "Test itinerary",
      estimatedCost: 500,
      createdAt: new Date().toISOString(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data?.id).toBe("1");
    });
  });

  it("clearError and clearData reset the corresponding state", () => {
    const { result } = renderHook(() => useItinerary());

    act(() => {
      result.current.clearError();
      result.current.clearData();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.data).toBeNull();
  });

  it("last-resolved request wins (race condition behavior)", async () => {
    let resolveA!: (v: Itinerary) => void;
    let resolveB!: (v: Itinerary) => void;
    const pA = new Promise<Itinerary>((res) => (resolveA = res));
    const pB = new Promise<Itinerary>((res) => (resolveB = res));

    vi.mocked(apiService.generateItinerary)
      .mockReturnValueOnce(pA as unknown as Promise<Itinerary>)
      .mockReturnValueOnce(pB as unknown as Promise<Itinerary>);

    const { result } = renderHook(() => useItinerary());

    act(() => {
      result.current.generateItinerary({
        destination: "A",
        days: 1,
        activities: "A",
        language: "en",
      });
    });

    act(() => {
      result.current.generateItinerary({
        destination: "B",
        days: 2,
        activities: "B",
        language: "en",
      });
    });

    resolveA({
      id: "A",
      destination: "A",
      days: 1,
      content: "A",
      estimatedCost: 100,
      createdAt: new Date().toISOString(),
    });
    resolveB({
      id: "B",
      destination: "B",
      days: 2,
      content: "B",
      estimatedCost: 200,
      createdAt: new Date().toISOString(),
    });

    await waitFor(() => {
      expect(result.current.data?.id).toBe("B");
    });
  });
});
