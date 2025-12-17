import { DataSource, Repository } from 'typeorm';
import { User, UserRepository, UserRole } from '@teddy/auth-domain';
import { UserEntity } from './entities/user.entity';

export class PostgresUsersRepository implements UserRepository {
  private readonly repo: Repository<UserEntity>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(UserEntity);
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repo.findOne({ where: { email } });
    return entity ? this.map(entity) : null;
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? this.map(entity) : null;
  }

  async list(): Promise<User[]> {
    const entities = await this.repo.find({ order: { createdAt: 'DESC' } });
    return entities.map((e) => this.map(e));
  }

  async create(input: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const entity = this.repo.create({
      email: input.email,
      passwordHash: input.passwordHash,
      roles: input.roles ?? [],
    });
    const saved = await this.repo.save(entity);
    return this.map(saved);
  }

  async update(user: User): Promise<User> {
    const entity = await this.repo.findOneOrFail({ where: { id: user.id } });
    entity.email = user.email;
    entity.passwordHash = user.passwordHash;
    entity.roles = user.roles ?? [];
    const saved = await this.repo.save(entity);
    return this.map(saved);
  }

  private map(entity: UserEntity): User {
    const roles = (entity.roles ?? []).filter((role): role is UserRole =>
      role === 'admin' || role === 'user'
    );

    return {
      id: entity.id,
      email: entity.email,
      passwordHash: entity.passwordHash,
      roles,
      createdAt: entity.createdAt,
    };
  }
}
