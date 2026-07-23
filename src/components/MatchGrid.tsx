import type { PokemonSummary } from "../types/pokemon";

interface Props {
  matches: PokemonSummary[];
  onSelect: (pokemon: PokemonSummary) => void;
}

export function MatchGrid({ matches, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {matches.map((pokemon, index) => (
        <button
          key={pokemon.id}
          type="button"
          onClick={() => onSelect(pokemon)}
          style={{ animationDelay: `${Math.min(index, 20) * 30}ms` }}
          className="flex animate-fade-in flex-col items-center gap-1 rounded-lg border border-slate-200 bg-white p-3 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-500"
        >
          {pokemon.sprite && (
            <img
              src={pokemon.sprite}
              alt={pokemon.name}
              width={64}
              height={64}
              className="h-16 w-16"
            />
          )}
          <span className="text-xs text-slate-400 dark:text-slate-500">
            #{pokemon.id}
          </span>
          <span className="text-sm font-medium capitalize text-slate-800 dark:text-slate-100">
            {pokemon.name}
          </span>
        </button>
      ))}
    </div>
  );
}
