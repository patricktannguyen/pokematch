import { spriteUrlForId, type EvolutionStage } from "../api/evolutionChain";

interface Props {
  stages: EvolutionStage[];
  status: "loading" | "error" | "success";
  currentId: number;
  onSelect: (id: number) => void;
  isDiscovered: (id: number) => boolean;
}

export function EvolutionChain({ stages, status, currentId, onSelect, isDiscovered }: Props) {
  if (status === "loading") {
    return (
      <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
        Loading evolution chain…
      </p>
    );
  }
  if (status === "error" || stages.length <= 1) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {stages.map((stage, index) => {
        const discovered = isDiscovered(stage.id);
        return (
          <div key={stage.id} className="flex items-center gap-2">
            {index > 0 && (
              <span className="text-slate-300 dark:text-slate-600">→</span>
            )}
            <button
              type="button"
              onClick={() => onSelect(stage.id)}
              className={`flex flex-col items-center rounded-lg border p-1.5 transition active:scale-95 ${
                stage.id === currentId
                  ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-950"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            >
              <img
                src={spriteUrlForId(stage.id)}
                alt={discovered ? stage.name : "Undiscovered Pokémon"}
                width={48}
                height={48}
                className={`h-12 w-12 ${discovered ? "" : "brightness-0 dark:invert"}`}
              />
              <span className="text-xs capitalize text-slate-600 dark:text-slate-300">
                {discovered ? stage.name : "???"}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
