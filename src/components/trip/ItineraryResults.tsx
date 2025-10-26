import { useState, memo } from "react";
import { Download, Save, DollarSign, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/useToast";
import { PDF_CONFIG, UI_CONFIG } from "@/lib/config/constants";
import { ItineraryResultsProps } from "@/types/itinerary";

const ItineraryResultsComponent = ({
  itinerary,
  onSave,
}: ItineraryResultsProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    onSave(itinerary);
    setIsSaved(true);
    toast({
      title: t.results.saved,
      description: t.toasts.saveSuccess,
    });
    setTimeout(() => setIsSaved(false), UI_CONFIG.TOAST_DURATION);
  };

  const handleExportPDF = async () => {
    try {
      const { default: jsPDF } = await import("jspdf");
      const doc = new jsPDF();

      const cleanContent = itinerary.content
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/#{1,6}\s*/g, "")
        .replace(/```[\s\S]*?```/g, "")
        .replace(/`(.*?)`/g, "$1")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/^\s*[-*+]\s*/gm, "• ")
        .replace(/^\s*\d+\.\s*/gm, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

      doc.setFont("helvetica", "normal");

      doc.setFontSize(20);
      doc.text(
        `${t.results.title} - ${itinerary.destination || t.results.unknownPlace}`,
        20,
        30
      );

      doc.setFontSize(12);
      doc.text(
        `${t.results.duration}: ${itinerary.days || 0} ${t.results.days}`,
        20,
        50
      );
      doc.text(
        `${t.results.estimatedCost}: $${itinerary.estimatedCost || 0} ${t.results.perPerson}`,
        20,
        60
      );

      doc.setFontSize(10);

      const lines = doc.splitTextToSize(cleanContent, 170);

      let yPosition = 80;
      const pageHeight = doc.internal.pageSize.height;
      const margin = PDF_CONFIG.PAGE_MARGIN;
      const lineHeight = PDF_CONFIG.LINE_HEIGHT;

      lines.forEach((line: string) => {
        if (yPosition > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }

        if (line.startsWith("• ")) {
          doc.setFontSize(PDF_CONFIG.FONT_SIZE.SMALL);
          doc.text(line, 25, yPosition);
          doc.setFontSize(PDF_CONFIG.FONT_SIZE.BODY);
        } else if (line.trim().length === 0) {
          yPosition += lineHeight / 2;
        } else {
          doc.text(line, margin, yPosition);
        }

        yPosition += lineHeight;
      });

      const fileName = `${(itinerary.destination || "plan-podrozy").replace(/\s+/g, "-")}-plan.pdf`;
      doc.save(fileName);

      toast({
        title: t.results.saved,
        description: t.toasts.pdfSuccess,
      });
    } catch (error) {
      console.error("PDF Export Error:", error);
      toast({
        title: t.results.saved,
        description: t.toasts.pdfError,
        variant: "destructive",
      });
    }
  };

  return (
    <section className="py-20 bg-gradient-subtle" role="article">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
          <div className="flex flex-col ssm:flex-row justify-between items-center gap-4 bg-card/80 backdrop-blur-glass border border-glass-border rounded-xl p-6 shadow-glass">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {t.results.title}
              </h2>
              <p className="text-muted-foreground mt-1">
                {itinerary.destination}
              </p>
            </div>

            <div className="flex items-center gap-2 bg-primary/10 px-4 py-3 rounded-xl">
              <DollarSign className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">
                  {t.results.estimatedCost}
                </p>
                <p className="text-2xl font-bold text-primary">
                  ${itinerary.estimatedCost || 0}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t.results.perPerson}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card/80 backdrop-blur-glass border border-glass-border rounded-xl p-8 shadow-glass">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap">{itinerary.content}</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              onClick={handleSave}
              className="bg-gradient-primary hover:opacity-90 text-white shadow-glow"
              size="lg"
              disabled={isSaved}
              aria-label={isSaved ? "Itinerary saved" : "Save this itinerary"}
            >
              {isSaved ? (
                <>
                  <Check className="mr-2 h-5 w-5" aria-hidden="true" />
                  {t.results.saved}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" aria-hidden="true" />
                  {t.results.save}
                </>
              )}
            </Button>

            <Button
              onClick={handleExportPDF}
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              aria-label="Export itinerary as PDF"
            >
              <Download className="mr-2 h-5 w-5" aria-hidden="true" />
              {t.results.export}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export const ItineraryResults = memo(ItineraryResultsComponent);
