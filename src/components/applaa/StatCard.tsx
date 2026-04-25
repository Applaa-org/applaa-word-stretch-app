import { APP_CONFIG } from "@/app-config";
import { THEMES } from "@/components/applaa/presets/themes";
import type { AppStat } from "@/app-config";

interface StatCardProps extends Partial<AppStat> {
  index?: number;
}

export function StatCard({ label, value, icon, index = 0 }: StatCardProps) {
  const theme = THEMES[APP_CONFIG.theme];

  return (
    <div
      className={`${theme.card} rounded-2xl p-4 text-center shadow-lg ${theme.shadow}
        transition-transform duration-200 hover:scale-105 cursor-default`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="text-3xl mb-1">{icon}</div>
      <div className={`text-2xl font-black ${theme.primaryText}`}>{value}</div>
      <div className="text-xs font-medium text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}

interface StatsRowProps {
  stats?: AppStat[];
}

export function StatsRow({ stats }: StatsRowProps) {
  const items = stats ?? APP_CONFIG.stats;
  return (
    <div className={`grid gap-3 mb-6`} style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
      {items.map((s, i) => (
        <StatCard key={s.label} {...s} index={i} />
      ))}
    </div>
  );
}
