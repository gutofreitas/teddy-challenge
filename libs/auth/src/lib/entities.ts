export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  roles: UserRole[];
  createdAt: Date;
}

export interface RegisterUserInput {
  email: string;
  password: string;
  roles?: UserRole[];
}