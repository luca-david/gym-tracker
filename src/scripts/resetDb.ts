import 'dotenv/config';
import sql from '../db.js';
import { seedDefaults } from './seed.js';

export async function resetDatabase(): Promise<void> {
    //TRUNCATE clears every row in one shot; CASCADE lets it ignore the foreign keys between the
    //tables (there is no need to disable them first the way SQLite required), and RESTART
    //IDENTITY puts the id sequences back to 1 - Postgres reclaims the space itself, so the
    //old WAL checkpoint and VACUUM steps are gone
    await sql`TRUNCATE sets, workouts, exercises, categories, users RESTART IDENTITY CASCADE`;

    //repopulate the default categories and exercises
    await seedDefaults();

    console.log('The database was wiped and reseeded');
}

await resetDatabase();
