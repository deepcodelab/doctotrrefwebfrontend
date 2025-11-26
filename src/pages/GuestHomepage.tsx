import React from "react";
import { Link } from "react-router-dom";

const HomeGuest: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100 overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-400/20 rounded-full blur-3xl"></div>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-10 md:px-20 py-28 relative z-10">
        <div className="md:w-1/2 space-y-8">
          <h1 className="text-6xl font-extrabold text-gray-800 leading-tight">
            Your Health, <span className="text-blue-600">Reimagined</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-lg">
            Book top doctors, chat instantly, and manage all your health needs from one secure dashboard.
          </p>
          <div className="space-x-4">
            <Link
              to="/login"
              className="bg-blue-600 text-white px-8 py-3 rounded-xl text-lg shadow-lg hover:shadow-2xl hover:bg-blue-700 transition-transform transform hover:-translate-y-1"
            >
              Get Started
            </Link>
            <Link
              to="/register"
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-xl text-lg hover:bg-blue-50 transition-transform transform hover:-translate-y-1"
            >
              Join Now
            </Link>
          </div>
        </div>

        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <img
            src="https://cdn.dribbble.com/users/32512/screenshots/17066933/media/98a47de9f936d4d8b1e7847fef90bb2b.png"
            alt="Doctor illustration"
            className="w-[450px] drop-shadow-2xl hover:scale-105 transition-transform"
          />
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 py-20 px-6">
        {[
          {
            title: "Instant Consultations",
            desc: "Video call or chat with certified doctors anytime.",
            icon: "💬",
          },
          {
            title: "Smart Appointment Booking",
            desc: "Find the right specialist and book in seconds.",
            icon: "⚡",
          },
          {
            title: "Digital Health Records",
            desc: "Keep your reports, prescriptions, and notes securely stored.",
            icon: "📁",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-white/70 backdrop-blur-md p-8 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition"
          >
            <div className="text-5xl mb-4">{item.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {item.title}
            </h3>
            <p className="text-gray-600">{item.desc}</p>
          </div>
        ))}
      </section>

      <footer className="text-center py-8 text-gray-500">
        © {new Date().getFullYear()} <b>DocConnect</b> — Built for better care.
      </footer>
    </div>
  );
};

export default HomeGuest;
