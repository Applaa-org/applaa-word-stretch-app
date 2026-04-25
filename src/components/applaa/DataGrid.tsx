import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { APP_CONFIG } from "@/app-config";
import type { AppItem } from "@/app-config";
import { DataCard } from "./DataCard";
import { CategoryPills } from "./CategoryPills";
import { SearchBar } from "./SearchBar";
import { EmptyState } from "./EmptyState";

interface DataGridProps {
  items?: AppItem[];
  onItemClick?: (item: AppItem) => void;
  columns?: 1 | 2;
}

export function DataGrid({ items, onItemClick, columns = 2 }: DataGridProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const data = items ?? APP_CONFIG.items;
  const showSearch = APP_CONFIG.features.search;
  const showFilter = APP_CONFIG.features.filter;

  // Auto-route to /item/:id when features.detail=true and no custom handler provided
  const handleClick: ((item: AppItem) => void) | undefined =
    onItemClick ?? (APP_CONFIG.features.detail
      ? (item: AppItem) => navigate(`/item/${item.id}`)
      : undefined);

  const filtered = useMemo(() => {
    let result = data;
    if (activeCategory !== "All") {
      result = result.filter((i) => i.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.subtitle?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [data, search, activeCategory]);

  return (
    <div>
      {showSearch && (
        <SearchBar value={search} onChange={setSearch} className="mb-3" />
      )}
      {showFilter && APP_CONFIG.categories.length > 1 && (
        <CategoryPills
          active={activeCategory}
          onSelect={setActiveCategory}
          className="mb-4"
        />
      )}
      {filtered.length === 0 ? (
        <EmptyState query={search} />
      ) : (
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {filtered.map((item) => (
            <DataCard
              key={item.id}
              item={item}
              onClick={handleClick}
              layout="card"
            />
          ))}
        </div>
      )}
    </div>
  );
}
