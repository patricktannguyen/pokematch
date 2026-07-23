import { formatStatLabel } from "../data/statLabels";
import type { PokemonStat } from "../types/pokemon";

interface Props {
  stats: PokemonStat[];
  accentColor: string;
}

const STAT_MAX = 255;

export function StatBars({ stats, accentColor }: Props) {
  return (
    <div className="mt-4 space-y-1.5">
      {stats.map((stat) => (
        <div key={stat.name} className="flex items-center gap-2 text-xs">
          <span className="w-16 shrink-0 font-medium text-slate-500 dark:text-slate-400">
            {formatStatLabel(stat.name)}
          </span>
          <div className="h-2 flex-1 rounded-full bg-slate-100 dark:bg-slate-700">
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: `${Math.min(100, (stat.base / STAT_MAX) * 100)}%`,
                backgroundColor: accentColor,
              }}
            />
          </div>
          <span className="w-8 text-right text-slate-600 dark:text-slate-300">
            {stat.base}
          </span>
        </div>
      ))}
    </div>
  );
}
