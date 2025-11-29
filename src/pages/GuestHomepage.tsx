import React from "react";
import { Link } from "react-router-dom";

const HomeGuest: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#EEF6FF] via-white to-[#F3F4FF] overflow-hidden">

      {/* Background decorative gradients */}
      <div className="absolute -top-40 left-10 w-[35rem] h-[35rem] bg-blue-300/25 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 right-0 w-[38rem] h-[38rem] bg-indigo-300/25 rounded-full blur-3xl"></div>

      {/* HERO SECTION */}
      <section className="px-10 md:px-20 pt-16 pb-28 relative z-10 flex flex-col md:flex-row items-center justify-between">

        {/* Left Text */}
        <div className="md:w-1/2 space-y-7">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-gray-900">
            Smarter Healthcare  
            <span className="block text-blue-600">For Everyone</span>
          </h1>

          <p className="text-lg text-gray-600 max-w-md leading-relaxed">
            Experience next-generation doctor discovery, AI-powered guidance, and seamless appointment booking — all in one beautiful platform.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/login"
              className="bg-blue-600 text-white px-8 py-3 rounded-xl text-lg shadow-xl hover:shadow-2xl hover:bg-blue-700 transition-transform hover:-translate-y-1"
            >
              Get Started
            </Link>

            <Link
              to="/register"
              className="border-2 border-blue-600 text-blue-700 px-8 py-3 rounded-xl text-lg hover:bg-blue-50 transition-transform hover:-translate-y-1"
            >
              Join Now
            </Link>
          </div>
        </div>

        {/* Doctor Illustration */}
        <div className="md:w-1/2 flex justify-center mt-12 md:mt-0 relative">
          <div className="absolute w-[420px] h-[420px] bg-gradient-to-br from-white/70 to-white/30 rounded-full blur-2xl shadow-2xl"></div>

          <div className="p-4 bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl transition relative z-10">
            <img
              src="https://cdn.dribbble.com/users/32512/screenshots/17066933/media/98a47de9f936d4d8b1e7847fef90bb2b.png"
              alt="Doctor Illustration"
              className="w-[430px] md:w-[470px] rounded-2xl hover:scale-105 transition-transform"
            />
          </div>
        </div>
      </section>

      {/* FEATURES — Premium Glass Cards */}
      <section className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10 px-10 md:px-20 pb-24">
        {[
          {
            title: "Instant Consultations",
            desc: "Connect with certified doctors via video or chat within minutes.",
            icon: "🩺",
          },
          {
            title: "AI Health Assistant",
            desc: "Smart triage system that guides you to the right specialist instantly.",
            icon: "🤖",
          },
          {
            title: "Smart Booking",
            desc: "Real-time available slots and smooth appointment scheduling.",
            icon: "⚡",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-white/70 backdrop-blur-xl p-10 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition transform"
          >
            <div className="text-6xl mb-4">{item.icon}</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">{item.title}</h3>
            <p className="text-gray-600 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* STATISTICS SECTION */}
      <section className="py-24 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-10 md:px-20 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {[
            { value: "10K+", label: "Patients Served" },
            { value: "1.2K+", label: "Doctors Onboard" },
            { value: "5⭐", label: "User Satisfaction" },
          ].map((stat) => (
            <div key={stat.label}>
              <h2 className="text-5xl font-bold text-blue-600">{stat.value}</h2>
              <p className="text-gray-700 text-lg">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* POPULAR SPECIALITIES */}
      <section className="px-10 md:px-20 py-24">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Popular Specialties
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            "General Physician",
            "Dermatologist",
            "Gynecologist",
            "Pediatrician",
            "Cardiologist",
            "Orthopedic",
            "Dentist",
            "Neurologist",
          ].map((spec) => (
            <div
              key={spec}
              className="bg-white/80 backdrop-blur-lg border border-gray-200 shadow-lg rounded-xl p-5 text-center hover:shadow-2xl hover:-translate-y-1 transition"
            >
              <p className="text-gray-700 font-medium">{spec}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-gradient-to-br from-white to-blue-50">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-14">
          Loved By Thousands
        </h2>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 px-10 md:px-20">
          {[
            {
              name: "Aarav Sharma",
              quote:
                "Booking a doctor is now smoother than ever. I love the clean UI and accurate AI suggestions!",
            },
            {
              name: "Dr. Meera Kapoor",
              quote:
                "This platform helps me manage appointments effortlessly. Patients reach me faster.",
            },
          ].map((t) => (
            <div
              key={t.name}
              className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl hover:shadow-2xl transition"
            >
              <p className="text-gray-700 italic mb-4">“{t.quote}”</p>
              <h4 className="text-gray-900 font-semibold text-lg">— {t.name}</h4>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center py-10 text-gray-500">
        © {new Date().getFullYear()} <b>DocConnect</b> — Premium Healthcare Experience.
      </footer>
    </div>
  );
};

export default HomeGuest;
