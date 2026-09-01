import type { Request, Response } from "express"
import sql from "../db.js";

//POST new workout
export const startNewWorkout = async (req: Request, res: Response) => {
    const {userId, date} = req.body;
    console.log('User Id: ' + userId + ' | date: ' + date);

    if (!userId || !date) {
        return res.status(400).json({
            'error': 'Invalid userId and/or date'
        });
    }

    try {
        //Postgres has no lastInsertRowid, RETURNING hands back the generated id instead
        const rows = await sql`
            INSERT INTO workouts (user_id, date, status)
            VALUES (${userId}, ${date}, 'in_progress')
            RETURNING id
        ` as { id: number }[];

        const workoutId = rows[0]?.id;

        return res.status(201).json({
            workoutId,
            'message': 'Succesfully created a new workout for user ' + userId + ' at ' + date
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            'error': 'Could not create a new workout'
        });
    }
}


//PATCH(end) workout
export const endWorkout = async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log('workoutId to be finshed: ' + id);

    if (!id) {
        return res.status(400).json({
            'error': 'Missing workout Id'
        });
    }

    try {
        const rows = await sql`
            UPDATE workouts SET status = 'finished' WHERE id = ${id}::integer RETURNING id
        ` as { id: number }[];

        if (rows.length === 0) {
            return res.status(404).json({
                'error': 'No workout with id ' + id
            });
        }

        return res.status(200).json({
            'message': 'Workout is finished'
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            'error': 'Could not finish workout ' + id
        });
    }
}

//DELETE workout on id
export const deleteWorkoutById = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            'error': 'No id was given for delete operation'
        })
    }

    try {
        //the sets of this workout go with it, the foreign key is ON DELETE CASCADE
        await sql`DELETE FROM workouts WHERE id = ${id}::integer`;

        return res.status(200).json({
            'message': 'Successfully deleted the workout with id ' + id
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            'error': 'Could not delete the workout with id ' + id
        });
    }
}
