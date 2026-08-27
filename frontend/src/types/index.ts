export interface Category {
  id: number;
  name: string;
}

export interface Exercise {
  id: number;
  name: string;
  category_id: number;
}

export type WorkoutStatus = 'in_progress' | 'finished';

export interface ActiveWorkout {
  id: number;
  date: string;
  status: WorkoutStatus;
}

export interface LoggedSet {
  id: number;
  exerciseId: number;
  exerciseName: string;
  reps: number;
  weight: number;
  note?: string;
  categoryId: number;
}
