import { PoolConfig } from 'pg';

export const dbConfig: PoolConfig = {
    host: 'userdb',
    port: 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB 
};
