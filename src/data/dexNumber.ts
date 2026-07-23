export function formatDexNumber(id: number): string {
  return `#${String(id).padStart(3, "0")}`;
}
