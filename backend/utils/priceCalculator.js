import { PricingRule } from "../models/PricingRule.js";

export const calculatePrice = async ({ court, coach, equipmentItems, startTime, endTime }) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const durationHours = Math.max(1, (end - start) / (1000 * 60 * 60));

  const rules = await PricingRule.find({ isActive: true });

  let baseCourtPrice = court.basePricePerHour * durationHours;
  let weekendFee = 0;
  let peakHourFee = 0;
  let indoorPremiumFee = 0;

  const hour = start.getHours();
  const day = start.getDay(); // 0 Sunday

  rules.forEach(rule => {
    if (!rule.isActive) return;

    const { config } = rule;
    switch (rule.type) {
      case "weekend":
        if (config.daysOfWeek?.includes(day)) {
          weekendFee += config.surcharge || 0;
        }
        break;
      case "peak_hour":
        if (hour >= (config.startHour ?? 18) && hour < (config.endHour ?? 21)) {
          const multiplier = config.multiplier || 1.5;
          const extra = baseCourtPrice * (multiplier - 1);
          peakHourFee += extra;
        }
        break;
      case "indoor_premium":
        if (court.type === "indoor") {
          indoorPremiumFee += config.surcharge || 0;
        }
        break;
      case "flat_surcharge":
        weekendFee += config.surcharge || 0;
        break;
      default:
        break;
    }
  });

  let equipmentFee = 0;
  if (equipmentItems && equipmentItems.length) {
    equipmentItems.forEach(item => {
      equipmentFee += (item.pricePerUnit || 0) * (item.quantity || 1) * durationHours;
    });
  }

  let coachFee = 0;
  if (coach) {
    coachFee = (coach.hourlyRate || 0) * durationHours;
  }

  const total = baseCourtPrice + weekendFee + peakHourFee + indoorPremiumFee + equipmentFee + coachFee;

  return {
    baseCourtPrice,
    weekendFee,
    peakHourFee,
    indoorPremiumFee,
    equipmentFee,
    coachFee,
    total
  };
};
