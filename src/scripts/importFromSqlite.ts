import 'dotenv/config';
import Database from 'better-sqlite3';
import sql from '../db.js';

//one off copy of the old gym.db file into Neon, run it after `npm run migrate`
//ids are carried over so the existing sets still point at the right workouts and exercises,
//and the identity sequences are pushed past the highest imported id at the end
//it is safe to run twice: rows that are already there are skipped

const sqlitePath = process.argv[2] ?? 'gym.db';

interface UserRow { id: number; name: string }
interface CategoryRow { id: number; name: string; user_id: number | null }
interface ExerciseRow { id: number; name: string; category_id: number }
interface WorkoutRow { id: number; date: string; user_id: number; status: string }
interface SetRow {
    id: number;
    workout_id: number;
    exercise_id: number;
    reps: number;
    weight: number;
    note: string | null;
}

//Neon's HTTP driver makes one request per transaction, so the rows are sent in batches
//rather than one round trip per row
const BATCH_SIZE = 50;

async function insertInBatches<T>(
    label: string,
    rows: T[],
    toQuery: (row: T) => ReturnType<typeof sql>
): Promise<void> {
    for (let start = 0; start < rows.length; start += BATCH_SIZE) {
        await sql.transaction(rows.slice(start, start + BATCH_SIZE).map(toQuery));
    }
    console.log('  ' + label + ': ' + rows.length + ' rows');
}

export async function importFromSqlite(filePath: string): Promise<void> {
    const sqlite = new Database(filePath, { readonly: true });

    const users = sqlite.prepare('SELECT * FROM users ORDER BY id').all() as UserRow[];
    const categories = sqlite.prepare('SELECT * FROM categories ORDER BY id').all() as CategoryRow[];
    const exercises = sqlite.prepare('SELECT * FROM exercises ORDER BY id').all() as ExerciseRow[];
    const workouts = sqlite.prepare('SELECT * FROM workouts ORDER BY id').all() as WorkoutRow[];
    const sets = sqlite.prepare('SELECT * FROM sets ORDER BY id').all() as SetRow[];

    sqlite.close();

    console.log('Importing ' + filePath + ' into Neon...');

    //parents before children, so the foreign keys always have something to point at
    await insertInBatches('users', users, (user) => sql`
        INSERT INTO users (id, name) VALUES (${user.id}, ${user.name})
        ON CONFLICT DO NOTHING
    `);

    await insertInBatches('categories', categories, (category) => sql`
        INSERT INTO categories (id, name, user_id)
        VALUES (${category.id}, ${category.name}, ${category.user_id})
        ON CONFLICT DO NOTHING
    `);

    await insertInBatches('exercises', exercises, (exercise) => sql`
        INSERT INTO exercises (id, name, category_id)
        VALUES (${exercise.id}, ${exercise.name}, ${exercise.category_id})
        ON CONFLICT DO NOTHING
    `);

    await insertInBatches('workouts', workouts, (workout) => sql`
        INSERT INTO workouts (id, date, user_id, status)
        VALUES (${workout.id}, ${workout.date}, ${workout.user_id}, ${workout.status})
        ON CONFLICT DO NOTHING
    `);

    await insertInBatches('sets', sets, (set) => sql`
        INSERT INTO sets (id, workout_id, exercise_id, reps, weight, note)
        VALUES (${set.id}, ${set.workout_id}, ${set.exercise_id}, ${set.reps}, ${set.weight}, ${set.note})
        ON CONFLICT DO NOTHING
    `);

    //the identity sequences were never advanced by the explicit ids above, so without this the
    //next INSERT would try to reuse id 1 and hit the primary key
    await sql.transaction(
        ['users', 'categories', 'exercises', 'workouts', 'sets'].map(
            (table) => sql`
                SELECT setval(
                    pg_get_serial_sequence(${table}, 'id'),
                    COALESCE((SELECT MAX(id) FROM ${sql.unsafe(table)}), 0) + 1,
                    false
                )
            `
        )
    );

    console.log('Import finished, id sequences resynced');
}

await importFromSqlite(sqlitePath);
