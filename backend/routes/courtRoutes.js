import express from "express";
import { getCourts, createCourt } from "../controllers/courtController.js";

const router = express.Router();

router.get("/", getCourts);
router.post("/", createCourt);

export default router;
