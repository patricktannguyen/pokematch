import { useEffect, useState } from "react";

interface Props {
  text: string | null;
}

const REVEAL_INTERVAL_MS = 18;

export function FlavorText({ text }: Props) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    setShown(0);
    if (!text) return;

    const id = setInterval(() => {
      setShown((n) => {
        if (n >= text.length) {
          clearInterval(id);
          return n;
        }
        return n + 1;
      });
    }, REVEAL_INTERVAL_MS);

    return () => clearInterval(id);
  }, [text]);

  if (!text) return null;

  const done = shown >= text.length;

  return (
    <p className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs leading-relaxed text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
      <span aria-hidden="true">
        {text.slice(0, shown)}
        {!done && <span className="animate-pulse">▍</span>}
      </span>
      <span className="sr-only">{text}</span>
    </p>
  );
}
