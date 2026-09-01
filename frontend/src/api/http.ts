// Base URL for the Express API. Override with VITE_API_BASE_URL in a .env file.
const BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL ?? '/api';

export class ApiError extends Error {}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
    ...options,
  });

  // The backend is inconsistent with HTTP status codes (e.g. user creation
  // returns 401 on success), so we treat the presence of an `error` field in
  // the JSON body as the real signal instead of relying on res.ok.
  const body = await res.json().catch(() => ({}));

  if (body && typeof body === 'object' && 'error' in body) {
    throw new ApiError(String((body as { error: unknown }).error ?? 'Request failed'));
  }

  if (!res.ok && (!body || typeof body !== 'object' || !('message' in body))) {
    throw new ApiError(`Request to ${path} failed with status ${res.status}`);
  }

  return body as T;
}

export const http = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: 'POST', body: data !== undefined ? JSON.stringify(data) : undefined }),
  patch: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: 'PATCH', body: data !== undefined ? JSON.stringify(data) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
