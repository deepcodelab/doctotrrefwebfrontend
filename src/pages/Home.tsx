// import React from "react";
// import { Link } from "react-router-dom";

// const Home: React.FC = () => {
//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-100">

//       {/* Hero Section */}
//       <section className="flex flex-col-reverse md:flex-row items-center justify-center flex-1 mt-20 px-6 md:px-16 py-10">
//         {/* Text */}
//         <div className="md:w-1/2 text-center md:text-left space-y-6">
//           <h2 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight">
//             Your Health, <span className="text-blue-600">Our Priority</span>
//           </h2>
//           <p className="text-gray-600 text-lg md:text-xl max-w-lg">
//             Book instant appointments, chat with certified doctors, and manage
//             your health online — anytime, anywhere.
//           </p>
//           <div className="space-x-4">
//             <Link
//               to="/doctors"
//               className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
//             >
//               Find a Doctor
//             </Link>
//             <Link
//               to="/consult"
//               className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-50 transition"
//             >
//               Consult Online
//             </Link>
//           </div>
//         </div>

//         {/* Image */}
//         <div className="md:w-1/2 mb-10 md:mb-0 flex justify-center">
//           <img
//             src="https://cdn.dribbble.com/users/32512/screenshots/17066933/media/98a47de9f936d4d8b1e7847fef90bb2b.png?compress=1&resize=800x600"
//             alt="Doctor illustration"
//             className="w-80 md:w-[500px] drop-shadow-2xl"
//           />
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-16 bg-white/60 backdrop-blur-lg">
//         <div className="max-w-6xl mx-auto px-6 text-center">
//           <h3 className="text-3xl font-bold text-gray-800 mb-10">
//             Why Choose <span className="text-blue-600">DocConnect?</span>
//           </h3>
//           <div className="grid md:grid-cols-3 gap-8">
//             {[
//               {
//                 title: "Instant Consultations",
//                 desc: "Chat or video call with certified doctors instantly.",
//                 icon: "💬",
//               },
//               {
//                 title: "Book Appointments",
//                 desc: "Schedule visits with top specialists at your convenience.",
//                 icon: "📅",
//               },
//               {
//                 title: "Digital Health Records",
//                 desc: "Securely store and access your prescriptions and reports online.",
//                 icon: "📁",
//               },
//             ].map((item) => (
//               <div
//                 key={item.title}
//                 className="bg-white rounded-2xl shadow-md hover:shadow-xl p-8 transition transform hover:-translate-y-1"
//               >
//                 <div className="text-5xl mb-4">{item.icon}</div>
//                 <h4 className="text-xl font-semibold text-gray-800 mb-2">
//                   {item.title}
//                 </h4>
//                 <p className="text-gray-600">{item.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-4">
//         <p>
//           © {new Date().getFullYear()} <b>DocConnect</b> — Your Trusted Health Partner.
//         </p>
//       </footer>
//     </div>
//   );
// };

// export default Home;



import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContexts";
import HomePatient from "./PatientHomepage";
import HomeDoctor from "./DoctorHomepage";
import HomeGuest from "./GuestHomepage";

const Home: React.FC = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>;

  if (!user) return <HomeGuest />;

  if (user.role === "doctor") return <HomeDoctor />;

  if (user.role === "customer") return <HomePatient />;

  // fallback
  return <HomeGuest />;
};

export default Home;