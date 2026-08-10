import type { Request, Response } from 'express';
import db from '../db.js';

const getExercisesOnCategoryStatement = db.prepare(`
    SELECT * FROM exercises WHERE category_id = ?
`)

export const getExercisesOnCategory = (req: Request, res: Response) => {
    const { category_id } = req.params;

    if (!category_id) {
        return res.status(400).json({
            'error': 'No category_id was given'
        });
    }

    const result = getExercisesOnCategoryStatement.run(category_id);

    console.log(result);

    return res.status(200).json({
        'message': 'Successfuly retuned all exercises for category ' + category_id,
        'data': result
    });
}