import { Pool } from "pg";

const pool = new Pool ({
    host: 'ep-old-tooth-acpzvemw-pooler.sa-east-1.aws.neon.tech',
    port: 5432,
    database: 'neondb',
    user: 'neondb_owner',
    password: 'npg_KhxAr5T6FUGI',
    ssl: require
});

export default pool;