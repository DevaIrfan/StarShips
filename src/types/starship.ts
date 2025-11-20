export interface Starship {
  id: number;
  name: string;
  faction: string | null;
  corporation: string | null;
  shipClass: string | null;
  image: string | null;
  shieldPoints: number | null;
  hullPoints: number | null;
  armaments: string | null;
  description: string | null;
  created_at: string;
}
