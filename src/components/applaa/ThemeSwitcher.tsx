import { Palette, X, RotateCcw, Check } from "lucide-react";
import { useState } from "react";
import { THEMES } from "@/components/applaa/presets/themes";
import { APP_CONFIG } from "@/app-config";
import type { ThemeName } from "@/components/applaa/presets/themes";

// ── Theme category map ────────────────────────────────────────────────────────
const CATEGORIES: { label: string; themes: ThemeName[] }[] = [
  {
    label: "🎮 Gaming & Tech",
    themes: ["PIXEL_NEON", "ARCADE", "MATRIX", "RETROWAVE", "HOLOGRAM"],
  },
  {
    label: "🍕 Food & Cozy",
    themes: ["TOMATO", "MATCHA", "LEMONADE", "COCOA", "BERRY"],
  },
  {
    label: "🌸 Aesthetic & Vibes",
    themes: ["SAKURA", "COTTAGECORE", "VAPORWAVE", "Y2K", "BUBBLEGUM"],
  },
  {
    label: "🌙 Dark & Moody",
    themes: ["DARK_ACADEMIA", "MIDNIGHT", "OBSIDIAN", "DEEP_SPACE", "NEON"],
  },
  {
    label: "⚡ Bright & Fun",
    themes: ["SUNSHINE", "TROPICAL", "CARNIVAL", "CANDY", "FIRE"],
  },
  {
    label: "🌿 Calm & Nature",
    themes: ["JUNGLE", "OCEAN", "ICE", "SUNSET"],
  },
];

interface ThemeSwitcherProps {
  current: ThemeName;
  onSelect: (theme: ThemeName) => void;
  onReset: () => void;
}

// ── Floating palette FAB + theme picker sheet ─────────────────────────────────
export function ThemeSwitcher({ current, onSelect, onReset }: ThemeSwitcherProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (name: ThemeName) => {
    onSelect(name);
    // Keep open so user can browse — they close manually
  };

  const isDefault = current === APP_CONFIG.theme;

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setOpen(true)}
        title="Change theme"
        className="fixed bottom-6 right-4 z-40 flex items-center gap-1.5 px-3 py-2.5 rounded-full shadow-lg
                   bg-black/60 backdrop-blur-md text-white text-sm font-medium
                   hover:bg-black/75 active:scale-95 transition-all"
      >
        <Palette className="w-4 h-4" />
        <span className="hidden sm:inline">Theme</span>
      </button>

      {/* Bottom-sheet overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-end"
          onClick={() => setOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Sheet */}
          <div
            className="relative bg-white rounded-t-3xl shadow-2xl max-h-[82vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-300" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">🎨 Change Theme</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Tap any theme to change your app's look instantly
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable theme grid */}
            <div className="overflow-y-auto flex-1 px-4 py-3 space-y-5">
              {CATEGORIES.map((cat) => (
                <div key={cat.label}>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    {cat.label}
                  </h3>
                  <div className="grid grid-cols-5 gap-2">
                    {cat.themes.map((name) => {
                      const t = THEMES[name];
                      if (!t) return null;
                      const isActive = name === current;
                      return (
                        <button
                          key={name}
                          onClick={() => handleSelect(name)}
                          className={`flex flex-col items-center gap-1 group`}
                          title={name}
                        >
                          {/* Gradient swatch */}
                          <div
                            className={`w-full h-11 rounded-xl bg-gradient-to-br ${t.gradient}
                                        transition-all relative
                                        ${isActive
                                          ? "ring-3 ring-offset-2 ring-gray-800 scale-105 shadow-md"
                                          : "hover:scale-105 hover:shadow-md"
                                        }`}
                          >
                            {isActive && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-white/90 rounded-full p-0.5">
                                  <Check className="w-3 h-3 text-gray-800" />
                                </div>
                              </div>
                            )}
                          </div>
                          {/* Theme name */}
                          <span
                            className={`text-[9px] font-medium leading-tight text-center truncate w-full
                                        ${isActive ? "text-gray-900" : "text-gray-500 group-hover:text-gray-700"}`}
                          >
                            {name.replace(/_/g, " ")}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
              <div className="text-xs text-gray-400">
                Current:{" "}
                <span className="font-semibold text-gray-700">
                  {current.replace(/_/g, " ")}
                </span>
              </div>
              {!isDefault && (
                <button
                  onClick={() => { onReset(); }}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset to default
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
