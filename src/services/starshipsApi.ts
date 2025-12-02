import { supabase, isOnline, cacheManager, queueManager } from "../lib/supabaseClient";
import { Starship } from "../types/starship";

export const starshipsApi = {
  // ==========================================
  // READ OPERATIONS (dengan offline cache)
  // ==========================================

  async getStarshipsByFaction(faction: string): Promise<Starship[]> {
    const cacheKey = `faction_${faction}`;

    // Jika offline, ambil dari cache
    if (!isOnline()) {
      const cached = cacheManager.get(cacheKey);
      if (cached) {
        console.log('📦 Using cached data (offline):', faction);
        return cached;
      }
      console.warn('⚠️ No cached data available for faction:', faction);
      return [];
    }

    // Jika online, fetch dari Supabase
    try {
      const { data, error } = await supabase
        .from("starships")
        .select("*")
        .eq("faction", faction);

      if (error) {
        console.error("Supabase Error:", error);
        // Fallback ke cache jika fetch gagal
        const cached = cacheManager.get(cacheKey);
        return cached || [];
      }

      // Cache hasil untuk offline nanti
      cacheManager.set(cacheKey, data);
      return data as Starship[];
    } catch (error) {
      console.error("Network Error:", error);
      const cached = cacheManager.get(cacheKey);
      return cached || [];
    }
  },

  async getAllStarships(): Promise<Starship[]> {
    const cacheKey = 'all_starships';

    if (!isOnline()) {
      const cached = cacheManager.get(cacheKey);
      if (cached) {
        console.log('📦 Using cached data (offline): all starships');
        return cached;
      }
      return [];
    }

    try {
      const { data, error } = await supabase.from("starships").select("*");

      if (error) {
        console.error("Supabase Error:", error);
        const cached = cacheManager.get(cacheKey);
        return cached || [];
      }

      cacheManager.set(cacheKey, data);
      return data as Starship[];
    } catch (error) {
      console.error("Network Error:", error);
      const cached = cacheManager.get(cacheKey);
      return cached || [];
    }
  },

  async getStarshipById(id: string): Promise<Starship | null> {
    const cacheKey = `starship_${id}`;

    if (!isOnline()) {
      const cached = cacheManager.get(cacheKey);
      if (cached) {
        console.log('📦 Using cached data (offline):', id);
        return cached;
      }
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("starships")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Supabase Error:", error);
        const cached = cacheManager.get(cacheKey);
        return cached || null;
      }

      cacheManager.set(cacheKey, data);
      return data as Starship;
    } catch (error) {
      console.error("Network Error:", error);
      const cached = cacheManager.get(cacheKey);
      return cached || null;
    }
  },

  async searchStarships(query: string): Promise<Starship[]> {
    const cacheKey = `search_${query.toLowerCase()}`;

    if (!isOnline()) {
      const cached = cacheManager.get(cacheKey);
      if (cached) {
        console.log('📦 Using cached search results (offline)');
        return cached;
      }
      
      // Fallback: search di cached all_starships
      const allCached = cacheManager.get('all_starships');
      if (allCached) {
        const filtered = allCached.filter((ship: Starship) => {
          const searchLower = query.toLowerCase();
          return (
            ship.name?.toLowerCase().includes(searchLower) ||
            ship.faction?.toLowerCase().includes(searchLower) ||
            ship.corporation?.toLowerCase().includes(searchLower) ||
            ship.shipClass?.toLowerCase().includes(searchLower)
          );
        });
        return filtered;
      }
      
      return [];
    }

    try {
      const { data, error } = await supabase
        .from("starships")
        .select("*")
        .or(
          `name.ilike.%${query}%, faction.ilike.%${query}%, corporation.ilike.%${query}%, shipClass.ilike.%${query}%`
        );

      if (error) {
        console.error("Supabase Error:", error);
        const cached = cacheManager.get(cacheKey);
        return cached || [];
      }

      cacheManager.set(cacheKey, data);
      return data as Starship[];
    } catch (error) {
      console.error("Network Error:", error);
      const cached = cacheManager.get(cacheKey);
      return cached || [];
    }
  },

  // ==========================================
  // WRITE OPERATIONS (dengan offline queue)
  // ==========================================

  async addStarship(starship: Omit<Starship, "id" | "created_at">) {
    if (!isOnline()) {
      console.log('📴 Offline: Queueing insert operation');
      
      // Queue operation untuk sync nanti
      queueManager.add({
        operation: 'insert',
        table: 'starships',
        data: starship
      });

      // Optimistic update: tambah ke cache dengan temporary ID
      const tempId = `temp_${Date.now()}`;
      const tempStarship = {
        ...starship,
        id: tempId as any,
        created_at: new Date().toISOString()
      };

      // Update cache all_starships
      const allCached = cacheManager.get('all_starships') || [];
      cacheManager.set('all_starships', [...allCached, tempStarship]);

      return tempStarship;
    }

    // Online: langsung insert
    try {
      const { data, error } = await supabase
        .from("starships")
        .insert(starship)
        .select()
        .single();

      if (error) {
        console.error("Supabase Insert Error:", error);
        throw error;
      }

      // Invalidate caches
      cacheManager.remove('all_starships');
      if (starship.faction) {
        cacheManager.remove(`faction_${starship.faction}`);
      }

      return data;
    } catch (error) {
      console.error("Insert failed, queueing for later");
      queueManager.add({
        operation: 'insert',
        table: 'starships',
        data: starship
      });
      throw error;
    }
  },

  async updateStarship(
    id: string,
    updatedData: Partial<Omit<Starship, "id" | "created_at">>
  ) {
    if (!isOnline()) {
      console.log('📴 Offline: Queueing update operation');
      
      queueManager.add({
        operation: 'update',
        table: 'starships',
        data: updatedData,
        recordId: id
      });

      // Optimistic update di cache
      const cached = cacheManager.get(`starship_${id}`);
      if (cached) {
        const updated = { ...cached, ...updatedData };
        cacheManager.set(`starship_${id}`, updated);
      }

      return { ...updatedData, id } as Starship;
    }

    try {
      const { data, error } = await supabase
        .from("starships")
        .update(updatedData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Supabase Update Error:", error);
        throw error;
      }

      // Invalidate caches
      cacheManager.remove(`starship_${id}`);
      cacheManager.remove('all_starships');

      return data as Starship;
    } catch (error) {
      console.error("Update failed, queueing for later");
      queueManager.add({
        operation: 'update',
        table: 'starships',
        data: updatedData,
        recordId: id
      });
      throw error;
    }
  },

  async deleteStarship(id: string) {
    if (!isOnline()) {
      console.log('📴 Offline: Queueing delete operation');
      
      queueManager.add({
        operation: 'delete',
        table: 'starships',
        recordId: id
      });

      // Optimistic delete dari cache
      cacheManager.remove(`starship_${id}`);
      const allCached = cacheManager.get('all_starships');
      if (allCached) {
        const filtered = allCached.filter((s: Starship) => s.id !== id);
        cacheManager.set('all_starships', filtered);
      }

      return true;
    }

    try {
      const { error } = await supabase
        .from("starships")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Supabase Delete Error:", error);
        throw error;
      }

      // Invalidate caches
      cacheManager.remove(`starship_${id}`);
      cacheManager.remove('all_starships');

      return true;
    } catch (error) {
      console.error("Delete failed, queueing for later");
      queueManager.add({
        operation: 'delete',
        table: 'starships',
        recordId: id
      });
      throw error;
    }
  }
};