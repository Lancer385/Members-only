import { Router } from "express";
import { indexGet, signupGet, signupPost } from "../controllers/indexController.js";

const router = Router();



router.get("/", indexGet);
router.get("/sign-up",signupGet);

router.post("/sign-up", signupPost);

export default router;