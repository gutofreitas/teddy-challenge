import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { AuthDomainService, UserAlreadyExistsError } from '@teddy/auth-domain';
import { AUTH_DOMAIN_SERVICE } from '../common/tokens';

@Injectable()
export class AuthSeeder implements OnModuleInit {
  constructor(
    @Inject(AUTH_DOMAIN_SERVICE) private readonly authDomain: AuthDomainService
  ) {}

  async onModuleInit() {
    const email = process.env.ADMIN_EMAIL ?? 'admin@teddy.local';
    const password = process.env.ADMIN_PASSWORD ?? 'admin123';

    try {
      await this.authDomain.register({ email, password, roles: ['admin'] });
      Logger.log(`Seeded default admin user ${email}`);
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) {
        Logger.log(`Admin user ${email} already exists`);
        return;
      }

      Logger.error('Failed to seed admin user', error as Error);
    }
  }
}