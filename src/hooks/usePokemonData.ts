import { useEffect, useState } from "react";

export interface Pokemon {
  id: number;
  pokedex_number: number;
  name: string;
  slug: string;
  description?: string;
  base_height?: number;
  base_weight?: number;
  primary_type_id?: number;
  secondary_type_id?: number;
  base_constitution?: number;
  base_strength?: number;
  base_dexterity?: number;
  base_intelligence?: number;
  base_wisdom?: number;
  base_charisma?: number;
  armor_class?: number;
  ground_speed?: number;
  swimming_speed?: number;
  flying_speed?: number;
}

export function usePokemonData() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/pokemon");
        const data = await res.json();
        setPokemon(data);
      } catch (err) {
        console.error("Failed to fetch pokemon data", err);
      }
    })();
  }, []);
  return pokemon;
}
