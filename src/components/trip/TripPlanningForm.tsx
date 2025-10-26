import { useState, useEffect, memo } from "react";
import { MapPin, Calendar, Compass, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/useToast";
import { FORM_LIMITS } from "@/lib/config/constants";
import type { TripFormData, TripPlanningFormProps } from "@/types/itinerary";

const TripPlanningFormComponent = ({
  onGenerate,
  isLoading: externalLoading,
}: TripPlanningFormProps) => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<TripFormData>({
    destination: "",
    days: 3,
    activities: "",
    language: language,
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, language }));
  }, [language]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.destination.trim()) {
      toast({
        title: "Error",
        description: "Please enter a destination",
        variant: "destructive",
      });
      return;
    }

    if (externalLoading || isLoading) return;

    setIsLoading(true);
    try {
      await onGenerate(formData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate itinerary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="plan" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card/80 backdrop-blur-glass border border-glass-border rounded-2xl p-8 shadow-glass">
            <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-primary bg-clip-text text-transparent">
              {t.form.title}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6" role="form">
              <div className="space-y-2">
                <Label
                  htmlFor="destination"
                  className="flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" aria-hidden="true" />
                  {t.form.destination}
                </Label>
                <Input
                  id="destination"
                  name="destination"
                  placeholder={t.form.destinationPlaceholder}
                  value={formData.destination}
                  onChange={(e) =>
                    setFormData({ ...formData, destination: e.target.value })
                  }
                  className="bg-background/50"
                  disabled={externalLoading || isLoading}
                  aria-required="true"
                  aria-describedby="destination-description"
                />
                <p id="destination-description" className="sr-only">
                  Enter the destination where you want to travel
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="days" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" aria-hidden="true" />
                  {t.form.days}
                </Label>
                <Input
                  id="days"
                  name="days"
                  type="number"
                  min={FORM_LIMITS.MIN_DAYS}
                  max={FORM_LIMITS.MAX_DAYS}
                  value={formData.days}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      days: parseInt(e.target.value) || 1,
                    })
                  }
                  className="bg-background/50"
                  disabled={externalLoading || isLoading}
                  aria-required="true"
                  aria-describedby="days-description"
                />
                <p id="days-description" className="sr-only">
                  Enter the number of days for your trip (1-30)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="activities" className="flex items-center gap-2">
                  <Compass className="w-4 h-4" aria-hidden="true" />
                  {t.form.activities}
                </Label>
                <Textarea
                  id="activities"
                  name="activities"
                  placeholder={t.form.activitiesPlaceholder}
                  value={formData.activities}
                  onChange={(e) =>
                    setFormData({ ...formData, activities: e.target.value })
                  }
                  className="bg-background/50 min-h-[100px]"
                  disabled={externalLoading || isLoading}
                  aria-required="true"
                  aria-describedby="activities-description"
                />
                <p id="activities-description" className="sr-only">
                  Describe your preferred activities and interests
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:opacity-90 text-white shadow-glow"
                size="lg"
                disabled={externalLoading || isLoading}
              >
                {externalLoading || isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t.form.generating}
                  </>
                ) : (
                  t.form.generate
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export const TripPlanningForm = memo(TripPlanningFormComponent);
