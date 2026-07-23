import { useCallback, useEffect, useRef, useState } from "react";
import { fetchPokemonById, PokemonNotFoundError } from "../api/pokeapi";
import { findMatches } from "../data/findMatches";
import dataset from "../data/pokemon-base-experience.json";
import type { PokemonDetail, PokemonSummary } from "../types/pokemon";

type Status = "idle" | "loading" | "error";

interface State {
  selectedId: number;
  detail: PokemonDetail | null;
  matches: PokemonSummary[];
  status: Status;
  errorMessage: string | null;
  isShiny: boolean;
}

interface CacheEntry {
  detail: PokemonDetail;
  isShiny: boolean;
}

const SHINY_CHANCE = 1 / 20;

export function usePokemonSelection(initialId: number) {
  const [state, setState] = useState<State>({
    selectedId: initialId,
    detail: null,
    matches: [],
    status: "loading",
    errorMessage: null,
    isShiny: false,
  });

  const cache = useRef(new Map<number, CacheEntry>());
  const requestId = useRef(0);

  const selectId = useCallback((id: number) => {
    setState((s) => ({ ...s, selectedId: id }));
  }, []);

  useEffect(() => {
    const id = state.selectedId;
    const thisRequest = ++requestId.current;

    const cached = cache.current.get(id);
    if (cached) {
      setState((s) => ({
        ...s,
        detail: cached.detail,
        matches: findMatches(dataset as PokemonSummary[], cached.detail),
        status: "idle",
        errorMessage: null,
        isShiny: cached.isShiny,
      }));
      return;
    }

    setState((s) => ({ ...s, status: "loading", errorMessage: null }));

    fetchPokemonById(id)
      .then((detail) => {
        if (requestId.current !== thisRequest) return;
        const isShiny = Math.random() < SHINY_CHANCE;
        cache.current.set(id, { detail, isShiny });
        setState((s) => ({
          ...s,
          detail,
          matches: findMatches(dataset as PokemonSummary[], detail),
          status: "idle",
          errorMessage: null,
          isShiny,
        }));
      })
      .catch((err) => {
        if (requestId.current !== thisRequest) return;
        const message =
          err instanceof PokemonNotFoundError
            ? err.message
            : "Something went wrong talking to PokeAPI. Please try again.";
        setState((s) => ({
          ...s,
          detail: null,
          matches: [],
          status: "error",
          errorMessage: message,
          isShiny: false,
        }));
      });
  }, [state.selectedId]);

  return { ...state, selectId };
}
