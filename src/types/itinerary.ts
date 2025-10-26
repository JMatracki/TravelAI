export interface TripFormData {
  destination: string;
  days: number;
  activities: string;
  language: "en" | "pl";
}

export interface TripPlanningFormProps {
  onGenerate: (data: TripFormData) => Promise<void>;
  isLoading?: boolean;
}

export interface Itinerary {
  id: string;
  destination: string;
  days: number;
  content: string;
  estimatedCost: number;
  createdAt: string;
}

export interface ItineraryResultsProps {
  itinerary: Itinerary;
  onSave: (itinerary: Itinerary) => void;
}

export interface SavedItinerariesProps {
  itineraries: Itinerary[];
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onView: (itinerary: Itinerary) => void;
}
