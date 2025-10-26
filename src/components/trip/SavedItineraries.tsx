import { memo } from "react";
import { Trash2, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/hooks/useLanguage";
import type { SavedItinerariesProps } from "@/types/itinerary";
import { useToast } from "@/hooks/useToast";

const SavedItinerariesComponent = ({
  itineraries,
  onDelete,
  onClearAll,
  onView,
}: SavedItinerariesProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleDelete = (id: string, destination: string) => {
    onDelete(id);
    toast({
      title: "Deleted",
      description: `Itinerary for ${destination} has been removed`,
    });
  };

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">{t.saved.title}</h2>
            {itineraries.length > 0 && (
              <Button variant="destructive" onClick={onClearAll}>
                {t.saved.clear}
              </Button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {itineraries.map((itinerary) => (
              <article
                key={itinerary.id}
                className="bg-card/80 backdrop-blur-glass border border-glass-border rounded-xl p-6 shadow-glass hover:shadow-glow transition-all cursor-pointer group"
                onClick={() => onView(itinerary)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onView(itinerary);
                  }
                }}
                aria-label={`View itinerary for ${itinerary.destination}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold flex items-center gap-2 group-hover:text-primary transition-colors">
                      <MapPin className="w-5 h-5" />
                      {itinerary.destination}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
                      <Calendar className="w-4 h-4" />
                      {itinerary.days} {t.saved.days}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(itinerary.id, itinerary.destination);
                    }}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    aria-label={`Delete itinerary for ${itinerary.destination}`}
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </Button>
                </div>

                <div className="text-sm text-muted-foreground line-clamp-3">
                  {itinerary.content.substring(0, 150)}...
                </div>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-primary font-semibold">
                    ${itinerary.estimatedCost || 0} {t.results.perPerson}
                  </span>
                  <span className="text-muted-foreground">
                    {itinerary.createdAt
                      ? new Date(itinerary.createdAt).toLocaleDateString()
                      : "Unknown date"}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const SavedItineraries = memo(SavedItinerariesComponent);
