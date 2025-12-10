import { Coach } from "../models/Coach.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const getCoaches = asyncHandler(async (req, res) => {
  const coaches = await Coach.find();
  res.json(coaches);
});

export const createCoach = asyncHandler(async (req, res) => {
  const coach = await Coach.create(req.body);
  res.status(201).json(coach);
});
