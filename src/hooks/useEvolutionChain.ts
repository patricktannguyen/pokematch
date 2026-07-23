import { useEffect, useState } from "react";
import { fetchEvolutionChainBySpeciesUrl, type EvolutionStage } from "../api/evolutionChain";

type Status = "loading" | "error" | "success";

interface State {
  status: Status;
  stages: EvolutionStage[];
}

export function useEvolutionChain(speciesUrl: string) {
  const [state, setState] = useState<State>({ status: "loading", stages: [] });

  useEffect(() => {
    let ignore = false;
    setState({ status: "loading", stages: [] });

    fetchEvolutionChainBySpeciesUrl(speciesUrl)
      .then((stages) => {
        if (ignore) return;
        setState({ status: "success", stages });
      })
      .catch(() => {
        if (ignore) return;
        setState({ status: "error", stages: [] });
      });

    return () => {
      ignore = true;
    };
  }, [speciesUrl]);

  return state;
}
