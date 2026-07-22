// src/lib/api/client.ts
const BASE = import.meta.env.VITE_API_URL || 'https://kerjantara-backend-production.up.railway.app';

let token: string | null = null;

export function setBackendToken(t: string) { 
  token = t; 
  if (typeof window !== 'undefined') {
    localStorage.setItem('kjt_jwt', t); 
  }
}

export function getBackendToken() { 
  if (token) return token;
  if (typeof window !== 'undefined') {
    return localStorage.getItem('kjt_jwt');
  }
  return null;
}

export function clearBackendToken() {
  token = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('kjt_jwt');
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const jwt = getBackendToken();
  if (jwt) headers['Authorization'] = `Bearer ${jwt}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json();
  if (!res.ok) {
    throw new ApiError(json.error || { code: 'UNKNOWN_ERROR', message: 'Terjadi kesalahan tidak dikenal' });
  }
  return json.data;
}

export const api = {
  get:    <T>(path: string)                    => request<T>('GET', path),
  post:   <T>(path: string, body?: unknown)    => request<T>('POST', path, body),
  patch:  <T>(path: string, body?: unknown)    => request<T>('PATCH', path, body),
  upload: <T>(path: string, formData: FormData) => {
    const jwt = getBackendToken();
    return fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
      body: formData,
    }).then(async r => {
      const json = await r.json();
      if (!r.ok) throw new ApiError(json.error);
      return json.data;
    });
  },
};

export class ApiError extends Error {
  code: string;
  constructor(e: { code: string; message: string }) { 
    super(e.message); 
    this.code = e.code; 
    this.name = 'ApiError';
  }
}
