export const RENDER_BACKEND_URL = 'https://jobshield-ai-6vlk.onrender.com';

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || RENDER_BACKEND_URL
).replace(/\/+$/, '');

export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (typeof window !== 'undefined' && window.location.origin === API_BASE_URL) {
    return normalizedPath;
  }
  return `${API_BASE_URL}${normalizedPath}`;
}

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const url = apiUrl(path);
  try {
    return await fetch(url, init);
  } catch (err) {
    // If running in local dev / preview and external backend is unreachable, fall back to same-origin /api
    if (
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname.endsWith('.run.app'))
    ) {
      const normalizedPath = path.startsWith('/') ? path : `/${path}`;
      return fetch(normalizedPath, init);
    }
    throw err;
  }
}
