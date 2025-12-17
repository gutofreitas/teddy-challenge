import { Module, Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CLIENTS_REPOSITORY, DATABASE_SOURCE, USER_REPOSITORY } from '../common/tokens';
import { InMemoryClientsRepository, InMemoryUsersRepository } from '@teddy/persistence-memory';
import {
  PostgresClientsRepository,
  PostgresUsersRepository,
  createDataSource,
} from '@teddy/persistence-postgres';

const usePostgres = (process.env.DB_PROVIDER ?? '').toLowerCase() === 'postgres';

const dataSourceProvider: Provider = {
  provide: DATABASE_SOURCE,
  useFactory: async () => {
    if (!usePostgres) return null;
    const dataSource = createDataSource();
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    return dataSource;
  },
};

const userRepoProvider: Provider = {
  provide: USER_REPOSITORY,
  useFactory: (dataSource: DataSource | null) => {
    if (usePostgres) {
      if (!dataSource) {
        throw new Error('Database source not initialized');
      }
      return new PostgresUsersRepository(dataSource);
    }

    return new InMemoryUsersRepository();
  },
  inject: [DATABASE_SOURCE],
};

const clientsRepoProvider: Provider = {
  provide: CLIENTS_REPOSITORY,
  useFactory: (dataSource: DataSource | null) => {
    if (usePostgres) {
      if (!dataSource) {
        throw new Error('Database source not initialized');
      }
      return new PostgresClientsRepository(dataSource);
    }

    return new InMemoryClientsRepository();
  },
  inject: [DATABASE_SOURCE],
};

@Module({
  providers: [dataSourceProvider, userRepoProvider, clientsRepoProvider],
  exports: [dataSourceProvider, userRepoProvider, clientsRepoProvider],
})
export class PersistenceModule {}
