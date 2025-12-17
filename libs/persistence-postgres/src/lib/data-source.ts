import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ClientEntity } from './entities/client.entity';
import { UserEntity } from './entities/user.entity';

export function createDataSource() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is required when DB_PROVIDER=postgres');
  }

  const ssl = (process.env.DB_SSL ?? 'false').toLowerCase() === 'true';

  return new DataSource({
    type: 'postgres',
    url,
    ssl,
    entities: [UserEntity, ClientEntity],
    synchronize: true,
    logging: false,
  });
}
