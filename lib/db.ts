import { Pool, type PoolClient, type QueryResultRow } from 'pg';

const cache = globalThis as typeof globalThis & { beanSourcePool?: Pool };

export function databaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

function database() {
  if (!process.env.DATABASE_URL) throw new Error('Missing database configuration.');
  return cache.beanSourcePool ??= new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5,
    connectionTimeoutMillis: 5_000,
    statement_timeout: 8_000,
  });
}

export function query<T extends QueryResultRow>(sql: string, params: unknown[] = []) {
  return database().query<T>(sql, params);
}

export async function inTransaction<T>(work: (client: PoolClient) => Promise<T>) {
  const client = await database().connect();
  try {
    await client.query('BEGIN');
    const result = await work(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
