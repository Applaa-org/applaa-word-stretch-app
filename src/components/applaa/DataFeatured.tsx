import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { APP_CONFIG } from "@/app-config";
import { THEMES } from "@/components/applaa/presets/themes";
import type { AppItem } from "@/app-config";
import { DataCard } from "./DataCard";
import { SearchBar } from "./SearchBar";
import { CategoryPills } from "./CategoryPills";
import { EmptyState } from "./EmptyState";

interface DataFeaturedProps {
  items?: AppItem[];
  onItemClick?: (item: AppItem) => void;
}

export function DataFeatured({ items, onItemClick }: DataFeaturedProps) {
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

  const [hero, ...rest] = filtered;

  return (
    <div>
      {showSearch && <SearchBar value={search} onChange={setSearch} className="mb-3" />}
      {showFilter && APP_CONFIG.categories.length > 1 && (
        <CategoryPills active={activeCategory} onSelect={setActiveCategory} className="mb-4" />
      )}

      {/* Hero card — full-width, tall */}
      <div
        onClick={() => handleClick?.(hero)}
        className={`${theme.card} rounded-3xl overflow-hidden shadow-2xl ${theme.shadow} mb-4
          transition-all duration-200 ${handleClick ? "cursor-pointer hover:scale-[1.02] active:scale-[0.98]" : ""}`}
      >
        {hero.image && (
          <div className="relative">
            <img src={hero.image} alt={hero.title} className="w-full h-52 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {hero.badge && (
              <span className="absolute top-3 left-3 text-2xl">{hero.badge}</span>
            )}
            {hero.value && (
              <span className={`absolute top-3 right-3 text-sm font-black px-3 py-1 rounded-full bg-black/40 text-white`}>
                {hero.value}
              </span>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h2 className="text-xl font-black text-white drop-shadow-lg">{hero.title}</h2>
              {hero.subtitle && (
                <p className="text-sm text-white/80 line-clamp-2 mt-0.5">{hero.subtitle}</p>
              )}
            </div>
          </div>
        )}
        {!hero.image && (
          <div className="p-5">
            <div className="flex items-center gap-2 mb-1">
              {hero.badge && <span className="text-2xl">{hero.badge}</span>}
              <h2 className="text-xl font-black">{hero.title}</h2>
            </div>
            {hero.subtitle && <p className="text-sm text-gray-500">{hero.subtitle}</p>}
          </div>
        )}
        {hero.progress !== undefined && (
          <div className="px-4 pb-4">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className={`h-full ${theme.primaryClass} rounded-full`} style={{ width: `${hero.progress}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Remaining items in 2-col grid */}
      {rest.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {rest.map(item => (
            <DataCard key={item.id} item={item} onClick={handleClick} layout="card" />
          ))}
        </div>
      )}
    </div>
  );
}
