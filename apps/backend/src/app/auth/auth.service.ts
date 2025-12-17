import { Inject, Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  AuthDomainService,
  InvalidCredentialsError,
  UserAlreadyExistsError,
} from '@teddy/auth-domain';
import { AUTH_DOMAIN_SERVICE } from '../common/tokens';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_DOMAIN_SERVICE) private readonly authDomain: AuthDomainService,
    private readonly jwtService: JwtService
  ) {}

  async login(dto: LoginDto) {
    try {
      const user = await this.authDomain.validateCredentials(
        dto.email,
        dto.password
      );

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload: JwtPayload = {
        sub: user.id,
        email: user.email,
        roles: user.roles,
      };

      return {
        accessToken: await this.jwtService.signAsync(payload),
        user: {
          id: user.id,
          email: user.email,
          roles: user.roles,
        },
      };
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        throw new UnauthorizedException('Invalid credentials');
      }

      throw error;
    }
  }

  async register(dto: RegisterDto) {
    try {
      const user = await this.authDomain.register(dto);
      const payload: JwtPayload = {
        sub: user.id,
        email: user.email,
        roles: user.roles,
      };

      return {
        accessToken: await this.jwtService.signAsync(payload),
        user: {
          id: user.id,
          email: user.email,
          roles: user.roles,
        },
      };
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) {
        throw new ConflictException(error.message);
      }

      throw error;
    }
  }
}