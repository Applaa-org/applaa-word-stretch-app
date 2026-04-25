import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { APP_CONFIG } from "@/app-config";
import { THEMES } from "@/components/applaa/presets/themes";
import type { AppItem } from "@/app-config";
import { SearchBar } from "./SearchBar";
import { EmptyState } from "./EmptyState";

interface DataKanbanProps {
  items?: AppItem[];
  onItemClick?: (item: AppItem) => void;
}

export function DataKanban({ items, onItemClick }: DataKanbanProps) {
  const navigate = useNavigate();
  const theme = THEMES[APP_CONFIG.theme];
  const [search, setSearch] = useState("");

  const data = items ?? APP_CONFIG.items;
  const showSearch = APP_CONFIG.features.search;

  const handleClick: ((item: AppItem) => void) | undefined =
    onItemClick ?? (APP_CONFIG.features.detail
      ? (item: AppItem) => navigate(`/item/${item.id}`)
      : undefined);

  // Build columns from categories (excluding "All")
  const columns = APP_CONFIG.categories.filter(c => c !== "All");

  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter(i => i.title.toLowerCase().includes(q) || i.subtitle?.toLowerCase().includes(q));
  }, [data, search]);

  const itemsByColumn = useMemo(() => {
    const map: Record<string, AppItem[]> = {};
    columns.forEach(col => {
      map[col] = filteredData.filter(i => i.category === col);
    });
    // Items without a matching category go in a misc column
    const categorised = new Set(columns);
    const uncategorised = filteredData.filter(i => !i.category || !categorised.has(i.category));
    if (uncategorised.length > 0) map["Other"] = uncategorised;
    return map;
  }, [filteredData, columns]);

  const allColumns = [...columns, ...(itemsByColumn["Other"] ? ["Other"] : [])];

  if (filteredData.length === 0) {
    return (
      <div>
        {showSearch && <SearchBar value={search} onChange={setSearch} className="mb-3" />}
        <EmptyState query={search} />
      </div>
    );
  }

  return (
    <div>
      {showSearch && <SearchBar value={search} onChange={setSearch} className="mb-3" />}

      {/* Kanban columns — horizontal scroll on mobile */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
        {allColumns.map(col => {
          const colItems = itemsByColumn[col] ?? [];
          return (
            <div key={col} className="flex-shrink-0 w-48">
              {/* Column header */}
              <div className={`flex items-center justify-between px-3 py-2 rounded-xl mb-2 ${theme.primaryLight}`}>
                <span className={`text-xs font-black uppercase tracking-wider ${theme.primaryText}`}>{col}</span>
                <span className={`text-xs font-bold ${theme.primaryText} opacity-60`}>{colItems.length}</span>
              </div>

              {/* Cards in column */}
              <div className="flex flex-col gap-2">
                {colItems.map(item => (
                  <div
                    key={item.id}
                    onClick={() => handleClick?.(item)}
                    className={`${theme.card} rounded-xl p-3 shadow-md ${theme.shadow}
                      transition-all duration-150
                      ${handleClick ? "cursor-pointer hover:scale-[1.02] active:scale-[0.98]" : ""}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      {item.badge && <span className="text-base">{item.badge}</span>}
                      <span className="font-bold text-xs leading-tight line-clamp-2">{item.title}</span>
                    </div>
                    {item.value && (
                      <span className={`text-xs font-black ${theme.primaryText}`}>{item.value}</span>
                    )}
                    {item.progress !== undefined && (
                      <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full ${theme.primaryClass} rounded-full`} style={{ width: `${item.progress}%` }} />
                      </div>
                    )}
                    {item.date && (
                      <div className="mt-1 text-[10px] text-gray-400">{item.date}</div>
                    )}
                  </div>
                ))}

                {colItems.length === 0 && (
                  <div className="text-center py-6 text-xs text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                    Nothing here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
