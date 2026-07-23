import { useCallback, useEffect, useRef, useState } from "react";
import { fetchPokemonById, PokemonNotFoundError } from "../api/pokeapi";
import { ALL_POKEMON } from "../data/dexUniverse";
import { findMatches } from "../data/findMatches";
import { LOADING_DELAY_MS } from "../data/timing";
import type { PokemonDetail, PokemonSummary } from "../types/pokemon";

export type Status = "idle" | "loading" | "error";

interface State {
  selectedId: number;
  detail: PokemonDetail | null;
  matches: PokemonSummary[];
  status: Status;
  errorMessage: string | null;
}

export function usePokemonSelection(initialId: number) {
  const [state, setState] = useState<State>({
    selectedId: initialId,
    detail: null,
    matches: [],
    status: "loading",
    errorMessage: null,
  });

  const cache = useRef(new Map<number, PokemonDetail>());
  const requestId = useRef(0);

  const selectId = useCallback((id: number) => {
    setState((s) => ({ ...s, selectedId: id }));
  }, []);

  const stepId = useCallback((delta: number) => {
    setState((s) => ({ ...s, selectedId: Math.max(1, s.selectedId + delta) }));
  }, []);

  const selectRandom = useCallback(() => {
    const entry = ALL_POKEMON[Math.floor(Math.random() * ALL_POKEMON.length)];
    setState((s) => ({ ...s, selectedId: entry.id }));
  }, []);

  useEffect(() => {
    const id = state.selectedId;
    const thisRequest = ++requestId.current;

    const cached = cache.current.get(id);
    if (cached) {
      setState((s) => ({ ...s, status: "loading", errorMessage: null }));
      const timer = setTimeout(() => {
        if (requestId.current !== thisRequest) return;
        setState((s) => ({
          ...s,
          detail: cached,
          matches: findMatches(ALL_POKEMON, cached),
          status: "idle",
          errorMessage: null,
        }));
      }, LOADING_DELAY_MS);
      return () => clearTimeout(timer);
    }

    setState((s) => ({ ...s, status: "loading", errorMessage: null }));

    fetchPokemonById(id)
      .then((detail) => {
        if (requestId.current !== thisRequest) return;
        cache.current.set(id, detail);
        setTimeout(() => {
          if (requestId.current !== thisRequest) return;
          setState((s) => ({
            ...s,
            detail,
            matches: findMatches(ALL_POKEMON, detail),
            status: "idle",
            errorMessage: null,
          }));
        }, LOADING_DELAY_MS);
      })
      .catch((err) => {
        if (requestId.current !== thisRequest) return;
        const message =
          err instanceof PokemonNotFoundError
            ? err.message
            : "Something went wrong talking to PokeAPI. Please try again.";
        setTimeout(() => {
          if (requestId.current !== thisRequest) return;
          setState((s) => ({
            ...s,
            detail: null,
            matches: [],
            status: "error",
            errorMessage: message,
          }));
        }, LOADING_DELAY_MS);
      });
  }, [state.selectedId]);

  return { ...state, selectId, stepId, selectRandom };
}
