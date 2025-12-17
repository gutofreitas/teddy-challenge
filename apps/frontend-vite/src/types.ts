export type ClientStatus = 'active' | 'inactive';

export interface Client {
  id: string;
  name: string;
  email: string;
  document?: string;
  phone?: string;
  status: ClientStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  roles?: string[];
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface ClientPayload {
  name: string;
  email: string;
  document?: string;
  phone?: string;
  status?: ClientStatus;
}
