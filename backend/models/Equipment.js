import mongoose from "mongoose";

const equipmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["racket", "shoes"], required: true },
    totalQuantity: { type: Number, required: true },
    pricePerUnit: { type: Number, default: 5 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Equipment = mongoose.model("Equipment", equipmentSchema);
