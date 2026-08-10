import { Router } from "express";
import { createNewUser } from "../controllers/userController.js";


const router = Router()

router.post('/new', createNewUser);

export default router;