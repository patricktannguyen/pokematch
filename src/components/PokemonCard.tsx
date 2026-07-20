import type { PokemonDetail } from "../types/pokemon";

interface Props {
  pokemon: PokemonDetail;
}

export function PokemonCard({ pokemon }: Props) {
  return (
    <div className="flex items-center gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {pokemon.sprite && (
        <img
          src={pokemon.sprite}
          alt={pokemon.name}
          width={96}
          height={96}
          className="h-24 w-24 shrink-0"
        />
      )}
      <div>
        <p className="text-sm font-medium text-slate-400">#{pokemon.id}</p>
        <h1 className="text-2xl font-bold capitalize text-slate-900">
          {pokemon.name}
        </h1>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {pokemon.types.map((type) => (
            <span
              key={type}
              className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium capitalize text-indigo-700"
            >
              {type}
            </span>
          ))}
        </div>
        <dl className="mt-3 flex gap-4 text-sm text-slate-600">
          <div>
            <dt className="inline font-medium text-slate-500">Base XP: </dt>
            <dd className="inline">
              {pokemon.base_experience ?? "unknown"}
            </dd>
          </div>
          <div>
            <dt className="inline font-medium text-slate-500">Height: </dt>
            <dd className="inline">{pokemon.height / 10} m</dd>
          </div>
          <div>
            <dt className="inline font-medium text-slate-500">Weight: </dt>
            <dd className="inline">{pokemon.weight / 10} kg</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
