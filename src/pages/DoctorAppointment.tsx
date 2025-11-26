// DoctorAppointments.tsx
import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { Loader2, CalendarDays, Clock, User, MessageSquare } from "lucide-react";

interface Appointment {
  id: number;
  patientName: string;
  date: string;
  time: string;
  status: string;
  notes?: string;
}

const DoctorAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await api.get("appointments/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const appointmentList =response.data.data

      const formattedAppointments = appointmentList.map((a: any) => ({
  id: a.id,
  patientName: a.customer_name,
  specialty: a.specialty || "General Physician", // fallback if not provided
  date: a.appointment_date,
  time: a.appointment_time,
  status:
    a.status === "pending"
      ? "pending"
      : a.status === "confirmed"
      ? "confirmed"
      : a.status === "completed"
      ? "completed"
      : "cancelled",
  notes: a.notes,
  location: a.location || "Online", // optional fallback
  image: a.image || "https://i.pravatar.cc/150?img=5",
}));
      setAppointments( formattedAppointments || []);
    } catch (error) {
      console.error("Error fetching doctor appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      const token = localStorage.getItem("token");
      await api.patch(
        `appointments/${id}/`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const filteredAppointments = appointments.filter((a) => {
    const matchesFilter = filter === "all" || a.status === filter;
    const matchesSearch = a.patientName.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* --- Aside Sidebar --- */}
      <aside className="w-72 bg-white shadow-md border-r p-6 space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Filters</h2>

        {/* Search */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Search Patient</label>
          <input
            type="text"
            placeholder="Enter patient name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">Appointment Status</label>
          <div className="space-y-2">
            {["all", "pending", "confirmed", "completed", "cancelled"].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <input
                  type="radio"
                  id={s}
                  value={s}
                  checked={filter === s}
                  onChange={(e) => setFilter(e.target.value)}
                  className="text-blue-500 focus:ring-blue-400"
                />
                <label htmlFor={s} className="capitalize text-gray-700 text-sm">
                  {s}
                </label>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Doctor Appointments</h1>
          <button
            onClick={fetchAppointments}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center text-gray-600 mt-20">
            <CalendarDays className="mx-auto mb-3 w-10 h-10 text-gray-400" />
            <p>No appointments found.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAppointments.map((a) => (
              <div
                key={a.id}
                className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-500" /> {a.patientName}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                      a.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : a.status === "confirmed"
                        ? "bg-blue-100 text-blue-700"
                        : a.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {a.status}
                  </span>
                </div>

                <div className="text-sm text-gray-600 space-y-1 mb-4">
                  <p className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-gray-500" /> {a.date}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" /> {a.time}
                  </p>
                  {a.notes && (
                    <p className="flex items-start gap-2 mt-1">
                      <MessageSquare className="w-4 h-4 text-gray-500 mt-0.5" />{" "}
                      {a.notes}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-2">
                  {a.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(a.id, "confirmed")}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-medium"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => updateStatus(a.id, "cancelled")}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {a.status === "confirmed" && (
                    <button
                      onClick={() => updateStatus(a.id, "completed")}
                      className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-medium"
                    >
                      Mark Completed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DoctorAppointments;
