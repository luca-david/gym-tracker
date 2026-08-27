import type { Request, Response } from 'express';
import db from '../db.js';

const getExercisesOnCategoryStatement = db.prepare(`
    SELECT * FROM exercises WHERE category_id = ?
`);

const createNewExerciseStmt = db.prepare(`
    INSERT OR IGNORE INTO exercises (name, category_id) VALUES (?, ?)    
`)

export const getExercisesOnCategory = (req: Request, res: Response) => {
    const { categoryId } = req.params;

    if (!categoryId) {
        return res.status(400).json({
            'error': 'No categoryId was given'
        });
    }

    const result = getExercisesOnCategoryStatement.all(categoryId) as { id: number, name: string, categoryId: number }[];
    //const exercises = result.map(ex => ex.name); //keeps only the name, discards category id and id

    console.log(result);

    return res.status(200).json({
        'message': 'Successfuly retuned all exercises for category ' + categoryId,
        'data': result
    });
}

export const createNewExercise = (req: Request, res: Response) => {
    const { categoryId } = req.params;

    const { name } = req.body;

    if (!categoryId || !name) {
        return res.status(400).json({
            'error': 'Could not create new exercise, categoryId or name missing'
        });
    }

    const result = createNewExerciseStmt.run(name, categoryId);

    return res.status(201).json({
        'exercise': {
            id: result.lastInsertRowid,
            name,
            categoryId
        },
        'message': 'Succesfully created new exericse: ' + name
    });
}