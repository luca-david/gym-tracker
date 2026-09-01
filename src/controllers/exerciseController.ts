import type { Request, Response } from 'express';
import sql from '../db.js';

export const getExercisesOnCategory = async (req: Request, res: Response) => {
    const { categoryId } = req.params;

    if (!categoryId) {
        return res.status(400).json({
            'error': 'No categoryId was given'
        });
    }

    try {
        const result = await sql`
            SELECT id, name, category_id FROM exercises
            WHERE category_id = ${categoryId}::integer
            ORDER BY id
        ` as { id: number, name: string, category_id: number }[];

        console.log(result);

        return res.status(200).json({
            'message': 'Successfuly retuned all exercises for category ' + categoryId,
            'data': result
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            'error': 'Error while reading the exercises for category ' + categoryId
        });
    }
}

export const createNewExercise = async (req: Request, res: Response) => {
    const { categoryId } = req.params;

    const { name } = req.body;

    if (!categoryId || !name) {
        return res.status(400).json({
            'error': 'Could not create new exercise, categoryId or name missing'
        });
    }

    try {
        const rows = await sql`
            INSERT INTO exercises (name, category_id)
            VALUES (${name}, ${categoryId}::integer)
            ON CONFLICT DO NOTHING
            RETURNING id
        ` as { id: number }[];

        return res.status(201).json({
            'exercise': {
                id: rows[0]?.id,
                name,
                categoryId
            },
            'message': 'Succesfully created new exericse: ' + name
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            'error': 'Could not create the exercise ' + name
        });
    }
}
