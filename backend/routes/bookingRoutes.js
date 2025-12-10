import express from "express";
import { Booking } from "../models/Booking.js";
import { createBooking, getBookingsByUser } from "../controllers/bookingController.js";
import { cancelBooking } from "../controllers/bookingController.js";

const router = express.Router();

router.put("/:id/cancel", cancelBooking);

// ✅ TEST ROUTE (to confirm router works)
router.get("/ping", (req, res) => {
  res.json({ ok: true });
});

// ✅ CREATE booking
router.post("/", createBooking);

// ✅ GET bookings by user
router.get("/user/:userId", getBookingsByUser);

// ✅ GET ALL bookings (ADMIN)
router.get("/", async (req, res) => {
  const bookings = await Booking.find()
    .populate("court")
    .populate("coach")
    .populate("equipment.equipment")
    .populate("user", "email")
    .sort({ createdAt: -1 });

  res.json(bookings);
});

export default router;
