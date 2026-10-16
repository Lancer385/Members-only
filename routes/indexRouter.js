import { Router } from "express";
import {
  indexGet,
  logoutGet,
  signupGet,
  signupPost,
} from "../controllers/indexController.js";

const router = Router();

router.get("/", indexGet);
router.get("/sign-up", signupGet);

router.post("/sign-up", signupPost);

router.get("/log-out", logoutGet);
export default router;
