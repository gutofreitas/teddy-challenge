import { v4 as uuid } from 'uuid';
import { User, UserRepository } from '@teddy/auth-domain';

export class InMemoryUsersRepository implements UserRepository {
  private users: User[] = [];

  constructor(seed: User[] = []) {
    this.users = seed.map((user) => ({
      ...user,
      createdAt: new Date(user.createdAt),
      email: user.email.toLowerCase(),
    }));
  }

  async findByEmail(email: string): Promise<User | null> {
    const normalized = email.toLowerCase();
    return this.users.find((user) => user.email === normalized) ?? null;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) ?? null;
  }

  async create(input: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const created: User = {
      ...input,
      id: uuid(),
      createdAt: new Date(),
      email: input.email.toLowerCase(),
    };

    this.users.push(created);
    return created;
  }

  async update(user: User): Promise<User> {
    const index = this.users.findIndex((item) => item.id === user.id);
    if (index === -1) {
      throw new Error(`User ${user.id} not found`);
    }

    this.users[index] = {
      ...user,
      email: user.email.toLowerCase(),
    };

    return this.users[index];
  }

  async list(): Promise<User[]> {
    return [...this.users];
  }
}