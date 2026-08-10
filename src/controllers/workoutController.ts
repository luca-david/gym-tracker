import type { Request, Response } from "express"
import db from "../db.js";

const deleteWorkoutByIdStatement = db.prepare(`
    DELETE FROM workouts WHERE id = ?
`);

const insertWorkoutStatement = db.prepare(`
    INSERT INTO workouts (user_id, date, status) VALUES (?, ?, ?)
`);

const endWorkoutStatement = db.prepare(`
    UPDATE workouts SET status = 'finished' WHERE id = ? 
`);

//POST new workout
export const startNewWorkout = (req: Request, res: Response) => {
    const {userId, date} = req.body;
    console.log('User Id: ' + userId + ' | date: ' + date);
    
    if (!userId || !date) {
        return res.status(400).json({
            'error': 'Invalid userId and/or date'
        });
    }

    insertWorkoutStatement.run(userId, date, 'in_progress');

    return res.status(201).json({
        'message': 'Succesfully created a new workout for user ' + userId + ' at ' + date
    });
    
}


//PATCH(end) workout
export const endWorkout = (req: Request, res: Response) => {
    const { id } = req.params;
    console.log('workoutId to be finshed: ' + id);

    if (!id) {
        return res.status(400).json({
            'error': 'Missing workout Id'
        });
    }

    endWorkoutStatement.run(id);

    return res.status(200).json({
        'message': 'Workout is finished'
    });
}

//DELETE workout on id
export const deleteWorkoutById = (req: Request, res: Response) => {
    const workoutIdToDelete = req.params;

    if (!workoutIdToDelete) {
        return res.status(400).json({
            'error': 'No id was given for delete operation'
        })
    }

    deleteWorkoutByIdStatement.run(workoutIdToDelete);

    return res.status(200).json({
        'message': 'Successfully deleted the workout with id ' + workoutIdToDelete
    });
}