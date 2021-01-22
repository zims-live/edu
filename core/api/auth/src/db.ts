import { Pool } from 'pg';

const connectionString: string =
  process.env.DATABASE_URL ??
  'postgresql://postgres:postgres@userdb:5432/database';

export default new Pool({
  connectionString: connectionString
});
