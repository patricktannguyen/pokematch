import type { MatchEvent } from "../types/pokemon";

interface Props {
  history: MatchEvent[];
}

export function MatchHistory({ history }: Props) {
  if (history.length === 0) return null;

  const ordered = [...history].reverse();

  return (
    <section className="mt-8">
      <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-50">
        Match History ({history.length})
      </h2>
      <ul className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-slate-200 bg-white p-3 text-sm dark:border-slate-700 dark:bg-slate-800">
        {ordered.map((event) => (
          <li key={event.id} className="text-slate-600 dark:text-slate-300">
            <span className="capitalize">{event.fromName}</span> &{" "}
            <span className="capitalize">{event.toName}</span>{" "}
            <span className="font-mono tabular-nums text-slate-400 dark:text-slate-500">
              (Base XP {event.value})
            </span>{" "}
            —{" "}
            {event.winnerName ? (
              <span className="capitalize">{event.winnerName} wins</span>
            ) : (
              <>evenly matched</>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
