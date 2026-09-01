import { Router } from 'express';
import { updateSet } from '../controllers/setController.js';

const router = Router();

router.patch('/:id', updateSet);


export default router;