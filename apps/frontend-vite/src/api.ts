import { AuthResponse, Client, ClientPayload } from './types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    throw new Error('Sua sessão expirou. Faça login novamente.');
  }

  if (!response.ok) {
    const message = await safeMessage(response);
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

async function safeMessage(response: Response) {
  try {
    const data = await response.json();
    return data?.message ?? 'Algo deu errado. Tente novamente.';
  } catch {
    return 'Algo deu errado. Tente novamente.';
  }
}

export const api = {
  login: (email: string, password: string) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  fetchClients: (token: string) => request<Client[]>('/clients', {}, token),
  createClient: (payload: ClientPayload, token: string) =>
    request<Client>('/clients', { method: 'POST', body: JSON.stringify(payload) }, token),
  updateClient: (id: string, payload: ClientPayload, token: string) =>
    request<Client>(`/clients/${id}`, { method: 'PUT', body: JSON.stringify(payload) }, token),
  deleteClient: (id: string, token: string) =>
    request<void>(`/clients/${id}`, { method: 'DELETE' }, token),
};
