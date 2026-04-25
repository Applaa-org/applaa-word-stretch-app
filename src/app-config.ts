import type { ThemeName } from "@/components/applaa/presets/themes";

export interface AppItem {
  id: number;
  title: string;
  subtitle?: string;
  image?: string;
  badge?: string;
  value?: string;
  category?: string;
  date?: string;
  progress?: number;
  [key: string]: unknown;
}

export interface AppStat {
  label: string;
  value: string;
  icon: string;
  trend?: "up" | "down" | "neutral";
}

export interface AppConfig {
  name: string;
  tagline: string;
  emoji: string;
  theme: ThemeName;
  stats: AppStat[];
  items: AppItem[];
  categories: string[];
  cta: {
    label: string;
    icon?: string;
  };
  features: {
    search?: boolean;
    filter?: boolean;
    stats?: boolean;
    detail?: boolean;
    counter?: boolean;
    progress?: boolean;
    admin?: boolean;
    offline?: boolean;
  };
}

export const APP_CONFIG: AppConfig = {
  name: "WordStretch",
  tagline: "Stretch your mind with word puzzles!",
  emoji: "🧩",
  theme: "PIXEL_NEON",
  stats: [
    { label: "Words Solved", value: "0", icon: "✨" },
    { label: "Games Played", value: "0", icon: "🎮" },
    { label: "Best Streak", value: "0", icon: "🔥" },
  ],
  items: [
    {
      id: 1,
      title: "Easy Words",
      subtitle: "3-4 letter words to get started",
      badge: "🌟",
      category: "Easy",
    },
    {
      id: 2,
      title: "Medium Words",
      subtitle: "5-6 letter challenge",
      badge: "⭐",
      category: "Medium",
    },
    {
      id: 3,
      title: "Hard Words",
      subtitle: "7+ letter brain teasers",
      badge: "💫",
      category: "Hard",
    },
    {
      id: 4,
      title: "Themed Words",
      subtitle: "Animals, food, and more",
      badge: "🎨",
      category: "Themes",
    },
    {
      id: 5,
      title: "Speed Round",
      subtitle: "Race against the clock",
      badge: "⚡",
      category: "Speed",
    },
    {
      id: 6,
      title: "Daily Puzzle",
      subtitle: "New word every day",
      badge: "📅",
      category: "Daily",
    },
  ],
  categories: ["All", "Easy", "Medium", "Hard", "Themes", "Speed", "Daily"],
  cta: {
    label: "Start Game",
    icon: "🎮",
  },
  features: {
    stats: true,
    progress: false,
    offline: true,
  },
};
