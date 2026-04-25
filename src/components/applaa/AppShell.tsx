import { APP_CONFIG } from "@/app-config";
import { THEMES } from "@/components/applaa/presets/themes";
import { NavHeader } from "@/components/applaa/NavHeader";
import { ThemeSwitcher } from "@/components/applaa/ThemeSwitcher";
import { useActiveTheme } from "@/hooks/use-active-theme";
import { useState, createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { ThemeName } from "@/components/applaa/presets/themes";

export interface AppShellProps {
  children: ReactNode;
  className?: string;
}

export const DARK_THEMES: ThemeName[] = [
  "DEEP_SPACE", "NEON", "PIXEL_NEON", "ARCADE", "MATRIX",
  "RETROWAVE", "HOLOGRAM", "COCOA", "VAPORWAVE", "DARK_ACADEMIA",
  "MIDNIGHT", "OBSIDIAN",
];

// Tab context so child components (DataGrid, DataFeatured, etc.) can read active tab filter
export const ActiveTabContext = createContext<string | undefined>(undefined);
export function useActiveTab() { return useContext(ActiveTabContext); }

export function AppShell({ children, className = "" }: AppShellProps) {
  const { themeName, setTheme, resetTheme } = useActiveTheme();
  const theme = THEMES[themeName] ?? THEMES[APP_CONFIG.theme];
  const isDark = DARK_THEMES.includes(themeName);

  const tabs = APP_CONFIG.navTabs ?? [];
  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.label ?? "");

  return (
    <ActiveTabContext.Provider value={activeTab || undefined}>
      <div
        className={`min-h-screen bg-gradient-to-br ${theme.gradient} ${
          isDark ? "text-white" : "text-gray-900"
        } ${className}`}
      >
        <NavHeader
          themeName={themeName}
          isDark={isDark}
          theme={theme}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="max-w-2xl mx-auto px-4 pb-24">
          {children}
        </div>

        <ThemeSwitcher
          current={themeName}
          onSelect={setTheme}
          onReset={resetTheme}
        />
      </div>
    </ActiveTabContext.Provider>
  );
}
