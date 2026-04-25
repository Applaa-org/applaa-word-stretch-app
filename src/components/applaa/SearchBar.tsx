import { APP_CONFIG } from "@/app-config";
import { THEMES } from "@/components/applaa/presets/themes";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder,
  className = "",
}: SearchBarProps) {
  const theme = THEMES[APP_CONFIG.theme];

  return (
    <div className={`relative ${className}`}>
      <Search
        className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${theme.primaryText} opacity-60`}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? `Search ${APP_CONFIG.name}…`}
        className={`w-full pl-9 pr-4 py-3 rounded-2xl text-sm font-medium
          ${theme.card} border ${theme.primaryBorder}
          focus:outline-none focus:ring-2 focus:ring-offset-1
          placeholder:text-gray-400 transition-all duration-200`}
        style={{ colorScheme: APP_CONFIG.theme === "DEEP_SPACE" || APP_CONFIG.theme === "NEON" ? "dark" : "light" }}
      />
    </div>
  );
}
