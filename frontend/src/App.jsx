import React, { useState } from "react";
import Navbar from "./components/Navbar";
import BookingPage from "./pages/BookingPage";
import AdminDashboard from "./pages/AdminDashboard";

const App = () => {
  const [view, setView] = useState("booking");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="bg-indigo-50 border-b border-indigo-100">
        <div className="max-w-5xl mx-auto px-4 py-2 flex gap-2 text-sm">
          <button
            onClick={() => setView("booking")}
            className={`px-3 py-1 rounded ${
              view === "booking"
                ? "bg-indigo-600 text-white"
                : "bg-white text-indigo-700"
            }`}
          >
            Booking
          </button>
          <button
            onClick={() => setView("admin")}
            className={`px-3 py-1 rounded ${
              view === "admin"
                ? "bg-indigo-600 text-white"
                : "bg-white text-indigo-700"
            }`}
          >
            Admin
          </button>
        </div>
      </div>
      <main className="flex-1">
        {view === "booking" ? <BookingPage /> : <AdminDashboard />}
      </main>
      <footer className="text-center text-xs py-4 text-gray-500">
        Acorn Globus • Badminton Court Booking Demo
      </footer>
    </div>
  );
};

export default App;
