import express from "express";
import { getEquipment, createEquipment } from "../controllers/equipmentController.js";

const router = express.Router();

router.get("/", getEquipment);
router.post("/", createEquipment);

export default router;
