import { useEffect, useRef, useState } from "react";
import { DarkModeToggle } from "./components/DarkModeToggle";
import { DexProgress } from "./components/DexProgress";
import { EvolutionChain } from "./components/EvolutionChain";
import { FlavorText } from "./components/FlavorText";
import { IdSearchForm } from "./components/IdSearchForm";
import { MatchGrid } from "./components/MatchGrid";
import { MatchToast, type MatchToastData } from "./components/MatchToast";
import { PokemonCard } from "./components/PokemonCard";
import { StatusBanner } from "./components/StatusBanner";
import { StatusLed } from "./components/StatusLed";
import { getTypeColor } from "./data/typeColors";
import { useDiscoveredDex } from "./hooks/useDiscoveredDex";
import { usePokemonSelection } from "./hooks/usePokemonSelection";
import { useSpeciesInfo } from "./hooks/useSpeciesInfo";
import type { PokemonSummary } from "./types/pokemon";

const INITIAL_ID = 1;

function App() {
  const { detail, matches, status, errorMessage, selectId, stepId, selectRandom, isShiny } =
    usePokemonSelection(INITIAL_ID);
  const evo = useSpeciesInfo(detail?.speciesUrl ?? "");
  const { discoveredCount, isDiscovered, discover } = useDiscoveredDex();

  const [justDiscoveredId, setJustDiscoveredId] = useState<number | null>(null);
  const [direction, setDirection] = useState<"next" | "prev" | null>(null);
  const [toast, setToast] = useState<MatchToastData | null>(null);
  const toastSeq = useRef(0);

  useEffect(() => {
    if (!detail) return;
    if (!isDiscovered(detail.id)) {
      discover(detail.id);
      setJustDiscoveredId(detail.id);
    } else {
      setJustDiscoveredId(null);
    }
  }, [detail, isDiscovered, discover]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if ((e.target as HTMLElement)?.tagName === "INPUT") return;
      if (e.key === "ArrowRight") {
        setDirection("next");
        stepId(1);
      } else if (e.key === "ArrowLeft") {
        setDirection("prev");
        stepId(-1);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [stepId]);

  function handleSelectId(id: number) {
    setDirection(null);
    selectId(id);
  }

  function handleRandom() {
    setDirection(null);
    selectRandom();
  }

  function handleSelectMatch(pokemon: PokemonSummary) {
    setDirection(null);
    if (detail) {
      setToast({
        id: ++toastSeq.current,
        fromName: detail.name,
        toName: pokemon.name,
        value: pokemon.base_experience,
      });
    }
    selectId(pokemon.id);
  }

  const accent = detail ? getTypeColor(detail.types[0] ?? "").accent : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <MatchToast toast={toast} />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <header className="mb-8 flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <StatusLed status={status} />
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                PokéMatch
              </h1>
              <p className="mt-1 text-slate-500 dark:text-slate-400">
                Find Pokémon that share the same base experience.
              </p>
              <DexProgress discoveredCount={discoveredCount} />
            </div>
          </div>
          <DarkModeToggle />
        </header>

        <IdSearchForm onSubmit={handleSelectId} onRandom={handleRandom} />

        <div
          className="mt-8 rounded-xl transition-colors"
          style={{
            background: accent
              ? `radial-gradient(ellipse at top, ${accent}22, transparent 70%)`
              : undefined,
          }}
        >
          {status === "loading" && <StatusBanner kind="loading" />}
          {status === "error" && (
            <StatusBanner kind="error" message={errorMessage ?? undefined} />
          )}
          {status === "idle" && detail && (
            <PokemonCard
              key={detail.id}
              pokemon={detail}
              isShiny={isShiny}
              direction={direction}
              justDiscovered={justDiscoveredId === detail.id}
            />
          )}
        </div>

        {status === "idle" && detail && (
          <>
            <EvolutionChain
              stages={evo.stages}
              status={evo.status}
              currentId={detail.id}
              onSelect={handleSelectId}
            />
            <FlavorText text={evo.flavorText} />
          </>
        )}

        {status === "idle" && detail && (
          <section className="mt-8">
            <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-50">
              Matches ({matches.length})
            </h2>
            {matches.length > 0 ? (
              <MatchGrid
                matches={matches}
                onSelect={handleSelectMatch}
                isDiscovered={isDiscovered}
              />
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
