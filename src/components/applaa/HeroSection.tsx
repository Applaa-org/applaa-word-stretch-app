import { APP_CONFIG } from "@/app-config";
import { THEMES } from "@/components/applaa/presets/themes";
import { ActionButton } from "./ActionButton";

interface HeroSectionProps {
  onCtaClick?: () => void;
  subtitle?: string;
}

export function HeroSection({ onCtaClick, subtitle }: HeroSectionProps) {
  const theme = THEMES[APP_CONFIG.theme];
  const isDark = APP_CONFIG.theme === "DEEP_SPACE" || APP_CONFIG.theme === "NEON";

  return (
    <div className="pt-10 pb-8 text-center relative">
      {/* Floating emoji */}
      <div className="text-7xl mb-4 inline-block animate-bounce">
        {APP_CONFIG.emoji}
      </div>

      <h1
        className={`text-4xl font-black tracking-tight mb-2 ${
          isDark ? "text-white" : "text-white"
        } drop-shadow-lg`}
      >
        {APP_CONFIG.name}
      </h1>

      <p
        className={`text-lg font-medium mb-6 ${
          isDark ? "text-white/80" : "text-white/90"
        }`}
      >
        {subtitle ?? APP_CONFIG.tagline}
      </p>

      {onCtaClick && (
        <ActionButton onClick={onCtaClick} size="lg" className="mx-auto">
          {APP_CONFIG.cta.icon && <span>{APP_CONFIG.cta.icon}</span>}
          {APP_CONFIG.cta.label}
        </ActionButton>
      )}

      {/* Decorative blobs */}
      <div
        className={`absolute -top-4 -right-4 w-32 h-32 rounded-full opacity-20 blur-2xl bg-white`}
        aria-hidden
      />
      <div
        className={`absolute -bottom-4 -left-8 w-40 h-40 rounded-full opacity-15 blur-3xl bg-white`}
        aria-hidden
      />
    </div>
  );
}
