import { Pool } from 'pg';

export function createPgPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is required when DB_PROVIDER=postgres');
  }

  const max = Number(process.env.DB_POOL_MAX ?? 10);
  const idleTimeoutMillis = Number(process.env.DB_POOL_IDLE ?? 30000);
  const connectionTimeoutMillis = Number(process.env.DB_POOL_TIMEOUT ?? 10000);

  return new Pool({
    connectionString,
    max,
    idleTimeoutMillis,
    connectionTimeoutMillis,
  });
}
