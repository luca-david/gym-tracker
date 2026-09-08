import { http } from './http';
import type { PreviousSet } from '@/types';

export interface LogSetPayload {
  reps: number;
  weight: number;
  note?: string;
  exerciseId: number;
}

export function logSet(workoutId: number, payload: LogSetPayload) {
  return http.post<{ message: string; setId: number }>(`/workouts/${workoutId}/sets`, payload);
}

export function updateSet(setId: number, updates: { reps?: number; weight?: number; note?: string }) {
  return http.patch<{ message: string }>(`/sets/${setId}`, updates);
}

export async function getPreviousSetsForExercise(exerciseId: number) {
  const res = await http.get<{ message: string; data: PreviousSet[]}>(`/sets/history/exercise/${exerciseId}`);
  return res.data
}