import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit3,
  Star,
  Stethoscope,
  MapPin,
  Phone,
  Calendar,
  Award,
  User,
  Briefcase,
  Mail,
  XCircle,
  Save,
  PlusCircle,
} from "lucide-react";
import api from "../api/axiosInstance";

// ------------------ Edit Modal -------------------
const EditDoctorModal = ({ doctor, onClose, onSave }: any) => {
  const [formData, setFormData] = useState({ ...doctor });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

        const payload = {
      clinic_name: formData.clinic_name,
      clinic_address: formData.clinic_address,
      experience_years: formData.experience_years,
      consultation_fee: formData.consultation_fee,
      description: formData.description,
        };
      const res = await api.patch("profile/me/", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSave({
      ...doctor,
      profile: { ...doctor.profile, ...res.data },
    });
      onClose();
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition"
          >
            <XCircle className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-semibold mb-6 text-center text-blue-600">
            Edit Doctor Profile
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-medium">Clinic Name</label>
              <input
                type="text"
                name="clinic_name"
                value={formData.profile.clinic_name || ""}
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
            <div>
              <label className="font-medium">Clinic Address</label>
              <textarea
                name="clinic_address"
                value={formData.profile.clinic_address || ""}
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
            <div>
              <label className="font-medium">Experience (years)</label>
              <input
                type="number"
                name="experience_years"
                value={formData.profile.experience_years || ""}
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
            <div>
              <label className="font-medium">Consultation Fee (₹)</label>
              <input
                type="number"
                name="consultation_fee"
                value={formData.profile.consultation_fee || ""}
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
            <div>
              <label className="font-medium">Description</label>
              <textarea
                name="description"
                value={formData.profile.description || ""}
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex justify-center items-center gap-2 font-semibold mt-4"
            >
              <Save className="w-5 h-5" /> Save Changes
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ------------------ Add Availability Modal -------------------
const AddAvailabilityModal = ({ onClose, onSave }: any) => {
  const [day, setDay] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const handleSubmit = async (e: any) => {
  e.preventDefault();

  // 🧩 1️⃣ Required field validation
  if (!day || !start || !end) {
    alert("Please fill all fields (day, start time, and end time).");
    return;
  }

  // 🕒 2️⃣ Time order validation
  const startTime = new Date(`1970-01-01T${start}`);
  const endTime = new Date(`1970-01-01T${end}`);
  if (endTime <= startTime) {
    alert("End time must be later than start time.");
    return;
  }

  // 🕓 3️⃣ Optional duration limit (e.g., max 8 hours)
  const hoursDiff = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
  if (hoursDiff > 8) {
    alert("Availability slot cannot exceed 8 hours.");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    await api.post(
      "availability/",
      { day, start_time: start, end_time: end },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Slot added successfully!");
    onSave();
    onClose();
  } catch (err: any) {
    console.error("Error adding slot:", err);
    alert("Error adding availability slot. Please try again.");
  }
};

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     if (!day || !start || !end) return alert("Please fill all fields");
//     try {
//       const token = localStorage.getItem("token");
//       await api.post(
//         "availability/",
//         { day, start_time: start, end_time: end },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       onSave();
//       onClose();
//     } catch (err) {
//       console.error("Error adding slot:", err);
//     }
//   };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-96"
      >
        <h3 className="text-lg font-semibold mb-4 text-blue-700">
          Add Availability
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Day</option>
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <input
              type="time"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-1/2 border rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="time"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="w-1/2 border rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// ------------------ Main Profile -------------------
const DoctorProfile: React.FC = () => {
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchDoctorProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("profile/me/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data,'kkkkk')
      setDoctor(res.data);
    } catch (err) {
      console.error("Error fetching doctor profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorProfile();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-lg text-gray-600 animate-pulse">
        Loading profile...
      </div>
    );

  if (!doctor)
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-xl font-semibold">
        No profile found 😔
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-12 px-6 md:px-20">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-10 px-8 flex flex-col md:flex-row md:items-end justify-between relative">
          <div className="flex items-center gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-28 h-28 rounded-full bg-white text-blue-700 flex items-center justify-center text-4xl font-bold border-4 border-blue-200 shadow-md"
            >
              {doctor.profile.user_name?.[0]?.toUpperCase()}
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold mb-1">
                Dr. {doctor.profile.user_name}
              </h1>
              <p className="text-blue-100 flex items-center gap-2">
                <Stethoscope className="w-5 h-5" />
                {doctor.specialization || "General Practitioner"}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <Star className="text-yellow-400 w-5 h-5" />
                <span>{doctor.profile.rating?.toFixed(1) || "0.0"}/5.0</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-8 md:mt-0 flex items-center gap-2 px-6 py-3 bg-white/20 border border-white/40 rounded-xl hover:bg-white/30 backdrop-blur-md transition font-semibold"
          >
            <Edit3 className="w-5 h-5" /> Edit Profile
          </button>
        </div>

        {/* BODY */}
        <div className="p-10 grid md:grid-cols-2 gap-12">
          {/* LEFT SIDE */}
          <div className="space-y-6">
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-blue-50 rounded-2xl p-6 shadow-inner"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-700">
                <Briefcase className="w-5 h-5" /> Professional Info
              </h2>
              <p className="flex items-center gap-2 text-gray-700">
                <Award className="text-green-600 w-5 h-5" />
                <b>Experience:</b> {doctor.profile.experience_years || "N/A"} years
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <MapPin className="text-pink-600 w-5 h-5" />
                <b>Clinic:</b> {doctor.profile.clinic_name || "Not specified"}
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <Phone className="text-indigo-600 w-5 h-5" />
                <b>Address:</b> {doctor.profile.clinic_address || "Not provided"}
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <Award className="text-yellow-500 w-5 h-5" />
                <b>Consultation Fee:</b> ₹{doctor.profile.consultation_fee || "N/A"}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-indigo-50 rounded-2xl p-6 shadow-inner"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-indigo-700">
                <User className="w-5 h-5" /> About Doctor
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {doctor.profile.description || "No bio added yet."}
              </p>
            </motion.div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">
            {/* Availability Section */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-blue-50 rounded-2xl p-6 shadow-inner"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2 text-blue-700">
                  <Calendar className="w-5 h-5" /> Availability
                </h2>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 transition"
                >
                  <PlusCircle className="w-4 h-4" /> Add Slot
                </button>
              </div>

              {/* {doctor.profile.availabilities?.length ? (
                <div className="space-y-3">
                  {doctor.profile.availabilities.map((slot: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center bg-white rounded-xl px-4 py-2 shadow border border-blue-100"
                    >
                      <span className="font-medium text-gray-700">
                        {slot.day}
                      </span>
                      <span className="text-sm text-gray-500">
                        {slot.start_time} - {slot.end_time}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No availability set</p>
              )} */}

              {doctor.profile.availabilities?.length ? (
  <div className="space-y-4">
    {Object.entries(
      doctor.profile.availabilities.reduce((acc: any, slot: any) => {
        if (!acc[slot.day]) acc[slot.day] = [];
        acc[slot.day].push(slot);
        return acc;
      }, {})
    ).map(([day, slots]: [string, any[]]) => (
      <div key={day} className="bg-white rounded-xl p-4 shadow border border-blue-100">
        <h3 className="font-semibold text-blue-700 mb-2">{day}</h3>
        <div className="space-y-1">
          {slots.map((slot, idx) => (
            <div key={idx} className="text-gray-600 text-sm">
              • {slot.start_time} – {slot.end_time}
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
) : (
  <p className="text-gray-500 italic">No availability set</p>
)}

            </motion.div>

            {/* Contact Info */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-indigo-50 rounded-2xl p-6 shadow-inner"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-indigo-700">
                <Mail className="w-5 h-5" /> Contact Info
              </h2>
              <p className="text-gray-700">
                <b>Email:</b> {doctor.profile.user_email || "Not available"}
              </p>
              <p className="text-gray-700">
                <b>Phone:</b> {doctor.profile.phone || "Not provided"}
              </p>
            </motion.div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-6 px-10 flex flex-wrap justify-between rounded-b-3xl">
          <div>
            <p className="text-sm text-blue-100">Appointments</p>
            <p className="text-2xl font-semibold">24 this month</p>
          </div>
          <div>
            <p className="text-sm text-blue-100">Patients</p>
            <p className="text-2xl font-semibold">120+</p>
          </div>
          <div>
            <p className="text-sm text-blue-100">Certifications</p>
            <p className="text-2xl font-semibold">5</p>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {isEditing && (
        <EditDoctorModal
          doctor={doctor}
          onClose={() => setIsEditing(false)}
          onSave={(updated: any) => setDoctor(updated)}
        />
      )}

      {showAddModal && (
        <AddAvailabilityModal
          onClose={() => setShowAddModal(false)}
          onSave={fetchDoctorProfile}
        />
      )}
    </div>
  );
};

export default DoctorProfile;
