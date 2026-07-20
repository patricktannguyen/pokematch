import { IdSearchForm } from "./components/IdSearchForm";
import { MatchGrid } from "./components/MatchGrid";
import { PokemonCard } from "./components/PokemonCard";
import { StatusBanner } from "./components/StatusBanner";
import { usePokemonSelection } from "./hooks/usePokemonSelection";

const INITIAL_ID = 1;

function App() {
  const { detail, matches, status, errorMessage, selectId } =
    usePokemonSelection(INITIAL_ID);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">PokéMatch</h1>
          <p className="mt-1 text-slate-500">
            Find Pokémon that share the same base experience.
          </p>
        </header>

        <IdSearchForm onSubmit={selectId} />

        <div className="mt-8">
          {status === "loading" && <StatusBanner kind="loading" />}
          {status === "error" && (
            <StatusBanner kind="error" message={errorMessage ?? undefined} />
          )}
          {status === "idle" && detail && <PokemonCard pokemon={detail} />}
        </div>

        {status === "idle" && detail && (
          <section className="mt-8">
            <h2 className="mb-3 text-lg font-semibold text-slate-900">
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
