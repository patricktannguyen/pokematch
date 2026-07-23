export function PokeballSpinner() {
  return (
    <div
      className="relative mx-auto h-10 w-10 animate-spin"
      role="status"
      aria-label="Loading"
    >
      <div className="absolute inset-0 overflow-hidden rounded-full border-2 border-slate-900 dark:border-slate-100">
        <div className="absolute inset-x-0 top-0 h-1/2 bg-red-500" />
        <div className="absolute inset-x-0 bottom-0 top-1/2 bg-white" />
        <div className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-slate-900 dark:bg-slate-100" />
      </div>
      <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-slate-900 bg-white dark:border-slate-100" />
    </div>
  );
}
