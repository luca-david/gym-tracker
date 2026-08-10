import { Router, type Request, type Response } from "express";
import db from "../db.js";
import { createNewCategory, getAllCategories } from "../controllers/categoryController.js";

const router = Router();

router.get('/', getAllCategories);
router.post('/', createNewCategory);

export default router;