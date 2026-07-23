import { CryButton } from "./CryButton";
import { RegisteredStamp } from "./RegisteredStamp";
import { StatBars } from "./StatBars";
import { formatDexNumber } from "../data/dexNumber";
import { getTypeColor } from "../data/typeColors";
import type { PokemonDetail } from "../types/pokemon";

interface Props {
  pokemon: PokemonDetail;
  isShiny: boolean;
  direction: "next" | "prev" | null;
  justDiscovered: boolean;
}

const ENTER_ANIMATION: Record<"next" | "prev" | "none", string> = {
  next: "animate-dex-slide-next",
  prev: "animate-dex-slide-prev",
  none: "animate-rise-in",
};

export function PokemonCard({ pokemon, isShiny, direction, justDiscovered }: Props) {
  const accent = getTypeColor(pokemon.types[0] ?? "").accent;
  const showShiny = isShiny && Boolean(pokemon.shinySprite);
  const spriteSrc = showShiny ? pokemon.shinySprite : pokemon.sprite;
  const enterAnim = ENTER_ANIMATION[direction ?? "none"];

  return (
    <div
      className={`dex-screen relative flex ${enterAnim} items-center gap-6 rounded-xl border border-t-4 border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800`}
      style={{ borderTopColor: accent }}
    >
      {justDiscovered && <RegisteredStamp />}
      {spriteSrc && (
        <div className="relative shrink-0">
          <img
            src={spriteSrc}
            alt={pokemon.name}
            width={96}
            height={96}
            className="h-24 w-24"
          />
          {showShiny && (
            <span
              aria-hidden="true"
              className="absolute -right-1 -top-1 animate-sparkle text-lg"
            >
              ✨
            </span>
          )}
        </div>
      )}
      <div>
        <p className="font-mono text-sm font-medium tabular-nums text-slate-400 dark:text-slate-500">
          {formatDexNumber(pokemon.id)}
        </p>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold capitalize text-slate-900 dark:text-slate-50">
            {pokemon.name}
          </h1>
          <CryButton cryUrl={pokemon.cryUrl} />
        </div>
        {showShiny && (
          <span className="text-xs font-semibold text-amber-500 dark:text-amber-400">
            ✨ Shiny!
          </span>
        )}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {pokemon.types.map((type) => (
            <span
              key={type}
              className="rounded-full px-2.5 py-0.5 text-xs font-medium capitalize text-white"
              style={{ backgroundColor: getTypeColor(type).accent }}
            >
              {type}
            </span>
          ))}
        </div>
        <dl className="mt-3 flex gap-4 text-sm text-slate-600 dark:text-slate-300">
          <div>
            <dt className="inline font-medium text-slate-500 dark:text-slate-400">
              Base XP:{" "}
            </dt>
            <dd className="inline font-mono tabular-nums">
              {pokemon.base_experience ?? "unknown"}
            </dd>
          </div>
          <div>
            <dt className="inline font-medium text-slate-500 dark:text-slate-400">
              Height:{" "}
            </dt>
            <dd className="inline font-mono tabular-nums">{pokemon.height / 10} m</dd>
          </div>
          <div>
            <dt className="inline font-medium text-slate-500 dark:text-slate-400">
              Weight:{" "}
            </dt>
            <dd className="inline font-mono tabular-nums">{pokemon.weight / 10} kg</dd>
          </div>
        </dl>
        <StatBars stats={pokemon.stats} accentColor={accent} />
      </div>
    </div>
  );
}
