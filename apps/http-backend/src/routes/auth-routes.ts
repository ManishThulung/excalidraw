import express from "express";
import { logout, signin, signup } from "../controllers/auth-controller";

const router = express.Router();

router.post("/sign-up", signup);
router.post("/sign-in", signin);
router.post("/logout", logout);

export default router;
