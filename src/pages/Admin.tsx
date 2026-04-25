import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppData } from "@/hooks/use-app-data";
import { APP_CONFIG } from "@/app-config";
import type { AppItem } from "@/app-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { THEMES } from "@/components/applaa/presets/themes";

// ── Admin Page ────────────────────────────────────────────────────────────────

export function Admin() {
  const { items, addItem, updateItem, deleteItem, resetToDefaults } = useAppData();
  const [editItem, setEditItem] = useState<AppItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const theme = THEMES[APP_CONFIG.theme];

  const handleDelete = (id: number, title: string) => {
    if (window.confirm(`Delete "${title}"?`)) {
      deleteItem(id);
    }
  };

  const handleReset = () => {
    if (window.confirm("Reset all items back to the original defaults?")) {
      resetToDefaults();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <span>{APP_CONFIG.emoji}</span>
              <span>Manage {APP_CONFIG.name}</span>
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">{items.length} items</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/">← Back</Link>
            </Button>
            <Button
              size="sm"
              className={theme.primaryClass}
              onClick={() => setIsAdding(true)}
            >
              + Add
            </Button>
          </div>
        </div>
      </div>

      {/* Items list */}
      <div className="max-w-2xl mx-auto p-4 space-y-3">
        {items.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-3">📭</div>
            <p className="font-medium">No items yet</p>
            <p className="text-sm mt-1">Tap "+ Add" to create your first item</p>
          </div>
        )}

        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 border border-gray-100"
          >
            {item.image && (
              <img
                src={item.image as string}
                alt=""
                className="w-14 h-14 rounded-xl object-cover flex-shrink-0 bg-gray-100"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate flex items-center gap-1.5">
                {item.badge && <span>{item.badge as string}</span>}
                {item.title}
              </div>
              {item.subtitle && (
                <div className="text-sm text-gray-500 truncate">{item.subtitle as string}</div>
              )}
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {item.category && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${theme.pill}`}>
                    {item.category as string}
                  </span>
                )}
                {item.value && (
                  <span className="text-xs text-gray-400">{item.value as string}</span>
                )}
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditItem(item)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(item.id, item.title)}
              >
                Del
              </Button>
            </div>
          </div>
        ))}

        {/* Reset button */}
        <button
          onClick={handleReset}
          className="w-full mt-4 py-3 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          🔄 Reset to defaults
        </button>
      </div>

      {/* Add / Edit Dialog */}
      <ItemDialog
        open={isAdding || !!editItem}
        item={editItem}
        onClose={() => {
          setIsAdding(false);
          setEditItem(null);
        }}
        onSave={(data) => {
          if (editItem) {
            updateItem(editItem.id, data);
          } else {
            addItem(data);
          }
          setIsAdding(false);
          setEditItem(null);
        }}
      />
    </div>
  );
}

// ── ItemDialog ────────────────────────────────────────────────────────────────

interface ItemDialogProps {
  open: boolean;
  item: AppItem | null;
  onClose: () => void;
  onSave: (data: Omit<AppItem, "id">) => void;
}

function ItemDialog({ open, item, onClose, onSave }: ItemDialogProps) {
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    value: "",
    category: APP_CONFIG.categories[1] ?? "",
    badge: "",
    image: "",
  });

  // Sync form when item changes
  useEffect(() => {
    setForm({
      title: (item?.title as string) ?? "",
      subtitle: (item?.subtitle as string) ?? "",
      value: (item?.value as string) ?? "",
      category: (item?.category as string) ?? APP_CONFIG.categories[1] ?? "",
      badge: (item?.badge as string) ?? "",
      image: (item?.image as string) ?? "",
    });
  }, [item, open]);

  const field = (
    key: keyof typeof form,
    label: string,
    placeholder: string,
    required = false
  ) => (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        value={form[key]}
        placeholder={placeholder}
        onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
        className="h-9"
      />
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm mx-4">
        <DialogHeader>
          <DialogTitle>{item ? "✏️ Edit Item" : "➕ Add Item"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-1">
          {field("title", "Title", "e.g. Morning Run", true)}
          {field("subtitle", "Description", "One sentence about it...")}
          {field("value", "Value", `e.g. 5 min, $12, 4.5★`)}
          {field(
            "category",
            "Category",
            APP_CONFIG.categories.filter((c) => c !== "All").join(" / ")
          )}
          {field("badge", "Badge emoji", "🔥 or leave empty")}
          {field("image", "Image URL", "https://picsum.photos/seed/word/400/200")}
        </div>

        {/* Image preview */}
        {form.image && (
          <img
            src={form.image}
            alt="Preview"
            className="w-full h-28 object-cover rounded-xl bg-gray-100"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}

        <div className="flex gap-2 pt-1">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="flex-1"
            disabled={!form.title.trim()}
            onClick={() => onSave(form)}
          >
            {item ? "Save Changes" : "Add Item"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
