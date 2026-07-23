interface CriesInput {
  latest: string | null;
  legacy: string | null;
}

export function resolveCryUrl(cries: CriesInput | null | undefined): string | null {
  return cries?.latest ?? cries?.legacy ?? null;
}
