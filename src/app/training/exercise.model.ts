export interface Exercise {
  id: string;
  name: string;
  duration: number;
  caloriesBurned: number;
  date?: Date;
  state?: 'completed' | 'cancelled' | null;
}
