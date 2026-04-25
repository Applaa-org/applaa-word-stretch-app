import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { APP_CONFIG } from "@/app-config";
import { THEMES } from "@/components/applaa/presets/themes";
import type { AppItem } from "@/app-config";
import { SearchBar } from "./SearchBar";
import { EmptyState } from "./EmptyState";

interface DataTimelineProps {
  items?: AppItem[];
  onItemClick?: (item: AppItem) => void;
}

function normaliseDateGroup(dateStr?: string): string {
  if (!dateStr) return "Earlier";
  const d = dateStr.toLowerCase();
  if (d === "today" || d === "just now") return "Today";
  if (d === "yesterday" || d === "1 day ago") return "Yesterday";
  if (d.includes("day") && (d.includes("2") || d.includes("3"))) return "This Week";
  if (d.includes("week")) return "This Week";
  if (d.includes("month")) return "This Month";
  return dateStr; // Use as-is for explicit dates
}

export function DataTimeline({ items, onItemClick }: DataTimelineProps) {
  const navigate = useNavigate();
  const theme = THEMES[APP_CONFIG.theme];
  const [search, setSearch] = useState("");

  const data = items ?? APP_CONFIG.items;
  const showSearch = APP_CONFIG.features.search;

  const handleClick: ((item: AppItem) => void) | undefined =
    onItemClick ?? (APP_CONFIG.features.detail
      ? (item: AppItem) => navigate(`/item/${item.id}`)
      : undefined);

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter(i => i.title.toLowerCase().includes(q) || i.subtitle?.toLowerCase().includes(q));
  }, [data, search]);

  // Group by date label
  const groups = useMemo(() => {
    const map = new Map<string, AppItem[]>();
    const groupOrder: string[] = [];
    filtered.forEach(item => {
      const group = normaliseDateGroup(item.date);
      if (!map.has(group)) {
        map.set(group, []);
        groupOrder.push(group);
      }
      map.get(group)!.push(item);
    });
    return groupOrder.map(g => ({ label: g, items: map.get(g)! }));
  }, [filtered]);

  return (
    <div>
      {showSearch && <SearchBar value={search} onChange={setSearch} className="mb-3" />}

      {filtered.length === 0 ? (
        <EmptyState query={search} />
      ) : (
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-4 top-6 bottom-6 w-0.5 bg-gradient-to-b from-transparent via-gray-200 to-transparent" />

          <div className="space-y-6">
            {groups.map(({ label, items: groupItems }) => (
              <div key={label}>
                {/* Date group label */}
                <div className="flex items-center gap-3 mb-3">
                  <div className={`relative z-10 w-8 h-8 rounded-full ${theme.primaryClass} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <span className="text-white text-[10px] font-black">
                      {label === "Today" ? "●" : label === "Yesterday" ? "○" : "◇"}
                    </span>
                  </div>
                  <span className={`text-sm font-black ${theme.primaryText} bg-white/60 px-3 py-1 rounded-full backdrop-blur-sm`}>
                    {label}
                  </span>
                </div>

                {/* Items in this group */}
                <div className="ml-12 space-y-2">
                  {groupItems.map(item => (
                    <div
                      key={item.id}
                      onClick={() => handleClick?.(item)}
                      className={`${theme.card} rounded-2xl p-3 shadow-md ${theme.shadow} flex items-center gap-3
                        transition-all duration-150
                        ${handleClick ? "cursor-pointer hover:scale-[1.02] active:scale-[0.98]" : ""}`}
                    >
                      {item.image && (
                        <img src={item.image} alt={item.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                      )}
                      {!item.image && item.badge && (
                        <span className="text-3xl flex-shrink-0">{item.badge}</span>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          {item.image && item.badge && <span className="text-base">{item.badge}</span>}
                          <span className="font-bold text-sm truncate">{item.title}</span>
                        </div>
                        {item.subtitle && (
                          <p className="text-xs text-gray-500 line-clamp-2">{item.subtitle}</p>
                        )}
                        {item.category && (
                          <span className={`mt-1 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${theme.pill}`}>
                            {item.category}
                          </span>
                        )}
                      </div>
                      {item.value && (
                        <span className={`text-sm font-black ${theme.primaryText} flex-shrink-0`}>{item.value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
