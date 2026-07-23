import { TOTAL_DEX_SIZE } from "../data/dexUniverse";

interface Props {
  discoveredCount: number;
}

export function DexProgress({ discoveredCount }: Props) {
  const remaining = TOTAL_DEX_SIZE - discoveredCount;
  const pct = Math.min(100, (discoveredCount / TOTAL_DEX_SIZE) * 100);

  return (
    <div className="mt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className="h-1.5 rounded-full bg-emerald-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="font-mono tabular-nums">
        {discoveredCount}/{TOTAL_DEX_SIZE} seen · {remaining} to go
      </span>
    </div>
  );
}
