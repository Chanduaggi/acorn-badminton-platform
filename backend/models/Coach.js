import mongoose from "mongoose";

const availabilitySlotSchema = new mongoose.Schema({
  dayOfWeek: { type: Number, min: 0, max: 6 }, // 0 Sunday
  startHour: Number, // 24h
  endHour: Number
}, { _id: false });

const coachSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    hourlyRate: { type: Number, default: 20 },
    isActive: { type: Boolean, default: true },
    availability: [availabilitySlotSchema]
  },
  { timestamps: true }
);

export const Coach = mongoose.model("Coach", coachSchema);
