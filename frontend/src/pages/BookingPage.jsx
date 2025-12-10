import React, { useEffect, useState } from "react";
import { fetchCourts, fetchEquipment, fetchCoaches, createBooking } from "../services/api";
import SlotSelector from "../components/SlotSelector";
import PriceBreakdown from "../components/PriceBreakdown";

const BookingPage = () => {
  const [courts, setCourts] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [coaches, setCoaches] = useState([]);

  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [selectedHour, setSelectedHour] = useState(18);
  const [selectedCourt, setSelectedCourt] = useState("");
  const [selectedCoach, setSelectedCoach] = useState("");
  const [equipmentSelection, setEquipmentSelection] = useState({});
  const [priceBreakdown, setPriceBreakdown] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      const [cRes, eRes, coRes] = await Promise.all([
        fetchCourts(),
        fetchEquipment(),
        fetchCoaches(),
      ]);
      setCourts(cRes.data);
      setEquipment(eRes.data);
      setCoaches(coRes.data);
    };
    load();
  }, []);

  const buildDate = (d, hour) => {
    const dt = new Date(d);
    dt.setHours(hour, 0, 0, 0);
    return dt.toISOString();
  };

  const handleEquipmentChange = (id, qty) => {
    setEquipmentSelection((prev) => ({ ...prev, [id]: qty }));
  };

  const estimatePriceLocally = () => {
    const court = courts.find((c) => c._id === selectedCourt);
    if (!court) return;

    const startTime = new Date(buildDate(date, selectedHour));
    const endTime = new Date(buildDate(date, selectedHour + 1));
    const durationHours = 1;
    let baseCourtPrice = (court.basePricePerHour || 10) * durationHours;

    const hour = startTime.getHours();
    const day = startTime.getDay();
    let weekendFee = day === 0 || day === 6 ? 5 : 0;
    let peakHourFee =
      hour >= 18 && hour < 21 ? baseCourtPrice * (1.5 - 1) : 0;
    let indoorPremiumFee = court.type === "indoor" ? 3 : 0;

    let equipmentFee = 0;
    equipment.forEach((eq) => {
      const qty = Number(equipmentSelection[eq._id] || 0);
      equipmentFee += qty * (eq.pricePerUnit || 0) * durationHours;
    });

    let coachFee = 0;
    if (selectedCoach) {
      const coach = coaches.find((c) => c._id === selectedCoach);
      coachFee = (coach?.hourlyRate || 20) * durationHours;
    }

    const total =
      baseCourtPrice +
      weekendFee +
      peakHourFee +
      indoorPremiumFee +
      equipmentFee +
      coachFee;

    setPriceBreakdown({
      baseCourtPrice,
      weekendFee,
      peakHourFee,
      indoorPremiumFee,
      equipmentFee,
      coachFee,
      total,
    });
  };

  useEffect(() => {
    if (selectedCourt) {
      estimatePriceLocally();
    }
  }, [selectedCourt, selectedCoach, equipmentSelection, date, selectedHour]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Please select a court.");
    try {
      const payload = {
        courtId: selectedCourt,
        coachId: selectedCoach || null,
        equipment: Object.entries(equipmentSelection)
          .filter(([_, qty]) => Number(qty) > 0)
          .map(([id, qty]) => ({
            equipmentId: id,
            quantity: Number(qty),
          })),
        startTime: buildDate(date, selectedHour),
        endTime: buildDate(date, selectedHour + 1),
        userId: "6939327e3b3dc91f7c68d510", // sample for assignment
      };
      const res = await createBooking(payload);
      setMessage("Booking confirmed! ID: " + res.data._id);
    } catch (err) {
      setMessage(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-4">Book a Badminton Court</h1>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-6 items-start"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Date
            </label>
            <input
              type="date"
              className="border rounded px-3 py-2 w-full"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Time Slot
            </label>
            <SlotSelector
              selectedHour={selectedHour}
              onSelect={setSelectedHour}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Court
            </label>
            <select
              className="border rounded px-3 py-2 w-full"
              value={selectedCourt ||  ""} 
              onChange={(e) => setSelectedCourt(e.target.value)}
            >
              <option value="">Select a court</option>
              {courts.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} ({c.type}) - ${c.basePricePerHour}/hr
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Coach (optional)
            </label>
            <select
              className="border rounded px-3 py-2 w-full"
              value={selectedCoach}
              onChange={(e) => setSelectedCoach(e.target.value)}
            >
              <option value="">No coach</option>
              {coaches.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} - ${c.hourlyRate}/hr
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold mb-2">Equipment</h3>
            <div className="space-y-2 text-sm">
              {equipment.map((eq) => (
                <div
                  key={eq._id}
                  className="flex items-center justify-between gap-2"
                >
                  <div>
                    <div className="font-medium">{eq.name}</div>
                    <div className="text-xs text-gray-500">
                      ${eq.pricePerUnit}/unit
                    </div>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max={eq.totalQuantity}
                    className="border rounded px-2 py-1 w-20 text-right"
                    value={equipmentSelection[eq._id] || ""}
                    onChange={(e) =>
                      handleEquipmentChange(eq._id, e.target.value)
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          <PriceBreakdown breakdown={priceBreakdown} />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Confirm Booking
          </button>
          {message && (
            <div className="text-sm mt-2 text-indigo-700 font-medium">
              {message}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default BookingPage;
