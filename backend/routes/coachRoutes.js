import express from "express";
import { getCoaches, createCoach } from "../controllers/coachController.js";

const router = express.Router();

router.get("/", getCoaches);
router.post("/", createCoach);

export default router;
