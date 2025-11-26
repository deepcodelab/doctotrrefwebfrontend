import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { Calendar, MessageSquare, Stethoscope, Heart, Clock } from "lucide-react";

const PatientHome: React.FC = () => {
  const [userName, setUserName] = useState("Shubham");
  const [upcomingAppointments, setUpcomingAppointments] = useState(2);
  const [consultations, setConsultations] = useState(5);
  const [doctors, setDoctors] = useState(18);
  const navigate = useNavigate()


  useEffect(() => {
    // Example: axios.get("/api/patient/dashboard") to load stats
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-100 p-8">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            Hi <span className="text-blue-600">{userName}</span> 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Take control of your health. Here’s what’s coming up next.
          </p>
        </div>
        <Link to="/book-appointment" className="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:bg-blue-700 transition">
          + Book Appointment
        </Link>
      </header>

      {/* Stats Section */}
      <section className="grid md:grid-cols-3 sm:grid-cols-2 gap-6 mb-12">
        {[
          {
            title: "Upcoming Appointments",
            value: upcomingAppointments,
            icon: <Calendar className="w-8 h-8 text-blue-600" />,
          },
          {
            title: "Consultations Done",
            value: consultations,
            icon: <MessageSquare className="w-8 h-8 text-green-500" />,
          },
          {
            title: "Available Doctors",
            value: doctors,
            icon: <Stethoscope className="w-8 h-8 text-indigo-500" />,
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

      {/* Recommended Doctors */}
      <section className="bg-white/70 backdrop-blur-md p-8 rounded-3xl shadow-lg mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Recommended Doctors
        </h2>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8">
          {[
            {
              name: "Dr. Neha Verma",
              specialty: "Cardiologist",
              rating: 4.9,
              image:
                "https://cdn-icons-png.flaticon.com/512/387/387561.png",
            },
            {
              name: "Dr. Rahul Mehta",
              specialty: "Dermatologist",
              rating: 4.7,
              image:
                "https://cdn-icons-png.flaticon.com/512/2922/2922510.png",
            },
            {
              name: "Dr. Priya Sharma",
              specialty: "Neurologist",
              rating: 4.8,
              image:
                "https://cdn-icons-png.flaticon.com/512/2922/2922566.png",
            },
          ].map((doc) => (
            <div
              key={doc.name}
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
                  <p className="text-yellow-500 font-medium">
                    ★ {doc.rating.toFixed(1)}
                  </p>
                </div>
              </div>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                Book Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Health Tips Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl shadow-lg p-10 flex flex-col md:flex-row justify-between items-center">
        <div className="md:w-2/3 mb-6 md:mb-0">
          <h3 className="text-3xl font-bold mb-3">Daily Health Tip 💡</h3>
          <p className="text-lg opacity-90">
            Drink at least 8 glasses of water a day, get 7+ hours of sleep, and take short walks to keep your heart healthy!
          </p>
        </div>
        <Heart className="w-20 h-20 text-white/90 animate-pulse" />
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-500 mt-12">
        © {new Date().getFullYear()} DocConnect — Your Personal Health Assistant.
      </footer>
    </div>
  );
};

export default PatientHome;
