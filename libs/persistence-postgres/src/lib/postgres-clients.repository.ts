import { DataSource, Repository } from 'typeorm';
import { Client, ClientsRepository, CreateClientInput, UpdateClientInput } from '@teddy/clients-domain';
import { ClientEntity } from './entities/client.entity';

export class PostgresClientsRepository implements ClientsRepository {
  private readonly repo: Repository<ClientEntity>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(ClientEntity);
  }

  async list(): Promise<Client[]> {
    const entities = await this.repo.find({ order: { createdAt: 'DESC' } });
    return entities.map((e) => this.map(e));
  }

  async findById(id: string): Promise<Client | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? this.map(entity) : null;
  }

  async findByEmail(email: string): Promise<Client | null> {
    const entity = await this.repo.findOne({ where: { email } });
    return entity ? this.map(entity) : null;
  }

  async create(input: CreateClientInput): Promise<Client> {
    const entity = this.repo.create({
      name: input.name,
      email: input.email,
      document: input.document ?? null,
      phone: input.phone ?? null,
      status: input.status ?? 'active',
    });
    const saved = await this.repo.save(entity);
    return this.map(saved);
  }

  async update(id: string, changes: UpdateClientInput): Promise<Client> {
    const entity = await this.repo.findOneOrFail({ where: { id } });
    entity.name = changes.name ?? entity.name;
    entity.email = changes.email ?? entity.email;
    entity.document = changes.document ?? entity.document ?? null;
    entity.phone = changes.phone ?? entity.phone ?? null;
    entity.status = changes.status ?? entity.status;
    const saved = await this.repo.save(entity);
    return this.map(saved);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  private map(entity: ClientEntity): Client {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      document: entity.document ?? undefined,
      phone: entity.phone ?? undefined,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
