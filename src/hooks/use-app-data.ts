import { useLocalStorage } from "./use-local-storage";
import { APP_CONFIG } from "@/app-config";
import type { AppItem } from "@/app-config";

// Unique storage key per app so data never leaks between apps
const STORAGE_KEY = `applaa-${APP_CONFIG.name.toLowerCase().replace(/\s+/g, "-")}-items`;

/**
 * App-specific CRUD data hook backed by localStorage.
 * Seeds from APP_CONFIG.items on first run.
 * Use this when features.offline = true so data persists across page refreshes.
 *
 * Usage in Index.tsx:
 *   import { useAppData } from "@/hooks/use-app-data";
 *   const { items } = useAppData();
 *   <DataGrid items={items} columns={2} />
 */
export function useAppData() {
  const [items, setItems] = useLocalStorage<AppItem[]>(STORAGE_KEY, APP_CONFIG.items);

  /** Add a new item. Id is generated automatically from timestamp. */
  const addItem = (item: Omit<AppItem, "id">) =>
    setItems((prev) => [...prev, { ...item, id: Date.now() }]);

  /** Update specific fields of an existing item by id. */
  const updateItem = (id: number, updates: Partial<AppItem>) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i)));

  /** Remove an item by id. */
  const deleteItem = (id: number) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  /** Reset all items back to the defaults defined in app-config.ts. */
  const resetToDefaults = () => setItems(APP_CONFIG.items);

  return { items, addItem, updateItem, deleteItem, resetToDefaults };
}
