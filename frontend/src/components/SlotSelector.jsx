import React from "react";

const HOURS = Array.from({ length: 14 }).map((_, i) => 7 + i); // 7AM-20PM

const SlotSelector = ({ selectedHour, onSelect }) => {
  return (
    <div className="grid grid-cols-4 gap-2">
      {HOURS.map((h) => (
        <button
          key={h}
          type="button"
          onClick={() => onSelect(h)}
          className={`py-2 rounded border text-sm ${
            selectedHour === h
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-white hover:bg-indigo-50"
          }`}
        >
          {h}:00 - {h + 1}:00
        </button>
      ))}
    </div>
  );
};

export default SlotSelector;
