import { useDarkMode } from "../hooks/useDarkMode";

export function DarkModeToggle() {
  const { theme, toggle } = useDarkMode();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="rounded-lg border border-slate-300 p-2 text-lg transition active:scale-95 dark:border-slate-600"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
