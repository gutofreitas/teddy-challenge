export type ClientStatus = 'active' | 'inactive';

export interface Client {
  id: string;
  name: string;
  email: string;
  document?: string;
  phone?: string;
  status: ClientStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClientInput {
  name: string;
  email: string;
  document?: string;
  phone?: string;
  status?: ClientStatus;
}

export interface UpdateClientInput {
  name?: string;
  email?: string;
  document?: string;
  phone?: string;
  status?: ClientStatus;
}