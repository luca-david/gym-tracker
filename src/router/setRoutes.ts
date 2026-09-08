import { Router } from 'express';
import { getPreviousSetsForExercise, updateSet } from '../controllers/setController.js';

const router = Router();

router.patch('/:id', updateSet);
router.get('/history/exercise/:exerciseId', getPreviousSetsForExercise)


export default router;