import { http } from './http';


export function startWorkout(userId: number, date: string) {
  return http.post<{ message: string; workoutId?: number }>('/workouts', { userId, date });
}

export function endWorkout(workoutId: number) {
  return http.patch<{ message: string }>(`/workouts/end/${workoutId}`);
}


export function deleteWorkout(workoutId: number) {
  return http.delete<{ message: string }>(`/workouts/delete/${workoutId}`);
}
