import { Router } from "express";
import { getExercisesOnCategory, createNewExercise } from "../controllers/exerciseController.js";

const router = Router();

router.get('/onCategory/:categoryId', getExercisesOnCategory);
router.post('/new/:categoryId', createNewExercise);

export default router;