import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    court: { type: mongoose.Schema.Types.ObjectId, ref: "Court", required: true },
    coach: { type: mongoose.Schema.Types.ObjectId, ref: "Coach" },
    equipment: [
      {
        equipment: { type: mongoose.Schema.Types.ObjectId, ref: "Equipment" },
        quantity: { type: Number, default: 1 }
      }
    ],
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { 
      type: String, 
      enum: ["confirmed", "cancelled", "waitlist"], 
      default: "confirmed" 
    },
    pricingBreakdown: {
      baseCourtPrice: Number,
      weekendFee: Number,
      peakHourFee: Number,
      indoorPremiumFee: Number,
      equipmentFee: Number,
      coachFee: Number,
      total: Number
    }
  },
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);
