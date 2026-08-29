import type { Request, Response } from "express";
import db from "../db.js";

const insertSetStatement = db.prepare(`
    INSERT INTO sets (exercise_id, reps, weight, note, workout_id) VALUES (?, ?, ?, ?, ?)    
`);

const updateSetStatement = db.prepare(`
    UPDATE sets SET reps = COALESCE(?, reps), weight = COALESCE(?, weight), note = COALESCE(?, note) where id = ?
`); //coalesce - returns a copy of the first non null argument, returns null if not provided

const deleteSet = db.prepare(`
    DELETE FROM sets WHERE id = ?    
`)

//post the weight, reps and comments(optional) based on the current exercise
export const logSet = (req: Request, res: Response) => {
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
        const getWorkoutStatusStatement = db.prepare(`
            SELECT status FROM workouts where id = ?    
        `);

        const workoutData = getWorkoutStatusStatement.get(workoutId) as { status: string } | undefined;

        //if the given workoutId is finished, do not allow logging for it
        if (workoutData?.status === 'finished') {
            return res.status(401).json({
                'error': 'Cannot log a new set in a finished workout. Please start a new one'
            });
        }
    
        const result = insertSetStatement.run(exerciseId, reps, weight, note ?? null, workoutId); // since note is optional field we might store it as null

        return res.status(200).json({
            message: 'Set logged successfully',
            setId: Number(result.lastInsertRowid)
        });
        
    } catch (error) {
        return res.status(400).json({
            error: 'Error while posting the data to the db'
        });
    }
}

export const updateSet = (req: Request, res: Response) => {
    const setId = req.params.id;

    const { weight, reps, note } = req.body;

    console.log('Values for update -> weight: ' + weight + ' | reps : ' + reps + ' | note: ' + note);

    if (!weight && !reps && !note) {
        return res.status(400).json({
            'error': 'No update values given for weight nor reps'
        });
    }

    const result = updateSetStatement.run(reps, weight, note, setId);

    return res.status(200).json({
        'message': 'Succesfully updated set ' + setId + ' with ' + result.changes
    });

    
}