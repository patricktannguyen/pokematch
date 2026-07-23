import { DarkModeToggle } from "./components/DarkModeToggle";
import { EvolutionChain } from "./components/EvolutionChain";
import { IdSearchForm } from "./components/IdSearchForm";
import { MatchGrid } from "./components/MatchGrid";
import { PokemonCard } from "./components/PokemonCard";
import { StatusBanner } from "./components/StatusBanner";
import { usePokemonSelection } from "./hooks/usePokemonSelection";

const INITIAL_ID = 1;

function App() {
  const { detail, matches, status, errorMessage, selectId, isShiny } =
    usePokemonSelection(INITIAL_ID);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <header className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
              PokéMatch
            </h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              Find Pokémon that share the same base experience.
            </p>
          </div>
          <DarkModeToggle />
        </header>

        <IdSearchForm onSubmit={selectId} />

        <div className="mt-8">
          {status === "loading" && <StatusBanner kind="loading" />}
          {status === "error" && (
            <StatusBanner kind="error" message={errorMessage ?? undefined} />
          )}
          {status === "idle" && detail && (
            <PokemonCard key={detail.id} pokemon={detail} isShiny={isShiny} />
          )}
        </div>

        {status === "idle" && detail && (
          <EvolutionChain
            speciesUrl={detail.speciesUrl}
            currentId={detail.id}
            onSelect={selectId}
          />
        )}

        {status === "idle" && detail && (
          <section className="mt-8">
            <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-50">
              Matches ({matches.length})
            </h2>
            {matches.length > 0 ? (
              <MatchGrid matches={matches} onSelect={selectId} />
            ) : (
              <StatusBanner kind="empty" />
            )}
          </section>
        )}
      </div>
    </div>
  );
}

export default App;
