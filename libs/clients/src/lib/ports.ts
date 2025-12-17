import { Client, CreateClientInput, UpdateClientInput } from './entities';

export interface ClientsRepository {
  create(input: CreateClientInput): Promise<Client>;
  findById(id: string): Promise<Client | null>;
  findByEmail(email: string): Promise<Client | null>;
  update(id: string, changes: UpdateClientInput): Promise<Client>;
  delete(id: string): Promise<void>;
  list(): Promise<Client[]>;
}

export interface ClientsDomainServiceContract {
  create(input: CreateClientInput): Promise<Client>;
  update(id: string, changes: UpdateClientInput): Promise<Client>;
  delete(id: string): Promise<void>;
  list(): Promise<Client[]>;
  get(id: string): Promise<Client>;
}