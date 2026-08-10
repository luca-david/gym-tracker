import { Router } from "express";
import { getExercisesOnCategory } from "../controllers/exerciseController.js";

const router = Router();

router.get('/', getExercisesOnCategory);

export default router;