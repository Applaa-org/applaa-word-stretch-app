import { APP_CONFIG } from "@/app-config";
import { THEMES } from "@/components/applaa/presets/themes";
import type { AppItem } from "@/app-config";

interface DataCardProps {
  item: AppItem;
  onClick?: (item: AppItem) => void;
  layout?: "card" | "row";
}

export function DataCard({ item, onClick, layout = "card" }: DataCardProps) {
  const theme = THEMES[APP_CONFIG.theme];
  const clickable = !!onClick;

  if (layout === "row") {
    return (
      <div
        onClick={() => onClick?.(item)}
        className={`${theme.card} rounded-2xl p-4 shadow-md ${theme.shadow} flex items-center gap-4
          transition-all duration-200 ${clickable ? "cursor-pointer hover:scale-[1.02] active:scale-[0.98]" : ""}`}
      >
        {item.image && (
          <img
            src={item.image}
            alt={item.title}
            className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            {item.badge && <span className="text-lg">{item.badge}</span>}
            <span className="font-bold text-sm truncate">{item.title}</span>
          </div>
          {item.subtitle && (
            <p className="text-xs text-gray-500 truncate">{item.subtitle}</p>
          )}
          {item.progress !== undefined && (
            <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${theme.primaryClass} rounded-full transition-all duration-500`}
                style={{ width: `${item.progress}%` }}
              />
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          {item.value && (
            <span className={`text-sm font-black ${theme.primaryText}`}>{item.value}</span>
          )}
          {item.date && (
            <span className="text-xs text-gray-400">{item.date}</span>
          )}
        </div>
      </div>
    );
  }

  // card layout (grid)
  return (
    <div
      onClick={() => onClick?.(item)}
      className={`${theme.card} rounded-2xl overflow-hidden shadow-lg ${theme.shadow}
        transition-all duration-200 ${clickable ? "cursor-pointer hover:scale-[1.03] active:scale-[0.97]" : ""}`}
    >
      {item.image && (
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-36 object-cover"
        />
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-1.5">
            {item.badge && <span className="text-xl">{item.badge}</span>}
            <span className="font-bold text-sm leading-tight">{item.title}</span>
          </div>
          {item.value && (
            <span className={`text-xs font-black ${theme.primaryText} whitespace-nowrap`}>
              {item.value}
            </span>
          )}
        </div>
        {item.subtitle && (
          <p className="text-xs text-gray-500 line-clamp-2">{item.subtitle}</p>
        )}
        {item.progress !== undefined && (
          <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${theme.primaryClass} rounded-full transition-all duration-700`}
              style={{ width: `${item.progress}%` }}
            />
          </div>
        )}
        <div className="flex items-center justify-between mt-2">
          {item.category && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${theme.pill}`}>
              {item.category}
            </span>
          )}
          {item.date && (
            <span className="text-[10px] text-gray-400 ml-auto">{item.date}</span>
          )}
        </div>
      </div>
    </div>
  );
}
