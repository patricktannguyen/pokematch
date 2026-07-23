interface FlavorTextEntry {
  flavor_text: string;
  language: { name: string };
}

export function pickEnglishFlavorText(entries: FlavorTextEntry[]): string | null {
  const entry = entries.find((e) => e.language.name === "en");
  if (!entry) return null;
  return entry.flavor_text
    .replace(/[\n\f\r]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
