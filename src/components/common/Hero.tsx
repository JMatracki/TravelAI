import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "../ui/Button";
import { useLanguage } from "@/hooks/useLanguage";
import heroImage from "@/assets/images/hero-travel.jpg";

export const Hero = ({ onGetStarted }: { onGetStarted: () => void }) => {
  const { t } = useLanguage();

  return (
    <section
      className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden"
      aria-label="Hero"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white mb-4 shadow-lg">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="text-sm font-medium">{t.footer.powered}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            {t.hero.title}
          </h1>

          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            {t.hero.subtitle}
          </p>

          <Button
            size="lg"
            onClick={onGetStarted}
            className="bg-gradient-vacation text-white hover:shadow-vacation-glow shadow-xl text-lg px-8 py-6 rounded-full group border-2 border-white/30"
          >
            {t.hero.cta}
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      <div className="absolute top-20 left-10 w-96 h-96 bg-amber-400 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-float" />
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-float"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-float"
        style={{ animationDelay: "2s" }}
      />
    </section>
  );
};
