import mongoose from "mongoose";

const courtSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["indoor", "outdoor"], required: true },
    isActive: { type: Boolean, default: true },
    basePricePerHour: { type: Number, default: 10 }
  },
  { timestamps: true }
);

export const Court = mongoose.model("Court", courtSchema);
