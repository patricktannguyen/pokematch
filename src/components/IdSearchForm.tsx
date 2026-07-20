import { useState, type FormEvent } from "react";

interface Props {
  onSubmit: (id: number) => void;
}

export function IdSearchForm({ onSubmit }: Props) {
  const [value, setValue] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const id = Number(value);
    if (!Number.isInteger(id) || id < 1) return;
    onSubmit(id);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="number"
        min={1}
        inputMode="numeric"
        placeholder="Enter a Pokémon ID, e.g. 25"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
      <button
        type="submit"
        className="rounded-lg bg-indigo-600 px-5 py-2 font-medium text-white transition hover:bg-indigo-700"
      >
        Search
      </button>
    </form>
  );
}
