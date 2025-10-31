import {
  useRef,
  useCallback,
  useState,
  useEffect,
  lazy,
  Suspense,
} from "react";
import { Hero } from "@/components/common/Hero";
import { TripPlanningForm } from "@/components/trip/TripPlanningForm";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useItinerary } from "@/hooks/useItinerary";
import { useLanguage } from "@/hooks/useLanguage";
import { useSavedItineraries } from "@/hooks/useSavedItineraries";
import { useScrollToSection } from "@/hooks/useScrollToSection";
import { UI_CONFIG } from "@/lib/config/constants";
import type { TripFormData, Itinerary } from "@/types/itinerary";
import { toast } from "sonner";

const ItineraryResults = lazy(() =>
  import("@/components/trip/ItineraryResults").then((module) => ({
    default: module.ItineraryResults,
  }))
);

const SavedItineraries = lazy(() =>
  import("@/components/trip/SavedItineraries").then((module) => ({
    default: module.SavedItineraries,
  }))
);

export const HomePage = () => {
  const { isLoading, data, generateItinerary } = useItinerary();
  const { t } = useLanguage();
  const {
    itineraries: savedItineraries,
    saveItinerary: saveToStorage,
    deleteItinerary: deleteFromStorage,
    clearAllItineraries: clearFromStorage,
  } = useSavedItineraries();
  const { scrollToElement } = useScrollToSection();

  const [currentItinerary, setCurrentItinerary] = useState<Itinerary | null>(
    null
  );

  const planSectionRef = useRef<HTMLDivElement>(null);
  const itinerarySectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data) {
      setCurrentItinerary(data);
    }
  }, [data]);

  const scrollToPlan = useCallback(() => {
    scrollToElement(planSectionRef.current);
  }, [scrollToElement]);

  const generateItineraryHandler = useCallback(
    async (formData: TripFormData) => {
      const loadingToastId = toast.loading(t.toasts.generating);

      try {
        await generateItinerary(formData);

        toast.dismiss(loadingToastId);
        toast.success(t.toasts.success);

        scrollToElement(itinerarySectionRef.current, UI_CONFIG.SCROLL_DELAY);
      } catch (error) {
        toast.dismiss(loadingToastId);
        toast.error(t.toasts.error);
      }
    },
    [generateItinerary, t.toasts, scrollToElement]
  );

  const saveItinerary = useCallback(
    (itinerary: Itinerary | null) => {
      if (!itinerary) return;

      const success = saveToStorage(itinerary);

      if (success) {
        toast.success(t.toasts.saveSuccess);
      } else {
        toast.error(t.toasts.saveError);
      }
    },
    [saveToStorage, t.toasts]
  );

  const deleteItinerary = useCallback(
    (id: string) => {
      const success = deleteFromStorage(id);

      if (!success) {
        toast.error(t.toasts.deleteError);
      }
    },
    [deleteFromStorage, t.toasts]
  );

  const clearAllItineraries = useCallback(() => {
    const success = clearFromStorage();

    if (success) {
      toast.success(t.toasts.saved);
    } else {
      toast.error(t.toasts.clearError);
    }
  }, [clearFromStorage, t.toasts]);

  const viewItinerary = useCallback(
    (itinerary: Itinerary) => {
      setCurrentItinerary(itinerary);
      scrollToElement(itinerarySectionRef.current, UI_CONFIG.SCROLL_DELAY);
    },
    [scrollToElement]
  );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Hero onGetStarted={scrollToPlan} />

      <div ref={planSectionRef}>
        <TripPlanningForm
          onGenerate={generateItineraryHandler}
          isLoading={isLoading}
        />
      </div>

      {currentItinerary && (
        <div ref={itinerarySectionRef}>
          <Suspense fallback={<LoadingSpinner />}>
            <ItineraryResults
              itinerary={currentItinerary}
              onSave={saveItinerary}
            />
          </Suspense>
        </div>
      )}

      {savedItineraries.length > 0 && (
        <Suspense fallback={<LoadingSpinner />}>
          <SavedItineraries
            itineraries={savedItineraries}
            onDelete={deleteItinerary}
            onClearAll={clearAllItineraries}
            onView={viewItinerary}
          />
        </Suspense>
      )}
    </div>
  );
};
