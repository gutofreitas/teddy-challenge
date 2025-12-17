import { RegisterUserInput, User } from './entities';

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(input: Omit<User, 'id' | 'createdAt'>): Promise<User>;
  update(user: User): Promise<User>;
  list(): Promise<User[]>;
}

export interface PasswordHasher {
  hash(plain: string): Promise<string>;
  compare(plain: string, hash: string): Promise<boolean>;
}

export interface AuthDomainServiceContract {
  register(input: RegisterUserInput): Promise<User>;
  validateCredentials(email: string, password: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  list(): Promise<User[]>;
}