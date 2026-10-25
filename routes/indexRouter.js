import { Router } from "express";
import {
  indexGet,
  logoutGet,
  signupGet,
  signupPost,
} from "../controllers/indexController.js";
import { signupValidation } from "../middlewares/validatorMiddleware.js";

const router = Router();

router.get("/", indexGet);
router.get("/sign-up", signupGet);

router.post("/sign-up", signupValidation, signupPost);

router.get("/log-out", logoutGet);
export default router;
