import mongoose from "mongoose";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { Booking } from "../models/Booking.js";
import { Court } from "../models/Court.js";
import { Coach } from "../models/Coach.js";
import { Equipment } from "../models/Equipment.js";
import { calculatePrice } from "../utils/priceCalculator.js";

const hasOverlap = (startA, endA, startB, endB) => {
  return startA < endB && endA > startB;
};

export const createBooking = asyncHandler(async (req, res) => {
  const { courtId, coachId, equipment, startTime, endTime } = req.body;
  const userId = req.user?._id || req.body.userId; // simple fallback

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const court = await Court.findById(courtId).session(session);
    if (!court || !court.isActive) {
      res.status(400);
      throw new Error("Court not available");
    }

    // check court availability
    const overlappingCourtBooking = await Booking.findOne({
      court: courtId,
      status: "confirmed",
      $or: [
        { startTime: { $lt: endTime, $gte: startTime } },
        { endTime: { $gt: startTime, $lte: endTime } },
        {
          $and: [
            { startTime: { $lte: startTime } },
            { endTime: { $gte: endTime } }
          ]
        }
      ]
    }).session(session);

    if (overlappingCourtBooking) {
      res.status(400);
      throw new Error("Court already booked for this slot");
    }

    let coachDoc = null;
    if (coachId) {
      coachDoc = await Coach.findById(coachId).session(session);
      if (!coachDoc || !coachDoc.isActive) {
        res.status(400);
        throw new Error("Coach not available");
      }

      const overlappingCoachBooking = await Booking.findOne({
        coach: coachId,
        status: "confirmed",
        $or: [
          { startTime: { $lt: endTime, $gte: startTime } },
          { endTime: { $gt: startTime, $lte: endTime } },
          {
            $and: [
              { startTime: { $lte: startTime } },
              { endTime: { $gte: endTime } }
            ]
          }
        ]
      }).session(session);

      if (overlappingCoachBooking) {
        res.status(400);
        throw new Error("Coach already booked for this slot");
      }
    }

    // equipment availability
    let equipmentDocs = [];
    if (equipment && equipment.length) {
      for (const item of equipment) {
        const eqDoc = await Equipment.findById(item.equipmentId).session(session);
        if (!eqDoc || !eqDoc.isActive) {
          res.status(400);
          throw new Error("Equipment not available");
        }

        const bookingsUsingThisEq = await Booking.find({
          status: "confirmed",
          "equipment.equipment": eqDoc._id,
          $or: [
            { startTime: { $lt: endTime, $gte: startTime } },
            { endTime: { $gt: startTime, $lte: endTime } },
            {
              $and: [
                { startTime: { $lte: startTime } },
                { endTime: { $gte: endTime } }
              ]
            }
          ]
        }).session(session);

        const alreadyBookedQty = bookingsUsingThisEq.reduce((sum, b) => {
          const match = b.equipment.find(e => e.equipment.toString() === eqDoc._id.toString());
          return sum + (match?.quantity || 0);
        }, 0);

        const requestedQty = item.quantity || 1;
        if (alreadyBookedQty + requestedQty > eqDoc.totalQuantity) {
          res.status(400);
          throw new Error(`Not enough ${eqDoc.name} available`);
        }

        equipmentDocs.push({
          doc: eqDoc,
          quantity: requestedQty
        });
      }
    }

    const priceBreakdown = await calculatePrice({
      court,
      coach: coachDoc,
      equipmentItems: equipmentDocs.map(e => ({
        pricePerUnit: e.doc.pricePerUnit,
        quantity: e.quantity
      })),
      startTime,
      endTime
    });

    const booking = await Booking.create(
      [
        {
          user: userId,
          court: court._id,
          coach: coachDoc?._id,
          equipment: equipmentDocs.map(e => ({
            equipment: e.doc._id,
            quantity: e.quantity
          })),
          startTime,
          endTime,
          status: "confirmed",
          pricingBreakdown: priceBreakdown
        }
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(booking[0]);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

export const getBookingsByUser = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.params.userId;
  const bookings = await Booking.find({ user: userId })
    .populate("court")
    .populate("coach")
    .populate("equipment.equipment")
    .sort({ startTime: -1 });
  res.json(bookings);
});

export const cancelBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  if (booking.status === "cancelled") {
    return res.json({ message: "Booking already cancelled" });
  }

  booking.status = "cancelled";
  await booking.save();

  res.json({ message: "Booking cancelled", booking });
};
