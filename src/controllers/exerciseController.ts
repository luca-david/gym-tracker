import type { Request, Response } from 'express';
import db from '../db.js';

const getExercisesOnCategoryStatement = db.prepare(`
    SELECT * FROM exercises WHERE category_id = ?
`);

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