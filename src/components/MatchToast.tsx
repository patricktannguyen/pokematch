import { describeReason } from "../data/battleOutcome";
import type { MatchEvent } from "../types/pokemon";

interface Props {
  toast: MatchEvent | null;
}

export function MatchToast({ toast }: Props) {
  if (!toast) return null;

  return (
    <div
      key={toast.id}
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
      role="status"
    >
      <div className="animate-toast-in rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800 shadow-lg dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
        🔍 Match confirmed!{" "}
        <span className="capitalize">{toast.fromName}</span> &{" "}
        <span className="capitalize">{toast.toName}</span> both register Base
        XP {toast.value}.{" "}
        {toast.winnerName ? (
          <>
            🏆 <span className="capitalize">{toast.winnerName}</span> would
            win ({describeReason(toast.reason)})!
          </>
        ) : (
          <>⚖️ Evenly matched!</>
        )}
      </div>
    </div>
  );
}
