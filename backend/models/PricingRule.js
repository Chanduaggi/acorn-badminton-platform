import mongoose from "mongoose";

const pricingRuleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { 
      type: String, 
      enum: ["peak_hour", "weekend", "indoor_premium", "flat_surcharge"], 
      required: true 
    },
    isActive: { type: Boolean, default: true },
    // generic config to keep it flexible
    config: {
      startHour: Number,
      endHour: Number,
      daysOfWeek: [Number],
      multiplier: Number,
      surcharge: Number
    }
  },
  { timestamps: true }
);

export const PricingRule = mongoose.model("PricingRule", pricingRuleSchema);
