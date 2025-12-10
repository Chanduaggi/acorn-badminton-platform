import express from "express";
import { getPricingRules, createPricingRule } from "../controllers/pricingRuleController.js";

const router = express.Router();

router.get("/", getPricingRules);
router.post("/", createPricingRule);

export default router;
