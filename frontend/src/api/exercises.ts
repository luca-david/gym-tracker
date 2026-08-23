import { http } from './http';
import type { Exercise } from '../types/index';

export function fetchExercisesForCategory(categoryId: number | string) {
  return http
    .get<{ message: string; data: Exercise[] }>(`/exercises/onCategory/${categoryId}`)
    .then((r) => r.data);
}
