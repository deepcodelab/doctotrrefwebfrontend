import React, { useEffect, useState } from "react";
import { Calendar, DollarSign, Users, Star } from "lucide-react";

const DoctorHome: React.FC = () => {
  const [doctorName, setDoctorName] = useState("Dr. Shubham");
  const [appointments, setAppointments] = useState(8);
  const [patients, setPatients] = useState(25);
  const [earnings, setEarnings] = useState(14500);
  const [rating, setRating] = useState(4.8);

  useEffect(() => {
    // In a real app, fetch doctor details + dashboard stats here
    // Example: axios.get("/api/doctor/dashboard")
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 p-8">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            Welcome back, <span className="text-blue-600">{doctorName}</span> 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Here’s an overview of your clinic today.
          </p>
        </div>
        <button className="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:bg-blue-700 transition">
          + Add Appointment
        </button>
      </header>

      {/* Stats Section */}
      <section className="grid md:grid-cols-4 sm:grid-cols-2 gap-6 mb-12">
        {[
          {
            title: "Appointments Today",
            value: appointments,
            icon: <Calendar className="w-8 h-8 text-blue-600" />,
          },
          {
            title: "Total Patients",
            value: patients,
            icon: <Users className="w-8 h-8 text-green-500" />,
          },
          {
            title: "Earnings (₹)",
            value: earnings.toLocaleString(),
            icon: <DollarSign className="w-8 h-8 text-yellow-500" />,
          },
          {
            title: "Rating",
            value: `${rating}★`,
            icon: <Star className="w-8 h-8 text-orange-400" />,
          },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white rounded-xl shadow">{item.icon}</div>
              <div>
                <p className="text-sm text-gray-500">{item.title}</p>
                <h2 className="text-2xl font-semibold text-gray-800">
                  {item.value}
                </h2>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Today's Appointments */}
      <section className="bg-white/70 backdrop-blur-md p-8 rounded-3xl shadow-lg hover:shadow-2xl transition">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Today's Appointments
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-xl">
            <thead>
              <tr className="bg-blue-50 text-gray-700 text-left">
                <th className="px-6 py-3 font-medium">Patient</th>
                <th className="px-6 py-3 font-medium">Time</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Amit Sharma", time: "10:00 AM", type: "Consultation", status: "Confirmed" },
                { name: "Neha Patel", time: "11:30 AM", type: "Follow-up", status: "Pending" },
                { name: "Ravi Singh", time: "2:00 PM", type: "Check-up", status: "Completed" },
                { name: "Priya Nair", time: "3:45 PM", type: "Consultation", status: "Confirmed" },
              ].map((a, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-blue-50 transition cursor-pointer"
                >
                  <td className="px-6 py-3">{a.name}</td>
                  <td className="px-6 py-3">{a.time}</td>
                  <td className="px-6 py-3">{a.type}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        a.status === "Confirmed"
                          ? "bg-green-100 text-green-600"
                          : a.status === "Pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-500 mt-12">
        © {new Date().getFullYear()} DocConnect Pro — Empowering Healthcare.
      </footer>
    </div>
  );
};

export default DoctorHome;
