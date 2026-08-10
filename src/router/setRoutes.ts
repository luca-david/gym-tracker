import { Router, type Request, type Response } from 'express';
import db from "../db.js";
import type { SetInput } from '../types/workout.js';
import { updateSet } from '../controllers/setController.js';

const router = Router();

router.patch('/:id', updateSet);


export default router;