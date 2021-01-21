import { Pool } from 'pg';

export const pool: Pool = new Pool({
    connectionString: process.env.DATABASE_URL
});
