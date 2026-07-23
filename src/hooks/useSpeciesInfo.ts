import { useEffect, useState } from "react";
import { fetchSpeciesInfo, type EvolutionStage } from "../api/evolutionChain";

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
        setState({ status: "success", ...info });
      })
      .catch(() => {
        if (ignore) return;
        setState({ status: "error", stages: [], flavorText: null });
      });

    return () => {
      ignore = true;
    };
  }, [speciesUrl]);

  return state;
}
