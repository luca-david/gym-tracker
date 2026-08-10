import Database, { type Database as SqliteDatabase } from 'better-sqlite3';

//create the connection to the database file
const db : SqliteDatabase = new Database('gym.db');

//enable WAL mode for better write performace
//WAL - Write Ahead Logging, allows for concurrent queries
//the alternative is modifying the dtabase direclty and keeping track of changes using rollback
db.pragma(' journal_mode = WAL ');

//enable foreign key constraint - mandatory for ON DELETE CASCADE to work
db.pragma( 'foreign_keys = ON' );

const createTableUsers = `
    CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    );
`;

const createTableCategories = `
    CREATE TABLE IF NOT EXISTS categories(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        user_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
`;

//create the workouts table if it does not exist
const createTableWorkouts = `
    CREATE TABLE IF NOT EXISTS workouts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        status TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
`;

//create the exercises table if it does not exist
const createTableExercises = `
    CREATE TABLE IF NOT EXISTS exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        category_id INTEGER NOT NULL,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    );
`;

//create the sets table if it does not exist
const createTableSets = `
    CREATE TABLE IF NOT EXISTS sets(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workout_id INTEGER NOT NULL,
        exercise_id INTEGER NOT NULL,
        reps INTEGER NOT NULL,
        weight INTEGER NOT NULL,
        note TEXT,
        FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE,
        FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
    );
`;

db.exec(createTableUsers);
db.exec(createTableWorkouts);
db.exec(createTableExercises);
db.exec(createTableSets);
db.exec(createTableCategories);


export const defaultCategories = [
    'Chest',
    'Back',
    'Biceps',
    'Triceps',
    'Abs',
    'Shoulders',
    'Legs'
]

//seed(populate with initial data so app works right out of the box) default muscle group categories into a transaction
export function seedDefaultCategories(categories: string[]) {

    //compiles the sql query template
    const insertCategory = db.prepare(`
        INSERT OR IGNORE INTO CATEGORIES (name) VALUES (?) 
    `);

    //create the transaction blueprint(returns a callable function)
    const transaction = db.transaction((categories: string[]) => {
        for (const category of categories) {
            insertCategory.run(category); //executed only when transaction runs
        }
    })

    //this is when the transaction with .run() actually executes
    transaction(defaultCategories);
}

seedDefaultCategories(defaultCategories); 

export const defaultExercises = [
    'Incline Dumbbell Press',
    'Flat Machine Press',
    'Lat Pulldown',
    'Chest Supported T-Bar Row',
    'Cable Curl',
    'Dumbell Curl',
    'Straight Bar Pushdown',
    'Rope Pushdown',
    'Cable Crunch',
    'Decline Crunch',
    'Cable Lateral Raise',
    'Dumbell Overhead Press',
    'Leg Press',
    'Leg Extensions'
]

export function seedDefaultExercises(exercises: string[]) {
    const insertExerciseStatement = db.prepare(`
        INSERT OR IGNORE INTO exercises (name, category_id) VALUES (?, ?)    
    `);

    //create the callable function(we need a function since there are multiple .run() statements)
    const transaction = db.transaction((exercises: string[]) => {
        let exerciseIdx = 0;
        for (let categoryId = 1; categoryId < 8; categoryId++) { //for categories
            for (let j = 0; j < 2; j++) { //to repeat the category for 2 exercises
                insertExerciseStatement.run(exercises.at(exerciseIdx), categoryId);
                exerciseIdx++;
            }
        }
    });

    transaction(exercises);

}



seedDefaultExercises(defaultExercises);

const exerciseCategories = [
    { categoryId: 1, exercises: ['Incline Dumbbell Press', 'Flat Machine Press'] },
    { categoryId: 2, exercises: ['Lat Pulldown', 'Chest Supported T-Bar Row'] },
    { categoryId: 3, exercises: ['Cable Curl', 'Dumbbell Curl'] },
    { categoryId: 4, exercises: ['Straight Bar Pushdown', 'Rope Pushdown'] },
    { categoryId: 5, exercises: ['Cable Crunch', 'Decline Crunch'] },
    { categoryId: 6, exercises: ['Cable Lateral Raise', 'Dumbell Overhead Press'] },
    { categoryId: 7, exercises: ['Leg Press', 'Leg Extensions'] }
];

export default db;