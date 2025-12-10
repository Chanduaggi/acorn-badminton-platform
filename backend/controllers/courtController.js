import { Court } from "../models/Court.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const getCourts = asyncHandler(async (req, res) => {
  const courts = await Court.find();
  res.json(courts);
});

export const createCourt = asyncHandler(async (req, res) => {
  const court = await Court.create(req.body);
  res.status(201).json(court);
});
