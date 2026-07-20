import type { PokemonSummary } from "../types/pokemon";

interface Props {
  matches: PokemonSummary[];
  onSelect: (id: number) => void;
}

export function MatchGrid({ matches, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {matches.map((pokemon) => (
        <button
          key={pokemon.id}
          type="button"
          onClick={() => onSelect(pokemon.id)}
          className="flex flex-col items-center gap-1 rounded-lg border border-slate-200 bg-white p-3 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
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
          <span className="text-xs text-slate-400">#{pokemon.id}</span>
          <span className="text-sm font-medium capitalize text-slate-800">
            {pokemon.name}
          </span>
        </button>
      ))}
    </div>
  );
}
