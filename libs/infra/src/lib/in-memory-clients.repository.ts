import { v4 as uuid } from 'uuid';
import {
  Client,
  ClientsRepository,
  CreateClientInput,
  UpdateClientInput,
} from '@teddy/clients-domain';

export class InMemoryClientsRepository implements ClientsRepository {
  private clients: Client[] = [];

  constructor(seed: Client[] = []) {
    this.clients = seed.map((client) => ({
      ...client,
      createdAt: new Date(client.createdAt),
      updatedAt: new Date(client.updatedAt),
      email: client.email.toLowerCase(),
    }));
  }

  async create(input: CreateClientInput): Promise<Client> {
    const now = new Date();
    const client: Client = {
      id: uuid(),
      name: input.name,
      email: input.email.toLowerCase(),
      document: input.document,
      phone: input.phone,
      status: input.status ?? 'active',
      createdAt: now,
      updatedAt: now,
    };

    this.clients.push(client);
    return client;
  }

  async findById(id: string): Promise<Client | null> {
    return this.clients.find((client) => client.id === id) ?? null;
  }

  async findByEmail(email: string): Promise<Client | null> {
    const normalized = email.toLowerCase();
    return this.clients.find((client) => client.email === normalized) ?? null;
  }

  async update(id: string, changes: UpdateClientInput): Promise<Client> {
    const current = await this.findById(id);
    if (!current) {
      throw new Error(`Client ${id} not found`);
    }

    const updated: Client = {
      ...current,
      ...changes,
      email: (changes.email ?? current.email).toLowerCase(),
      status: changes.status ?? current.status,
      updatedAt: new Date(),
    };

    this.clients = this.clients.map((client) =>
      client.id === id ? updated : client
    );

    return updated;
  }

  async delete(id: string): Promise<void> {
    this.clients = this.clients.filter((client) => client.id !== id);
  }

  async list(): Promise<Client[]> {
    return [...this.clients];
  }
}