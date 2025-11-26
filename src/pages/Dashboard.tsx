import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  User,
  HeartPulse,
  Star,
  Stethoscope,
  MapPin,
  Phone,
  ClipboardList,
  Edit3,
  X,
  Save,
} from "lucide-react";

const Dashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("kkdkdk", token)
        const res = await axios.get("http://127.0.0.1:8000/api/profile/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
        setFormData(res.data.profile);
      } catch (err) {
        console.error("❌ Error fetching dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://127.0.0.1:8000/api/profile/update/${formData.id}/`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData((prev: any) => ({ ...prev, profile: formData }));
      setIsEditing(false);
      alert("✅ Profile updated successfully!");
    } catch (err) {
      console.error("❌ Error updating profile:", err);
      alert("Error updating profile");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-lg text-gray-600 animate-pulse">
        Loading your dashboard...
      </div>
    );

  if (!data)
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-xl font-semibold">
        No user data found 😔
      </div>
    );

  const { role, user, profile } = data;
  const isDoctor = role === "doctor";

  const stats = isDoctor
    ? [
        { title: "Experience", value: `${profile?.experience_years || 0} yrs`, icon: <Stethoscope className="w-7 h-7 text-blue-600" /> },
        { title: "Patients", value: 25, icon: <User className="w-7 h-7 text-green-600" /> },
        { title: "Fee", value: `₹${profile?.consultation_fee || 0}`, icon: <HeartPulse className="w-7 h-7 text-pink-600" /> },
        { title: "Rating", value: `${profile?.rating || 0}★`, icon: <Star className="w-7 h-7 text-yellow-500" /> },
      ]
    : [
        { title: "Age", value: profile?.age || "Not Set", icon: <User className="w-7 h-7 text-blue-500" /> },
        { title: "Blood", value: profile?.blood_group || "Unknown", icon: <HeartPulse className="w-7 h-7 text-red-500" /> },
        { title: "Appointments", value: "3 Upcoming", icon: <Calendar className="w-7 h-7 text-green-500" /> },
        { title: "Emergency", value: profile?.emergency_contact || "N/A", icon: <Phone className="w-7 h-7 text-yellow-500" /> },
      ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 p-6 md:p-12 relative">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12"
      >
        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            Welcome,{" "}
            <span className="text-blue-600">
              {user?.name || profile?.user_name}
            </span>{" "}
            👋
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            {isDoctor
              ? "Manage your appointments and patients efficiently."
              : "Track your health and upcoming doctor visits."}
          </p>
        </div>

        {/* <motion.button
          whileHover={{ scale: 1.05 }}
          className="mt-5 md:mt-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-2xl transition"
        >
          {isDoctor ? "+ Add Appointment" : "+ Book Appointment"}
        </motion.button> */}
        <motion.div whileHover={{ scale: 1.05 }}>
  <Link
    to={isDoctor ? "/add-appointment" : "/book-appointment"}
    className="mt-5 md:mt-0 inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-2xl transition"
  >
    {isDoctor ? "+ Add Appointment" : "+ Book Appointment"}
  </Link>
</motion.div>
      </motion.header>

      {/* Stats */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="grid md:grid-cols-4 sm:grid-cols-2 gap-8 mb-12"
      >
        {stats.map((item) => (
          <motion.div
            key={item.title}
            whileHover={{ y: -6 }}
            className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-md hover:shadow-xl transition"
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
          </motion.div>
        ))}
      </motion.section>

      {/* Profile */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl hover:shadow-2xl transition relative"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-blue-600" />
            {isDoctor ? "Doctor Profile" : "Patient Profile"}
          </h2>
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
          >
            <Edit3 className="w-5 h-5" /> Edit Profile
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-3 text-gray-700 text-lg">
            <p><b>Email:</b> {user?.email || profile?.user_email}</p>
            <p><b>Gender:</b> {profile?.gender || "N/A"}</p>
            <p><b>Address:</b> {profile?.address || "N/A"}</p>
            <p><b>Medical History:</b> {profile?.medical_history || "N/A"}</p>
          </div>

          <div className="flex justify-center items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-44 h-44 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center text-4xl text-blue-700 font-bold shadow-md ring-4 ring-blue-200"
            >
              {user?.name?.[0]?.toUpperCase()}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Edit Profile Modal */}
      <AnimatePresence>
  {isEditing && (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 180, damping: 15 }}
        className="relative w-[90%] max-w-lg bg-white/80 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-3xl p-8 overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={() => setIsEditing(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white"
          >
            <Edit3 className="w-8 h-8" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
          <p className="text-gray-500 text-sm mt-1">
            Update your personal details below
          </p>
        </div>

        {/* Form */}
        <div className="space-y-5">
          {[
            { key: "user_name", label: "Full Name" },
            { key: "gender", label: "Gender" },
            { key: "address", label: "Address" },
            { key: "medical_history", label: "Medical History" },
            { key: "blood_group", label: "Blood Group" },
            { key: "emergency_contact", label: "Emergency Contact" },
          ].map(({ key, label }) => (
            <div key={key} className="relative">
              <input
                name={key}
                value={formData?.[key] || ""}
                onChange={handleEditChange}
                type="text"
                placeholder=" "
                className="peer w-full px-4 py-3 border border-gray-300 rounded-xl bg-white/50 text-gray-700 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              />
              <label
                htmlFor={key}
                className="absolute left-3 top-2.5 text-gray-500 text-sm bg-white/80 px-1 rounded-md transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2.5 peer-focus:text-sm peer-focus:text-blue-500"
              >
                {label}
              </label>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-end space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsEditing(false)}
            className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md hover:shadow-lg transition"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

    </div>
  );
};

export default Dashboard;
