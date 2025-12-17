import { InvalidCredentialsError, UserAlreadyExistsError } from './errors';
import { RegisterUserInput, User } from './entities';
import { AuthDomainServiceContract, PasswordHasher, UserRepository } from './ports';

export class AuthDomainService implements AuthDomainServiceContract {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher
  ) {}

  async register(input: RegisterUserInput): Promise<User> {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) {
      throw new UserAlreadyExistsError(input.email);
    }

    const passwordHash = await this.passwordHasher.hash(input.password);
    return this.userRepository.create({
      email: input.email.toLowerCase(),
      passwordHash,
      roles: input.roles?.length ? input.roles : ['user'],
    });
  }

  async validateCredentials(
    email: string,
    password: string
  ): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return null;
    }

    const isValid = await this.passwordHasher.compare(password, user.passwordHash);
    if (!isValid) {
      throw new InvalidCredentialsError();
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async list(): Promise<User[]> {
    return this.userRepository.list();
  }
}