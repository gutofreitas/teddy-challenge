import { Client, CreateClientInput, UpdateClientInput } from './entities';
import { ClientEmailTakenError, ClientNotFoundError } from './errors';
import { ClientsDomainServiceContract, ClientsRepository } from './ports';

export class ClientsDomainService implements ClientsDomainServiceContract {
  constructor(private readonly repository: ClientsRepository) {}

  async create(input: CreateClientInput): Promise<Client> {
    const existing = await this.repository.findByEmail(input.email);
    if (existing) {
      throw new ClientEmailTakenError(input.email);
    }

    return this.repository.create({
      ...input,
      status: input.status ?? 'active',
    });
  }

  async update(id: string, changes: UpdateClientInput): Promise<Client> {
    const current = await this.repository.findById(id);
    if (!current) {
      throw new ClientNotFoundError(id);
    }

    if (changes.email && changes.email !== current.email) {
      const existing = await this.repository.findByEmail(changes.email);
      if (existing && existing.id !== id) {
        throw new ClientEmailTakenError(changes.email);
      }
    }

    return this.repository.update(id, changes);
  }

  async delete(id: string): Promise<void> {
    const current = await this.repository.findById(id);
    if (!current) {
      throw new ClientNotFoundError(id);
    }

    await this.repository.delete(id);
  }

  async list(): Promise<Client[]> {
    return this.repository.list();
  }

  async get(id: string): Promise<Client> {
    const current = await this.repository.findById(id);
    if (!current) {
      throw new ClientNotFoundError(id);
    }

    return current;
  }
}