import { APP_CONFIG } from "@/app-config";
import { THEMES } from "@/components/applaa/presets/themes";
import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  emoji?: string;
  count?: number;
  onSeeAll?: () => void;
  className?: string;
}

export function SectionHeader({ title, emoji, count, onSeeAll, className = "" }: SectionHeaderProps) {
  const theme = THEMES[APP_CONFIG.theme];

  return (
    <div className={`flex items-center justify-between mb-3 ${className}`}>
      <div className="flex items-center gap-2">
        {emoji && <span className="text-xl">{emoji}</span>}
        <h2 className="text-lg font-black">{title}</h2>
        {count !== undefined && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${theme.primaryLight} ${theme.primaryText}`}>
            {count}
          </span>
        )}
      </div>
      {onSeeAll && (
        <button
          onClick={onSeeAll}
          className={`flex items-center gap-0.5 text-sm font-bold ${theme.primaryText} hover:opacity-70 transition-opacity`}
        >
          See all <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
