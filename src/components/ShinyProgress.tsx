import { TOTAL_SHINY_COUNT } from "../data/shinyDex";

interface Props {
  shinyDiscoveredCount: number;
}

export function ShinyProgress({ shinyDiscoveredCount }: Props) {
  return (
    <div className="mt-1 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
      <span aria-hidden="true">✨</span>
      <span className="font-mono tabular-nums">
        {shinyDiscoveredCount}/{TOTAL_SHINY_COUNT} shiny found
      </span>
    </div>
  );
}
