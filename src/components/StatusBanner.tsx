interface Props {
  kind: "loading" | "error" | "empty";
  message?: string;
}

export function StatusBanner({ kind, message }: Props) {
  if (kind === "loading") {
    return <p className="text-slate-500">Loading Pokémon…</p>;
  }
  if (kind === "error") {
    return (
      <p className="rounded-lg bg-red-50 px-4 py-3 text-red-700">
        {message ?? "Something went wrong."}
      </p>
    );
  }
  return <p className="text-slate-500">No other Pokémon share this base experience.</p>;
}
