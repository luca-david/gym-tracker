import type { Request, Response } from "express";
import sql from "../db.js";

//post the weight, reps and comments(optional) based on the current exercise
export const logSet = async (req: Request, res: Response) => {
    const workoutId = req.params.id;


    const { reps, weight, note, exerciseId } = req.body;

    try {
        console.log('reps: ' + reps);
        console.log('weight: ' + weight);
        console.log('note: ' + note);
        console.log('exercise id: ' + exerciseId);
        console.log('workoutId: ' + workoutId + '\n-------------\n');

        if (!reps || !weight) {
            return res.status(400).json({
                error: 'Reps and weight are required'
            });
        }

        //get the status for the workoutId
        const workoutRows = await sql`
            SELECT status FROM workouts WHERE id = ${workoutId}::integer
        ` as { status: string }[];

        const workoutData = workoutRows[0];

        //if the given workoutId is finished, do not allow logging for it
        if (workoutData?.status === 'finished') {
            return res.status(401).json({
                'error': 'Cannot log a new set in a finished workout. Please start a new one'
            });
        }

        const rows = await sql`
            INSERT INTO sets (exercise_id, reps, weight, note, workout_id)
            VALUES (${exerciseId}, ${reps}, ${weight}, ${note ?? null}, ${workoutId}::integer)
            RETURNING id
        ` as { id: number }[]; // since note is optional field we might store it as null

        return res.status(200).json({
            message: 'Set logged successfully',
            setId: rows[0]?.id
        });

    } catch (error) {
        console.error(error);
        return res.status(400).json({
            error: 'Error while posting the data to the db'
        });
    }
}

export const updateSet = async (req: Request, res: Response) => {
    const setId = req.params.id;

    const { weight, reps, note } = req.body;

    console.log('Values for update -> weight: ' + weight + ' | reps : ' + reps + ' | note: ' + note);

    if (!weight && !reps && !note) {
        return res.status(400).json({
            'error': 'No update values given for weight nor reps'
        });
    }

    try {
        //coalesce - returns the first non null argument, so a field that was left out keeps its
        //current value; the ::integer / ::text casts tell Postgres what a null parameter is
        const rows = await sql`
            UPDATE sets
            SET reps = COALESCE(${reps ?? null}::integer, reps),
                weight = COALESCE(${weight ?? null}::integer, weight),
                note = COALESCE(${note ?? null}::text, note)
            WHERE id = ${setId}::integer
            RETURNING id
        ` as { id: number }[];

        return res.status(200).json({
            'message': 'Succesfully updated set ' + setId + ' with ' + rows.length
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            'error': 'Could not update set ' + setId
        });
    }
}
