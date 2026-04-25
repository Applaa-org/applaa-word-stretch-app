import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { APP_CONFIG } from "@/app-config";
import type { Theme, ThemeName } from "@/components/applaa/presets/themes";

interface NavHeaderProps {
  themeName: ThemeName;
  isDark: boolean;
  theme: Theme;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function NavHeader({ isDark, theme, activeTab, onTabChange }: NavHeaderProps) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "🏠 Home" },
    ...(APP_CONFIG.features.admin ? [{ to: "/admin", label: "⚙️ Manage" }] : []),
  ];

  const tabs = APP_CONFIG.navTabs ?? [];
  const hasTabs = tabs.length > 0;

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div
        className={`flex items-center justify-between px-4 py-3 backdrop-blur-md border-b ${
          isDark ? "bg-black/20 border-white/10" : "bg-white/20 border-white/30"
        }`}
      >
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-lg text-white transition-opacity hover:opacity-80"
        >
          <span className="text-xl">{APP_CONFIG.emoji}</span>
          <span className="truncate max-w-[160px]">{APP_CONFIG.name}</span>
        </Link>

        {/* Desktop nav links (no tabs mode) */}
        {!hasTabs && navLinks.length > 0 && (
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.to)
                    ? "bg-white/25 text-white"
                    : "text-white/80 hover:text-white hover:bg-white/20"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Mobile hamburger */}
        {navLinks.length > 1 && (
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 pt-12">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 px-4 pb-4 mb-2 border-b">
                  <span className="text-2xl">{APP_CONFIG.emoji}</span>
                  <div>
                    <div className="font-bold text-sm">{APP_CONFIG.name}</div>
                    <div className="text-xs text-gray-500">{APP_CONFIG.tagline}</div>
                  </div>
                </div>
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isActive(link.to)
                        ? `${theme.primaryLight} ${theme.primaryText}`
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>

      {/* Tab strip — shown when APP_CONFIG.navTabs is set */}
      {hasTabs && (
        <div
          className={`flex items-center border-b overflow-x-auto ${
            isDark ? "bg-black/30 border-white/10" : "bg-white/30 border-white/30"
          }`}
          style={{ scrollbarWidth: "none" }}
        >
          {tabs.map((tab) => {
            const isTabActive = activeTab
              ? activeTab === tab.label
              : tab === tabs[0]; // first tab active by default
            return (
              <button
                key={tab.label}
                onClick={() => onTabChange?.(tab.label)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold whitespace-nowrap transition-all flex-shrink-0
                  border-b-2 ${
                    isTabActive
                      ? "border-white text-white"
                      : "border-transparent text-white/60 hover:text-white/80"
                  }`}
              >
                <span>{tab.emoji}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
