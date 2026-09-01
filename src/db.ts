import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

//the Neon connection string lives in .env locally and in the Vercel project settings in production
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error(
        'DATABASE_URL is not set. Put your Neon connection string in .env ' +
        '(and in the Vercel project environment variables for deployments).'
    );
}

//neon() speaks to Postgres over HTTP instead of a raw TCP socket, so there is no
//connection pool to keep warm between serverless invocations - every query is one fetch()
//it is used as a tagged template: sql`SELECT * FROM users WHERE id = ${id}`
//values interpolated that way are sent as bound parameters, never as string concatenation
export const sql = neon(connectionString);

export default sql;
