import { useEffect, useMemo, useRef, useState } from "react";
import { DarkModeToggle } from "./components/DarkModeToggle";
import { DexProgress } from "./components/DexProgress";
import { EvolutionChain } from "./components/EvolutionChain";
import { FlavorText } from "./components/FlavorText";
import { IdSearchForm } from "./components/IdSearchForm";
import { MatchGrid } from "./components/MatchGrid";
import { MatchHistory } from "./components/MatchHistory";
import { MatchToast } from "./components/MatchToast";
import { PokemonCard } from "./components/PokemonCard";
import { ShinyProgress } from "./components/ShinyProgress";
import { StatusBanner } from "./components/StatusBanner";
import { StatusLed } from "./components/StatusLed";
import { determineWinner } from "./data/battleOutcome";
import { getTypeColor } from "./data/typeColors";
import { isShinyThisSession } from "./data/shinyDex";
import { TOAST_DURATION_MS } from "./data/timing";
import { useDiscoveredDex } from "./hooks/useDiscoveredDex";
import { usePokemonSelection } from "./hooks/usePokemonSelection";
import { useSpeciesInfo } from "./hooks/useSpeciesInfo";
import type { MatchEvent, PokemonDetail, PokemonSummary } from "./types/pokemon";

const INITIAL_ID = 1;

interface PendingMatch {
  fromDetail: PokemonDetail;
  toId: number;
  toName: string;
  value: number;
}

function App() {
  const { detail, matches, status, errorMessage, selectId, stepId, selectRandom } =
    usePokemonSelection(INITIAL_ID);
  const evo = useSpeciesInfo(detail?.speciesUrl ?? "");
  const { discovered, discoveredCount, isDiscovered, discover } = useDiscoveredDex();

  const [justDiscoveredId, setJustDiscoveredId] = useState<number | null>(null);
  const [direction, setDirection] = useState<"next" | "prev" | null>(null);
  const [toast, setToast] = useState<MatchEvent | null>(null);
  const [matchHistory, setMatchHistory] = useState<MatchEvent[]>([]);
  const toastSeq = useRef(0);
  const pendingMatchRef = useRef<PendingMatch | null>(null);

  const shinyDiscoveredCount = useMemo(
    () => [...discovered].filter(isShinyThisSession).length,
    [discovered],
  );

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
    const timer = setTimeout(() => setToast(null), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const pending = pendingMatchRef.current;
    if (!pending) return;
    if (status === "error") {
      pendingMatchRef.current = null;
      return;
    }
    if (!detail || detail.id !== pending.toId) return;
    pendingMatchRef.current = null;

    const { winner, reason } = determineWinner(pending.fromDetail, detail);
    const event: MatchEvent = {
      id: ++toastSeq.current,
      fromName: pending.fromDetail.name,
      toName: pending.toName,
      value: pending.value,
      winnerName: winner?.name ?? null,
      reason,
    };
    setToast(event);
    setMatchHistory((h) => [...h, event]);
  }, [detail, status]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if ((e.target as HTMLElement)?.tagName === "INPUT") return;
      if (e.key === "ArrowRight") {
        pendingMatchRef.current = null;
        setDirection("next");
        stepId(1);
      } else if (e.key === "ArrowLeft") {
        pendingMatchRef.current = null;
        setDirection("prev");
        stepId(-1);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [stepId]);

  function handleSelectId(id: number) {
    pendingMatchRef.current = null;
    setDirection(null);
    selectId(id);
  }

  function handleRandom() {
    pendingMatchRef.current = null;
    setDirection(null);
    selectRandom();
  }

  function handleSelectMatch(pokemon: PokemonSummary) {
    setDirection(null);
    if (detail) {
      pendingMatchRef.current = {
        fromDetail: detail,
        toId: pokemon.id,
        toName: pokemon.name,
        value: pokemon.base_experience,
      };
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
              <ShinyProgress shinyDiscoveredCount={shinyDiscoveredCount} />
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
              isDiscovered={isDiscovered}
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

        <MatchHistory history={matchHistory} />
      </div>
    </div>
  );
}

export default App;
