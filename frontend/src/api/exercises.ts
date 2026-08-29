import { http } from './http';
import type { Exercise } from '../types/index';

export function fetchExercisesForCategory(categoryId: number | string) {
  return http
    .get<{ message: string; data: Exercise[] }>(`/exercises/onCategory/${categoryId}`)
    .then((r) => r.data);
}

export function createNewExercise(name: string, categoryId: number | string) {
  return http.post<{ message: string; data: Exercise }>(`/exercises/new/${categoryId}`, {name});
  //Request to exercises/new/NaN failed with status 500
}