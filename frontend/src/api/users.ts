import { http } from './http';


export function createUser(name: string) {
  return http.post<{ message: string; userId?: number }>('/users/new', { name });
}
