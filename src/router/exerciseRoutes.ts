import { Router } from "express";
import { getExercisesOnCategory } from "../controllers/exerciseController.js";

const router = Router();

router.get('/onCategory/:categoryId', getExercisesOnCategory);
export default router;