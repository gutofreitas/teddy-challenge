import { IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { ClientStatus } from '@teddy/clients-domain';

export class UpdateClientDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

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