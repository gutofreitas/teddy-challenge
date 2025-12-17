import { IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { ClientStatus } from '@teddy/clients-domain';

export class CreateClientDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  document?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: ClientStatus;
}