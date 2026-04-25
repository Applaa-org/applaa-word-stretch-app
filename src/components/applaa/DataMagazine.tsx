import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { APP_CONFIG } from "@/app-config";
import { THEMES } from "@/components/applaa/presets/themes";
import type { AppItem } from "@/app-config";
import { DataCard } from "./DataCard";
import { SearchBar } from "./SearchBar";
import { CategoryPills } from "./CategoryPills";
import { EmptyState } from "./EmptyState";

interface DataMagazineProps {
  items?: AppItem[];
  onItemClick?: (item: AppItem) => void;
}

export function DataMagazine({ items, onItemClick }: DataMagazineProps) {
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

  if (filtered.length === 0) {
    return (
      <div>
        {showSearch && <SearchBar value={search} onChange={setSearch} className="mb-3" />}
        {showFilter && APP_CONFIG.categories.length > 1 && (
          <CategoryPills active={activeCategory} onSelect={setActiveCategory} className="mb-4" />
        )}
        <EmptyState query={search} />
      </div>
    );
  }

  const [main, ...sidebar] = filtered;

  return (
    <div>
      {showSearch && <SearchBar value={search} onChange={setSearch} className="mb-3" />}
      {showFilter && APP_CONFIG.categories.length > 1 && (
        <CategoryPills active={activeCategory} onSelect={setActiveCategory} className="mb-4" />
      )}

      {/* Magazine layout: tall left + stacked right */}
      <div className="flex gap-3 mb-4">
        {/* Left — main feature card */}
        <div
          onClick={() => handleClick?.(main)}
          className={`${theme.card} rounded-2xl overflow-hidden shadow-xl ${theme.shadow} flex-[3]
            transition-all duration-200 ${handleClick ? "cursor-pointer hover:scale-[1.02] active:scale-[0.98]" : ""}`}
        >
          {main.image && (
            <div className="relative">
              <img src={main.image} alt={main.title} className="w-full h-48 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              {main.badge && <span className="absolute top-2 left-2 text-xl">{main.badge}</span>}
            </div>
          )}
          <div className="p-3">
            <h2 className="font-black text-base leading-tight mb-1">{main.title}</h2>
            {main.subtitle && <p className="text-xs text-gray-500 line-clamp-3">{main.subtitle}</p>}
            {main.value && (
              <span className={`mt-2 inline-block text-sm font-black ${theme.primaryText}`}>{main.value}</span>
            )}
          </div>
        </div>

        {/* Right — stacked smaller cards */}
        {sidebar.length > 0 && (
          <div className="flex-[2] flex flex-col gap-2">
            {sidebar.slice(0, 3).map(item => (
              <div
                key={item.id}
                onClick={() => handleClick?.(item)}
                className={`${theme.card} rounded-xl overflow-hidden shadow-md ${theme.shadow} flex
                  transition-all duration-200 ${handleClick ? "cursor-pointer hover:scale-[1.02] active:scale-[0.98]" : ""}`}
              >
                {item.image && (
                  <img src={item.image} alt={item.title} className="w-16 h-16 object-cover flex-shrink-0" />
                )}
                <div className="p-2 flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-0.5">
                    {item.badge && <span className="text-sm">{item.badge}</span>}
                    <span className="font-bold text-xs truncate">{item.title}</span>
                  </div>
                  {item.value && <span className={`text-xs font-black ${theme.primaryText}`}>{item.value}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Remaining items as standard cards */}
      {filtered.slice(4).length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {filtered.slice(4).map(item => (
            <DataCard key={item.id} item={item} onClick={handleClick} layout="card" />
          ))}
        </div>
      )}
    </div>
  );
}
