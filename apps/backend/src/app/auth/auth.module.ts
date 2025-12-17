import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SignOptions } from 'jsonwebtoken';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthSeeder } from './auth.seeder';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AUTH_DOMAIN_SERVICE, PASSWORD_HASHER, USER_REPOSITORY } from '../common/tokens';
import { AuthDomainService, PasswordHasher, UserRepository } from '@teddy/auth-domain';
import { BcryptPasswordHasher } from '@teddy/persistence-memory';
import { PersistenceModule } from '../persistence/persistence.module';

@Module({
  imports: [
    PassportModule,
    PersistenceModule,
    JwtModule.registerAsync({
      useFactory: () => {
        const expiresIn = (process.env.JWT_EXPIRES_IN ?? '1h') as SignOptions['expiresIn'];

        return {
          secret: process.env.JWT_SECRET ?? 'dev-secret',
          signOptions: { expiresIn },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    AuthSeeder,
    {
      provide: PASSWORD_HASHER,
      useClass: BcryptPasswordHasher,
    },
    {
      provide: AUTH_DOMAIN_SERVICE,
      useFactory: (repo: UserRepository, hasher: PasswordHasher) =>
        new AuthDomainService(repo, hasher),
      inject: [USER_REPOSITORY, PASSWORD_HASHER],
    },
  ],
  exports: [AUTH_DOMAIN_SERVICE, JwtAuthGuard],
})
export class AuthModule {}