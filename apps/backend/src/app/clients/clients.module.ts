import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { CLIENTS_DOMAIN_SERVICE, CLIENTS_REPOSITORY } from '../common/tokens';
import { ClientsDomainService, ClientsRepository } from '@teddy/clients-domain';
import { AuthModule } from '../auth/auth.module';
import { PersistenceModule } from '../persistence/persistence.module';

@Module({
  imports: [AuthModule, PersistenceModule],
  controllers: [ClientsController],
  providers: [
    ClientsService,
    {
      provide: CLIENTS_DOMAIN_SERVICE,
      useFactory: (repo: ClientsRepository) => new ClientsDomainService(repo),
      inject: [CLIENTS_REPOSITORY],
    },
  ],
})
export class ClientsModule {}