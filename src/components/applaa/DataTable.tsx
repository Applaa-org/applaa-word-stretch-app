import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { APP_CONFIG } from "@/app-config";
import { THEMES } from "@/components/applaa/presets/themes";
import type { AppItem } from "@/app-config";
import { SearchBar } from "./SearchBar";
import { CategoryPills } from "./CategoryPills";
import { EmptyState } from "./EmptyState";

interface DataTableProps {
  items?: AppItem[];
  onItemClick?: (item: AppItem) => void;
}

export function DataTable({ items, onItemClick }: DataTableProps) {
  const navigate = useNavigate();
  const theme = THEMES[APP_CONFIG.theme];
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const data = items ?? APP_CONFIG.items;
  const showSearch = APP_CONFIG.features.search;
  const showFilter = APP_CONFIG.features.filter;

  const handleClick: ((item: AppItem) => void) | undefined =
    onItemClick ?? (APP_CONFIG.features.detail
      ? (item: AppItem) => navigate(`/item/${item.id}`)
      : undefined);

  const filtered = useMemo(() => {
    let result = data;
    if (activeCategory !== "All") result = result.filter(i => i.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(i => i.title.toLowerCase().includes(q) || i.subtitle?.toLowerCase().includes(q));
    }
    return result;
  }, [data, search, activeCategory]);

  return (
    <div>
      {showSearch && <SearchBar value={search} onChange={setSearch} className="mb-3" />}
      {showFilter && APP_CONFIG.categories.length > 1 && (
        <CategoryPills active={activeCategory} onSelect={setActiveCategory} className="mb-4" />
      )}
      {filtered.length === 0 ? (
        <EmptyState query={search} />
      ) : (
        <div className={`${theme.card} rounded-2xl shadow-xl ${theme.shadow} overflow-hidden`}>
          {/* Table header */}
          <div className={`flex items-center px-4 py-2.5 border-b border-black/5 ${theme.primaryLight}`}>
            <span className={`flex-1 text-xs font-black uppercase tracking-wider ${theme.primaryText}`}>Item</span>
            <span className={`w-20 text-right text-xs font-black uppercase tracking-wider ${theme.primaryText}`}>Value</span>
            <span className={`w-20 text-right text-xs font-black uppercase tracking-wider ${theme.primaryText} hidden sm:block`}>Date</span>
          </div>

          {/* Rows */}
          {filtered.map((item, index) => (
            <div
              key={item.id}
              onClick={() => handleClick?.(item)}
              className={`flex items-center px-4 py-3 gap-3 transition-all duration-150
                ${index !== filtered.length - 1 ? "border-b border-black/5" : ""}
                ${handleClick ? "cursor-pointer hover:bg-black/5 active:bg-black/10" : ""}`}
            >
              {/* Badge + title + subtitle */}
              <div className="flex-1 min-w-0 flex items-center gap-2">
                {item.badge && <span className="text-lg flex-shrink-0">{item.badge}</span>}
                <div className="min-w-0">
                  <div className="font-bold text-sm truncate">{item.title}</div>
                  {item.subtitle && (
                    <div className="text-xs text-gray-400 truncate">{item.subtitle}</div>
                  )}
                </div>
              </div>

              {/* Value */}
              <div className="w-20 text-right flex-shrink-0">
                {item.value && (
                  <span className={`text-sm font-black ${theme.primaryText}`}>{item.value}</span>
                )}
                {item.progress !== undefined && (
                  <div className="mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full ${theme.primaryClass} rounded-full`} style={{ width: `${item.progress}%` }} />
                  </div>
                )}
              </div>

              {/* Date */}
              <div className="w-20 text-right flex-shrink-0 hidden sm:block">
                {item.date && (
                  <span className="text-xs text-gray-400">{item.date}</span>
                )}
                {item.category && !item.date && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${theme.pill}`}>{item.category}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
