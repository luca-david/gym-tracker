import { Router } from "express";
import { createNewCategory, getAllCategories } from "../controllers/categoryController.js";

const router = Router();

router.get('/', getAllCategories);
router.post('/', createNewCategory);

export default router;