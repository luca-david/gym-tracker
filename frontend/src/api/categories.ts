import { http } from './http';
import type { Category } from '../types';

export function fetchCategories() {
  return http.get<{ message: string; data: Category[] }>('/categories').then((r) => r.data);
}

// NOTE: createNewCategory on the backend currently checks `name.data` instead
// of `name`, so this call will always fail with "New category must have a
// name" until that's fixed. See the integration notes for the one-line patch.
export function createCategory(name: string) {
  return http.post<{ message: string; data: unknown }>('/categories', { name });
}
