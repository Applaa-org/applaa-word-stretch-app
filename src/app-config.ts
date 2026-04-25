// ─── Applaa App Config ────────────────────────────────────────────────────────
// Pi writes ONLY this file + src/pages/Index.tsx for every app.
// All values here drive the entire UI — theme, data, layout, features.

import type { ThemeName } from "@/components/applaa/presets/themes";

export interface AppItem {
  id: number;
  title: string;
  subtitle?: string;
  value?: string;
  badge?: string;
  category?: string;
  date?: string;
  image?: string;
  color?: string;           // optional per-item accent color
  progress?: number;        // 0-100, shows a progress bar on the card
  [key: string]: unknown;   // app-specific extra fields
}

export interface AppStat {
  label: string;
  value: string;
  icon: string;
  trend?: "up" | "down" | "neutral";
}

export interface AppConfig {
  // Identity
  name: string;
  tagline: string;
  emoji: string;

  // Theme — Pi picks from 30 options (see themes.ts):
  // GAMING/TECH:   PIXEL_NEON | ARCADE | MATRIX | RETROWAVE | HOLOGRAM
  // FOOD/LIFE:     TOMATO | MATCHA | LEMONADE | COCOA | BERRY
  // AESTHETIC:     SAKURA | COTTAGECORE | VAPORWAVE | Y2K | BUBBLEGUM
  // DARK/MOODY:    DARK_ACADEMIA | MIDNIGHT | OBSIDIAN | DEEP_SPACE | NEON
  // BRIGHT/FUN:    SUNSHINE | TROPICAL | CARNIVAL | CANDY | FIRE
  // CALM/NATURE:   JUNGLE | OCEAN | ICE | SUNSET
  theme: ThemeName;

  // Stats row (2–4 items)
  stats: AppStat[];

  // Main data
  items: AppItem[];
  categories: string[];     // first entry should be "All"

  // CTA
  cta: { label: string; icon?: string };

  // Features
  features: {
    search?: boolean;
    filter?: boolean;
    stats?: boolean;
    detail?: boolean;       // enables clicking a card to see detail view
    counter?: boolean;      // floating +/- counter button
    progress?: boolean;     // show progress bar in cards
    admin?: boolean;        // enables /admin CRUD route + nav link in header
    offline?: boolean;      // persists items to localStorage across page refreshes
  };

  // Layout — controls the archive/listing page style (default: "grid")
  // "grid"     → 2-col card grid (default)
  // "list"     → full-width row cards
  // "featured" → 1 large hero card + 2-col grid below
  // "magazine" → tall left card + right column stack
  // "table"    → compact rows with title/value/category/date columns
  // "kanban"   → items grouped by category in side-by-side columns
  // "timeline" → date-grouped vertical list with connector line
  layout?: "grid" | "list" | "featured" | "magazine" | "table" | "kanban" | "timeline";

  // Tab navigation — renders a tab strip in NavHeader when set (2–4 tabs max)
  navTabs?: Array<{
    label: string;    // short label e.g. "Recipes"
    emoji: string;    // tab icon e.g. "🍳"
    filter?: string;  // category value to filter items on (undefined = show all)
  }>;

  // Multi-section page — renders named sections instead of one flat archive
  sections?: Array<{
    title: string;
    emoji?: string;
    filter?: string;   // filter items by this category value
    columns?: 1 | 2;  // 1 = list rows, 2 = card grid
    limit?: number;    // show only first N items in this section
    layout?: "grid" | "list" | "featured";
  }>;
}

// ─── Default config — Pi replaces ALL values below ───────────────────────────
export const APP_CONFIG: AppConfig = {
  name: "My App",
  tagline: "Built with Applaa ✨",
  emoji: "🚀",
  theme: "CANDY",

  stats: [
    { label: "Total", value: "12", icon: "📦" },
    { label: "Today", value: "3",  icon: "📅" },
    { label: "Score", value: "42", icon: "⭐" },
  ],

  items: [
    { id: 1, title: "Item One",   subtitle: "Description here", badge: "🌟",
      category: "Featured", date: "Today", image: "https://picsum.photos/seed/a1/400/200" },
    { id: 2, title: "Item Two",   subtitle: "Description here", badge: "🔥",
      category: "Popular",  date: "Yesterday", image: "https://picsum.photos/seed/a2/400/200" },
    { id: 3, title: "Item Three", subtitle: "Description here", badge: "💎",
      category: "New",      date: "2 days ago", image: "https://picsum.photos/seed/a3/400/200" },
    { id: 4, title: "Item Four",  subtitle: "Description here", badge: "🎯",
      category: "Featured", date: "3 days ago", image: "https://picsum.photos/seed/a4/400/200" },
    { id: 5, title: "Item Five",  subtitle: "Description here", badge: "✨",
      category: "Popular",  date: "4 days ago", image: "https://picsum.photos/seed/a5/400/200" },
    { id: 6, title: "Item Six",   subtitle: "Description here", badge: "🏆",
      category: "New",      date: "5 days ago", image: "https://picsum.photos/seed/a6/400/200" },
  ],

  categories: ["All", "Featured", "Popular", "New"],

  cta: { label: "Get Started", icon: "✨" },

  features: {
    search: true,
    filter: true,
    stats: true,
    detail: false,
    counter: false,
    progress: false,
  },
};
