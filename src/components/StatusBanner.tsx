import { PokeballSpinner } from "./PokeballSpinner";

interface Props {
  kind: "loading" | "error" | "empty";
  message?: string;
}

export function StatusBanner({ kind, message }: Props) {
  if (kind === "loading") {
    return (
      <div className="flex flex-col items-center gap-3 py-2 text-slate-500 dark:text-slate-400">
        <PokeballSpinner />
        <p>Searching the tall grass…</p>
      </div>
    );
  }
  if (kind === "error") {
    return (
      <p className="rounded-lg bg-red-50 px-4 py-3 text-red-700 dark:bg-red-950 dark:text-red-300">
        {message ?? "Looks like this Pokémon slipped into the long grass. Try another ID."}
      </p>
    );
  }
  return (
    <p className="text-slate-500 dark:text-slate-400">
      This one's one of a kind — no other Pokémon shares its base experience.
    </p>
  );
}
