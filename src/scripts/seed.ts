import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sql from '../db.js';
import { defaultCategories, defaultExercises } from '../seed/defaults.js';

//populate the default categories and exercises
//ON CONFLICT DO NOTHING is the Postgres equivalent of SQLite's INSERT OR IGNORE, so running
//this against a database that already has them is harmless
export async function seedDefaults(): Promise<void> {
    //one transaction, and Neon runs the queries in the order they are listed, so the categories
    //exist by the time the exercises look up their category_id
    await sql.transaction([
        ...defaultCategories.map(
            (name) => sql`
                INSERT INTO categories (name) VALUES (${name})
                ON CONFLICT DO NOTHING
            `
        ),
        ...defaultExercises.map(
            (exercise) => sql`
                INSERT INTO exercises (name, category_id)
                SELECT ${exercise.name}, categories.id
                FROM categories
                WHERE categories.name = ${exercise.category}
                ON CONFLICT DO NOTHING
            `
        ),
    ]);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
    await seedDefaults();
    console.log(
        'Seeded ' + defaultCategories.length + ' categories and ' +
        defaultExercises.length + ' exercises'
    );
}
