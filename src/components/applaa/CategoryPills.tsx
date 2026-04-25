import { APP_CONFIG } from "@/app-config";
import { THEMES } from "@/components/applaa/presets/themes";

interface CategoryPillsProps {
  active?: string;
  onSelect?: (cat: string) => void;
  categories?: string[];
  className?: string;
}

export function CategoryPills({
  active = "All",
  onSelect,
  categories,
  className = "",
}: CategoryPillsProps) {
  const theme = THEMES[APP_CONFIG.theme];
  const cats = categories ?? APP_CONFIG.categories;

  return (
    <div className={`flex gap-2 overflow-x-auto pb-1 scrollbar-hide ${className}`}>
      {cats.map((cat) => {
        const isActive = cat === active;
        return (
          <button
            key={cat}
            onClick={() => onSelect?.(cat)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-semibold border
              transition-all duration-200 flex-shrink-0
              ${isActive
                ? `${theme.pillActive} border-transparent shadow-md scale-105`
                : `${theme.pill} hover:scale-105`
              }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
