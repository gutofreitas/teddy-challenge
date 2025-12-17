import { IsArray, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '@teddy/auth-domain';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsOptional()
  @IsArray()
  roles?: UserRole[];
}