import db from '../db.js';
import { seedDefaultCategories, defaultCategories } from '../db.js';

export function resetDatabase() {
    //disable foreign keys so the data can be deleted in any order
    db.pragma('foreign_keys = OFF');

    //clear all rows and reset autoincrement back to 1
    db.exec(`
        DELETE FROM sets;
        DELETE FROM categories;
        DELETE FROM exercises;
        DELETE FROM workouts;
        DELETE FROM sqlite_sequence; 
    `);

    //reenable foreign keys
    db.pragma('foreign_leys = ON');

    //repopulate with default values for categories
    seedDefaultCategories(defaultCategories);

    //truncate -wal file back to 0 bytes
    db.pragma('wal_checkpoint(TRUNCATE)');

    //clean up allocated database memory space
    db.pragma('VACUUM');

    console.log('The database was wiped');
}

resetDatabase();
