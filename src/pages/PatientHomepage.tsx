import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, MessageSquare, Stethoscope, Heart } from "lucide-react";
import { motion } from "framer-motion";
import homepageImage from "../assets/homepageimage.jpg";
import api from "../api/axiosInstance";

interface Appointment {
  id: number;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: string;
  notes?: string;
  location?: string;
  image?: string;
}

interface Doctor {
  name: string;
  specialty: string;
  rating: number;
  image: string;
}

const PatientHome: React.FC = () => {
  const [userName, setUserName] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [recommendedDoctors, setRecommendedDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomePage = async () => {
      try {
        setLoading(true);
        const name = JSON.parse(localStorage.getItem('user'))
        setUserName(name.name)

        const token = localStorage.getItem("token");
        console.log("vvvv", token)
        const response = await api.get("homepage", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("kkkk")

        const appointmentList: any[] = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];

        console.log("hdhdhdh", appointmentList)
        // Format appointments
        const formattedAppointments: Appointment[] = appointmentList.map((a: any) => ({
          id: a.id,
          doctorName: a.doctor_name,
          specialty: a.specialty || "General Physician",
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
          location: a.location || "Online",
          image: a.image || "https://i.pravatar.cc/150?img=5",
        }));

        setAppointments(formattedAppointments);

        // Generate recommended doctors dynamically
        const doctorsSet = new Set<string>();
        const recommended: Doctor[] = [];
        formattedAppointments.forEach((appt) => {
          if (!doctorsSet.has(appt.doctorName)) {
            doctorsSet.add(appt.doctorName);
            recommended.push({
              name: appt.doctorName,
              specialty: appt.specialty,
              rating: Math.round((Math.random() * 1 + 4) * 10) / 10,
              image: appt.image,
            });
          }
        });
        setRecommendedDoctors(recommended);
      } catch (err) {
        console.error("Error fetching homepage data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomePage();
  }, []);

  // Dynamic stats
  const stats = {
    upcomingAppointments: appointments.filter((a) => a.status === "upcoming").length,
    consultations: appointments.length,
    doctors: new Set(appointments.map((a) => a.doctorName)).size,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-x-hidden relative p-6 md:p-12">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-4 md:px-20 py-24 relative z-10">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
            Welcome Back, <span className="text-blue-600">{userName}</span> 👋
          </h1>
          <p className="text-lg text-gray-600 max-w-lg">
            Manage your health efficiently. Book top doctors, chat instantly, and track all your health data.
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            <Link
              to="/book-appointment"
              className="bg-blue-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-2xl hover:bg-blue-700 transition transform hover:-translate-y-1"
            >
              Book Appointment
            </Link>
            <Link
              to="/chat"
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-xl hover:bg-blue-50 transition transform hover:-translate-y-1"
            >
              Chat with Doctor
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <img
            src={homepageImage}
            alt="Patient Image"
            className="w-[400px] md:w-[500px] drop-shadow-2xl hover:scale-105 transition-transform"
          />
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-3 sm:grid-cols-2 gap-8 py-12 px-4">
        {[
          { title: "Appointments", value: stats.upcomingAppointments, icon: <Calendar className="w-8 h-8 text-blue-600" /> },
          { title: "Consultations", value: stats.consultations, icon: <MessageSquare className="w-8 h-8 text-green-500" /> },
          { title: "Doctors", value: stats.doctors, icon: <Stethoscope className="w-8 h-8 text-indigo-500" /> },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition flex flex-col items-center"
          >
            <div className="text-6xl mb-4">{item.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
            <p className="text-gray-800 text-3xl font-bold">{item.value}</p>
          </motion.div>
        ))}
      </section>

      {/* Upcoming Appointments */}
      <section className="max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Upcoming Appointments</h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {appointments.map((appt) => (
              <motion.div
                key={appt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition flex items-center gap-4"
              >
                <img
                  src={appt.image}
                  alt={appt.doctorName}
                  className="w-16 h-16 rounded-full border-2 border-blue-100"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{appt.doctorName}</h3>
                  <p className="text-gray-600">{appt.date} - {appt.time}</p>
                  <span className="inline-block mt-2 text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{appt.status}</span>
                  {appt.notes && <p className="text-gray-500 text-sm mt-1">{appt.notes}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Recommended Doctors */}
      <section className="max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Recommended Doctors</h2>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8">
          {recommendedDoctors.map((doc, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition"
            >
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={doc.image}
                  alt={doc.name}
                  className="w-16 h-16 rounded-full border-2 border-blue-100"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">{doc.name}</h4>
                  <p className="text-sm text-gray-500">{doc.specialty}</p>
                  <p className="text-yellow-500 font-medium">★ {doc.rating.toFixed(1)}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">Book Now</button>
                <button className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition">View Profile</button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Daily Health Tip */}
      <section className="max-w-6xl mx-auto py-12 px-4">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl shadow-lg p-10 flex flex-col md:flex-row justify-between items-center">
          <div className="md:w-2/3 mb-6 md:mb-0">
            <h3 className="text-3xl font-bold mb-3">Daily Health Tip 💡</h3>
            <p className="text-lg opacity-90">
              Drink at least 8 glasses of water a day, get 7+ hours of sleep, and take short walks to keep your heart healthy!
            </p>
          </div>
          <Heart className="w-20 h-20 text-white/90 animate-pulse" />
        </div>
      </section>

      <footer className="text-center text-gray-500 mt-12">
        © {new Date().getFullYear()} DocConnect — Your Personal Health Assistant.
      </footer>
    </div>
  );
};

export default PatientHome;
