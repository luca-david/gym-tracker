import { Router, type Request, type Response } from 'express';
import db from '../db.js';
import type { WorkoutInput } from '../types/workout.js';
import { deleteWorkoutById, endWorkout, startNewWorkout } from '../controllers/workoutController.js';
import { logSet } from '../controllers/setController.js';

const router = Router(); //mini-router - redirects back to index.ts

router.post('/', startNewWorkout);
router.post('/:id/sets', logSet);//take workoutId and log a set
router.patch('/end/:id', endWorkout);
router.delete('/delete/:id', deleteWorkoutById);

export default router; //export router so index.ts can use it