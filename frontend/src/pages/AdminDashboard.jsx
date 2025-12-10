import React, { useEffect, useState } from "react";
import axios from "axios";

const ADMIN_TOKEN = "PASTE_ADMIN_JWT_TOKEN_HERE";

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);

  const loadBookings = async () => {
    const res = await axios.get("/api/bookings");
    setBookings(res.data);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;

    try {
      await axios.put(
        `/api/bookings/${id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${ADMIN_TOKEN}`,
          },
        }
      );
      loadBookings();
    } catch (err) {
      alert("Cancel failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Bookings</h1>

      <table className="w-full text-sm border-collapse rounded-xl overflow-hidden">
  <thead className="bg-indigo-600 text-white">
    <tr>
      <th className="p-3 text-left">Court</th>
      <th className="p-3 text-left">User</th>
      <th className="p-3 text-left">Time</th>
      <th className="p-3 text-left">Total</th>
      <th className="p-3 text-left">Status</th>
    </tr>
  </thead>

  <tbody>
    {bookings.map((b, index) => (
      <tr
        key={b._id}
        className={`border-b ${
          index % 2 === 0 ? "bg-gray-50" : "bg-white"
        } hover:bg-indigo-50 transition`}
      >
        <td className="p-3 font-medium">{b.court?.name}</td>

        <td className="p-3 text-gray-600">{b.user?.email}</td>

        <td className="p-3 text-gray-700">
          {new Date(b.startTime).toLocaleString()}
        </td>

        <td className="p-3 font-semibold text-emerald-600">
          ${b.pricingBreakdown?.total}
        </td>

        <td className="p-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              b.status === "confirmed"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {b.status}
          </span>

          {b.status === "confirmed" && (
            <button
              onClick={() => handleCancel(b._id)}
              className="ml-3 text-xs text-red-600 hover:text-red-800 underline"
            >
              Cancel
            </button>
          )}
        </td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
};

export default AdminDashboard;
