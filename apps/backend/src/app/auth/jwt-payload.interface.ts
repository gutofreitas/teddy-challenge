import { UserRole } from '@teddy/auth-domain';

export interface JwtPayload {
  sub: string;
  email: string;
  roles: UserRole[];
  iat?: number;
  exp?: number;
}