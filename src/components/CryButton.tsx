interface Props {
  cryUrl: string | null;
}

export function CryButton({ cryUrl }: Props) {
  if (!cryUrl) return null;
  const src = cryUrl;

  function handlePlay() {
    new Audio(src).play().catch(() => {});
  }

  return (
    <button
      type="button"
      onClick={handlePlay}
      aria-label="Play cry"
      className="rounded-full border border-slate-200 p-1.5 text-sm transition active:scale-95 dark:border-slate-600"
    >
      🔊
    </button>
  );
}
