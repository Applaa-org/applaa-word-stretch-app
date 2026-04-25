import { useNavigate } from "react-router-dom";
import { APP_CONFIG } from "@/app-config";
import { THEMES } from "@/components/applaa/presets/themes";
import type { AppItem } from "@/app-config";
import { SectionHeader } from "./SectionHeader";

interface HorizontalScrollProps {
  items: AppItem[];
  title?: string;
  emoji?: string;
  onItemClick?: (item: AppItem) => void;
  onSeeAll?: () => void;
}

export function HorizontalScroll({ items, title, emoji, onItemClick, onSeeAll }: HorizontalScrollProps) {
  const navigate = useNavigate();
  const theme = THEMES[APP_CONFIG.theme];

  const handleClick: ((item: AppItem) => void) | undefined =
    onItemClick ?? (APP_CONFIG.features.detail
      ? (item: AppItem) => navigate(`/item/${item.id}`)
      : undefined);

  if (items.length === 0) return null;

  return (
    <div className="mb-6">
      {title && (
        <SectionHeader title={title} emoji={emoji} count={items.length} onSeeAll={onSeeAll} />
      )}

      {/* Horizontally scrollable row */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {items.map(item => (
          <div
            key={item.id}
            onClick={() => handleClick?.(item)}
            className={`${theme.card} rounded-2xl overflow-hidden shadow-lg ${theme.shadow} flex-shrink-0 w-36
              transition-all duration-200 ${handleClick ? "cursor-pointer hover:scale-[1.04] active:scale-[0.96]" : ""}`}
          >
            {item.image && (
              <img src={item.image} alt={item.title} className="w-full h-24 object-cover" />
            )}
            <div className="p-2.5">
              <div className="flex items-center gap-1 mb-0.5">
                {item.badge && <span className="text-base">{item.badge}</span>}
                <span className="font-bold text-xs truncate">{item.title}</span>
              </div>
              {item.value && (
                <span className={`text-xs font-black ${theme.primaryText}`}>{item.value}</span>
              )}
              {item.category && !item.value && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${theme.pill}`}>{item.category}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
