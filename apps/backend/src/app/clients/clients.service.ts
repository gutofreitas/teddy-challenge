import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import {
  ClientsDomainService,
  ClientEmailTakenError,
  ClientNotFoundError,
} from '@teddy/clients-domain';
import { CLIENTS_DOMAIN_SERVICE } from '../common/tokens';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @Inject(CLIENTS_DOMAIN_SERVICE)
    private readonly domain: ClientsDomainService
  ) {}

  async list() {
    return this.domain.list();
  }

  async get(id: string) {
    try {
      return await this.domain.get(id);
    } catch (error) {
      if (error instanceof ClientNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  async create(dto: CreateClientDto) {
    try {
      return await this.domain.create(dto);
    } catch (error) {
      if (error instanceof ClientEmailTakenError) {
        throw new ConflictException(error.message);
      }

      throw error;
    }
  }

  async update(id: string, dto: UpdateClientDto) {
    try {
      return await this.domain.update(id, dto);
    } catch (error) {
      if (error instanceof ClientEmailTakenError) {
        throw new ConflictException(error.message);
      }

      if (error instanceof ClientNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  async delete(id: string) {
    try {
      await this.domain.delete(id);
    } catch (error) {
      if (error instanceof ClientNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }
}