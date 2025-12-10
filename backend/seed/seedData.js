import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import { Court } from "../models/Court.js";
import { Equipment } from "../models/Equipment.js";
import { Coach } from "../models/Coach.js";
import { PricingRule } from "../models/PricingRule.js";
import { User } from "../models/User.js";

dotenv.config();
await connectDB();

const seed = async () => {
  try {
    await Court.deleteMany();
    await Equipment.deleteMany();
    await Coach.deleteMany();
    await PricingRule.deleteMany();
    await User.deleteMany();

    const courts = await Court.insertMany([
      { name: "Court 1", type: "indoor", basePricePerHour: 15 },
      { name: "Court 2", type: "indoor", basePricePerHour: 15 },
      { name: "Court 3", type: "outdoor", basePricePerHour: 10 },
      { name: "Court 4", type: "outdoor", basePricePerHour: 10 }
    ]);

    const equipment = await Equipment.insertMany([
      { name: "Yonex Racket", type: "racket", totalQuantity: 20, pricePerUnit: 3 },
      { name: "Non-marking Shoes", type: "shoes", totalQuantity: 15, pricePerUnit: 4 }
    ]);

    const coaches = await Coach.insertMany([
      {
        name: "Coach John",
        hourlyRate: 25,
        availability: [{ dayOfWeek: 1, startHour: 16, endHour: 21 }]
      },
      {
        name: "Coach Sara",
        hourlyRate: 25,
        availability: [{ dayOfWeek: 2, startHour: 16, endHour: 21 }]
      },
      {
        name: "Coach Lee",
        hourlyRate: 25,
        availability: [{ dayOfWeek: 3, startHour: 16, endHour: 21 }]
      }
    ]);

    const rules = await PricingRule.insertMany([
      {
        name: "Weekend Surcharge",
        type: "weekend",
        config: { daysOfWeek: [0, 6], surcharge: 5 }
      },
      {
        name: "Peak Hours",
        type: "peak_hour",
        config: { startHour: 18, endHour: 21, multiplier: 1.5 }
      },
      {
        name: "Indoor Premium",
        type: "indoor_premium",
        config: { surcharge: 3 }
      }
    ]);

    const admin = await User.create({
      name: "Admin",
      email: "admin@example.com",
      password: "password",
      role: "admin"
    });

    console.log("Seed data created");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
