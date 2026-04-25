import { useLocalStorage } from "./use-local-storage";
import { APP_CONFIG } from "@/app-config";
import type { ThemeName } from "@/components/applaa/presets/themes";

// Per-app storage key — theme override persists independently per app
const THEME_KEY = `applaa-theme-${APP_CONFIG.name.toLowerCase().replace(/\s+/g, "-")}`;

/**
 * Returns the active theme name for this app.
 * Starts from APP_CONFIG.theme but can be overridden by the user
 * via the ThemeSwitcher — persists across page refreshes via localStorage.
 *
 * Usage (inside AppShell only — other components receive theme as props):
 *   const { themeName, setTheme, resetTheme } = useActiveTheme();
 */
export function useActiveTheme() {
  const [themeName, setTheme] = useLocalStorage<ThemeName>(
    THEME_KEY,
    APP_CONFIG.theme
  );

  /** Revert to the theme Pi originally chose in app-config.ts */
  const resetTheme = () => setTheme(APP_CONFIG.theme);

  return { themeName, setTheme, resetTheme };
}
