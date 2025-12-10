import React from "react";

const PriceBreakdown = ({ breakdown }) => {
  if (!breakdown) return null;
  const rows = [
    ["Base Court", breakdown.baseCourtPrice],
    ["Weekend", breakdown.weekendFee],
    ["Peak Hour", breakdown.peakHourFee],
    ["Indoor Premium", breakdown.indoorPremiumFee],
    ["Equipment", breakdown.equipmentFee],
    ["Coach", breakdown.coachFee],
  ];

  return (
    <div className="bg-white rounded-xl shadow p-4 mt-4">
      <h3 className="font-semibold mb-2">Price Breakdown</h3>
      <div className="space-y-1 text-sm">
        {rows.map(([label, value]) =>
          value ? (
            <div key={label} className="flex justify-between">
              <span>{label}</span>
              <span>${value.toFixed(2)}</span>
            </div>
          ) : null
        )}
        <div className="border-t mt-2 pt-2 flex justify-between font-semibold">
          <span>Total</span>
          <span>${breakdown.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default PriceBreakdown;
