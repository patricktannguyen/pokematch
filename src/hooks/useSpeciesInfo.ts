import { useEffect, useState } from "react";
import { fetchSpeciesInfo, type EvolutionStage } from "../api/evolutionChain";
import { LOADING_DELAY_MS } from "../data/timing";

type Status = "loading" | "error" | "success";

interface State {
  status: Status;
  stages: EvolutionStage[];
  flavorText: string | null;
}

export function useSpeciesInfo(speciesUrl: string) {
  const [state, setState] = useState<State>({
    status: "loading",
    stages: [],
    flavorText: null,
  });

  useEffect(() => {
    if (!speciesUrl) {
      setState({ status: "success", stages: [], flavorText: null });
      return;
    }

    let ignore = false;
    setState({ status: "loading", stages: [], flavorText: null });

    fetchSpeciesInfo(speciesUrl)
      .then((info) => {
        if (ignore) return;
        setTimeout(() => {
          if (ignore) return;
          setState({ status: "success", ...info });
        }, LOADING_DELAY_MS);
      })
      .catch(() => {
        if (ignore) return;
        setTimeout(() => {
          if (ignore) return;
          setState({ status: "error", stages: [], flavorText: null });
        }, LOADING_DELAY_MS);
      });

    return () => {
      ignore = true;
    };
  }, [speciesUrl]);

  return state;
}
