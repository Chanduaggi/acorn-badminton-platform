import { Equipment } from "../models/Equipment.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const getEquipment = asyncHandler(async (req, res) => {
  const items = await Equipment.find();
  res.json(items);
});

export const createEquipment = asyncHandler(async (req, res) => {
  const item = await Equipment.create(req.body);
  res.status(201).json(item);
});
