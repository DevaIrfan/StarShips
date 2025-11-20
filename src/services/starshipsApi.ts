import { supabase } from "../lib/supabaseClient";
import { Starship } from "../types/starship";

export const starshipsApi = {
  async getStarshipsByFaction(faction: string): Promise<Starship[]> {
    const { data, error } = await supabase
      .from("starships")
      .select("*")
      .eq("faction", faction);

    if (error) {
      console.error("Supabase Error:", error);
      return [];
    }

    return data as Starship[];
  },

  async getAllStarships(): Promise<Starship[]> {
    const { data, error } = await supabase.from("starships").select("*");

    if (error) {
      console.error("Supabase Error:", error);
      return [];
    }

    return data as Starship[];
  },

  async addStarship(starship: Omit<Starship, "id" | "created_at">) {
    const { data, error } = await supabase
      .from("starships")
      .insert(starship);

    if (error) {
      console.error("Supabase Insert Error:", error);
      throw error;
    }

    return data;
  },
  
  async getStarshipById(id: string): Promise<Starship | null> {
    const { data, error } = await supabase
      .from("starships")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Supabase Error:", error);
      return null;
    }

    return data as Starship;
  },

  async searchStarships(query: string): Promise<Starship[]> {
    const { data, error } = await supabase
      .from("starships")
      .select("*")
      .or(
        `name.ilike.%${query}%, faction.ilike.%${query}%, corporation.ilike.%${query}%, shipClass.ilike.%${query}%`
      );

    if (error) {
      console.error("Supabase Error:", error);
      return [];
    }

    return data as Starship[];
  },
};
