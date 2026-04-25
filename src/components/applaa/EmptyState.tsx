import { APP_CONFIG } from "@/app-config";
import { THEMES } from "@/components/applaa/presets/themes";

interface EmptyStateProps {
  query?: string;
  message?: string;
  emoji?: string;
}

export function EmptyState({ query, message, emoji }: EmptyStateProps) {
  const theme = THEMES[APP_CONFIG.theme];

  const displayEmoji = emoji ?? "🔍";
  const displayMessage =
    message ??
    (query
      ? `No results for "${query}"`
      : `Nothing here yet — check back soon!`);

  return (
    <div className={`${theme.card} rounded-3xl p-10 text-center shadow-md ${theme.shadow}`}>
      <div className="text-5xl mb-4 animate-bounce inline-block">{displayEmoji}</div>
      <p className="font-semibold text-gray-500">{displayMessage}</p>
      <p className="text-sm text-gray-400 mt-1">
        {query ? "Try a different search" : "Add your first item to get started! 🚀"}
      </p>
    </div>
  );
}
