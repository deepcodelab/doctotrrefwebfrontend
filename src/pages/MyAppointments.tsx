// MyAppointments.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import api from '../api/axiosInstance'
import { Calendar, Video, XCircle, CheckCircle2 } from "lucide-react";

type Status = "pending" | "upcoming" | "completed" | "cancelled";

interface Appointment {
  id: number;
  doctorName: string;
  specialty: string;
  date: string; // ISO date
  time: string; // "10:00 AM"
  status: Status;
  location?: string;
  image?: string;
  notes?: string;
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
};

const MyAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<Status | "all">("all");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Appointment | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token")
        const response = await api.get('appointments/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const appointmentList = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];

        console.log("kkkk", appointmentList)
        const formattedAppointments = appointmentList.map((a: any) => ({
  id: a.id,
  doctorName: a.doctor_name,
  specialty: a.specialty || "General Physician", // fallback if not provided
  date: a.appointment_date,
  time: a.appointment_time,
  status:
    a.status === "pending"
      ? "pending"
      : a.status === "confirmed"
      ? "upcoming"
      : a.status === "completed"
      ? "completed"
      : "cancelled",
  notes: a.notes,
  location: a.location || "Online", // optional fallback
  image: a.image || "https://i.pravatar.cc/150?img=5",
}));
        setAppointments(formattedAppointments);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const filtered = appointments.filter((a) => (filter === "all" ? true : a.status === filter));

  const openReschedule = (a: Appointment) => {
    setSelected(a);
    setModalOpen(true);
  };

  const handleCancel = async (id: number) => {
    // call API to cancel
    // await axios.post(`/api/appointments/${id}/cancel`, {...})
    setAppointments((prev) => prev.map((p) => (p.id === id ? { ...p, status: "cancelled" } : p)));
  };

  const handleReschedule = async (id: number, newDate: string, newTime: string) => {
    // call API to reschedule
    // await axios.post(`/api/appointments/${id}/reschedule`, { date: newDate, time: newTime })
    setAppointments((prev) => prev.map((p) => (p.id === id ? { ...p, date: newDate, time: newTime } : p)));
    setModalOpen(false);
    setSelected(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">My Appointments</h1>
            <p className="text-sm text-gray-500">Manage your bookings — join, reschedule or cancel.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* LEFT: summary & quick filters */}
          <aside className="md:col-span-1 space-y-6">
            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm text-gray-500 font-medium">Upcoming</h3>
              <p className="mt-2 text-2xl font-bold text-gray-800">
                {appointments.filter((a) => a.status === "upcoming").length}
              </p>
              <p className="text-xs text-gray-400 mt-1">appointments scheduled</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
              <h4 className="text-sm text-gray-500">Quick Filters</h4>
              <div className="mt-4 flex flex-col gap-3">
                {(["all", "pending", "upcoming", "completed", "cancelled"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`text-left px-4 py-2 w-full rounded-lg ${
                      filter === f ? "bg-blue-600 text-white" : "bg-white text-gray-700 border border-gray-100"
                    }`}
                  >
                    {f === "all" ? "All" : f[0].toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
              <h4 className="text-sm text-gray-500">Next Appointment</h4>
              {appointments.filter((a) => a.status === "upcoming").sort((x,y)=> new Date(x.date).getTime() - new Date(y.date).getTime())[0] ? (
                (() => {
                  const next = appointments.filter((a) => a.status === "upcoming").sort((x,y)=> new Date(x.date).getTime() - new Date(y.date).getTime())[0];
                  return (
                    <div className="mt-3">
                      <div className="flex items-center gap-3">
                        <img src={next.image} alt={next.doctorName} className="w-12 h-12 rounded-full object-cover border" />
                        <div>
                          <div className="text-sm font-medium text-gray-800">Dr. {next.doctorName}</div>
                          <div className="text-xs text-gray-500">{next.specialty}</div>
                        </div>
                      </div>
                      <div className="mt-3 text-sm text-gray-600">
                        <div>{formatDate(next.date)}</div>
                        <div className="font-medium text-gray-800 mt-1">{next.time}</div>
                        <div className="text-xs text-gray-400 mt-2">{next.location}</div>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="mt-3 text-sm text-gray-500">No upcoming appointments</div>
              )}
            </div>
          </aside>

          {/* RIGHT: appointment list */}
          <main className="md:col-span-2 space-y-6">
            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading appointments…</div>
            ) : filtered.length === 0 ? (
              <div className="bg-white p-8 rounded-xl text-center text-gray-600">No appointments found.</div>
            ) : (
              filtered.map((a) => (
                <article key={a.id} className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 flex gap-5 items-start">
                  <img
                    src={a.image || "https://i.pravatar.cc/150?img=5"}
                    alt={a.doctorName}
                    className="w-16 h-16 rounded-full object-cover border"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-800">Dr. {a.doctorName}</h3>
                        <div className="text-sm text-gray-500">{a.specialty}</div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm text-gray-500">{formatDate(a.date)}</div>
                        <div className="text-sm font-medium text-gray-800">{a.time}</div>
                        <div className="mt-2">
                          {a.status === "pending" && <span className="inline-block px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">Pending</span>}
                          {a.status === "upcoming" && <span className="inline-block px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">Upcoming</span>}
                          {a.status === "completed" && <span className="inline-block px-3 py-1 text-xs bg-green-50 text-green-700 rounded-full">Completed</span>}
                          {a.status === "cancelled" && <span className="inline-block px-3 py-1 text-xs bg-red-50 text-red-700 rounded-full">Cancelled</span>}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 text-sm text-gray-600">{a.notes}</div>

                    <div className="mt-4 flex items-center gap-3">
                      {a.status === "upcoming" && (
                        <>
                          <button
                            onClick={() => {
                              // Implement join call (open video session)
                              window.alert("Joining call... (wire up with meeting link)");
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-green-600 text-white text-sm hover:bg-green-700"
                          >
                            <Video size={16} /> Join
                          </button>

                          <button
                            onClick={() => openReschedule(a)}
                            className="px-4 py-2 rounded-md bg-white border border-gray-200 text-sm hover:bg-gray-50"
                          >
                            Reschedule
                          </button>

                          <button
                            onClick={() => handleCancel(a.id)}
                            className="px-3 py-2 rounded-md text-sm text-red-600 hover:text-red-800"
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {a.status === "completed" && (
                        <div className="text-sm text-gray-600">You visited this doctor on {formatDate(a.date)}.</div>
                      )}

                      {a.status === "cancelled" && (
                        <div className="text-sm text-gray-600">This appointment was cancelled.</div>
                      )}

                      <div className="ml-auto text-xs text-gray-400">{a.location}</div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </main>
        </div>
      </div>

      {/* Reschedule Modal */}
      {modalOpen && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-800">Reschedule Appointment</h3>
            <p className="text-sm text-gray-500 mt-1">Dr. {selected.doctorName} — {selected.specialty}</p>

            <div className="mt-4 grid grid-cols-1 gap-3">
              <label className="text-sm text-gray-600">New date</label>
              <input type="date" className="w-full p-2 border border-gray-200 rounded" />

              <label className="text-sm text-gray-600 mt-2">New time</label>
              <input type="time" className="w-full p-2 border border-gray-200 rounded" />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => { setModalOpen(false); setSelected(null); }} className="px-4 py-2 rounded bg-white border">Close</button>
              <button
                onClick={() => {
                  // Example: pass chosen date/time; currently use placeholder values
                  const newDate = new Date().toISOString();
                  const newTime = "10:00 AM";
                  handleReschedule(selected.id, newDate, newTime);
                }}
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
