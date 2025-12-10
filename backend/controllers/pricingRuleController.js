import { PricingRule } from "../models/PricingRule.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const getPricingRules = asyncHandler(async (req, res) => {
  const rules = await PricingRule.find();
  res.json(rules);
});

export const createPricingRule = asyncHandler(async (req, res) => {
  const rule = await PricingRule.create(req.body);
  res.status(201).json(rule);
});
