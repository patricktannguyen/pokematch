export interface TypeColor {
  accent: string;
}

export const TYPE_COLORS: Record<string, TypeColor> = {
  normal: { accent: "#A8A878" },
  fire: { accent: "#F08030" },
  water: { accent: "#6890F0" },
  electric: { accent: "#F8D030" },
  grass: { accent: "#78C850" },
  ice: { accent: "#98D8D8" },
  fighting: { accent: "#C03028" },
  poison: { accent: "#A040A0" },
  ground: { accent: "#E0C068" },
  flying: { accent: "#A890F0" },
  psychic: { accent: "#F85888" },
  bug: { accent: "#A8B820" },
  rock: { accent: "#B8A038" },
  ghost: { accent: "#705898" },
  dragon: { accent: "#7038F8" },
  dark: { accent: "#705848" },
  steel: { accent: "#B8B8D0" },
  fairy: { accent: "#EE99AC" },
};

export const DEFAULT_TYPE_COLOR: TypeColor = { accent: "#94A3B8" };

export function getTypeColor(type: string): TypeColor {
  return TYPE_COLORS[type] ?? DEFAULT_TYPE_COLOR;
}
