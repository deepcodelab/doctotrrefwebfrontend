import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Star, MapPin, Mail, Award, Building2 } from "lucide-react";
import api from "../api/axiosInstance";
import BookModal from "../components/BookModal";
import { motion } from "framer-motion";

type Doctor = {
  id: number;
  user_name?: string;
  user_email?: string;
  profile_picture?: string;
  specialization?: string;
  rating?: number;
  clinic_address?: string;
  consultation_fee?: number;
  bio?: string;
  experience_years?: number;
  slug?: string;
};

const DoctorDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const preloaded = (location.state as any)?.doctor as Doctor | undefined;

  const [doctor, setDoctor] = useState<Doctor | null>(preloaded ?? null);
  const [loading, setLoading] = useState<boolean>(!preloaded);
  const [openModal, setOpenModal] = useState<boolean>(false);

  // ✅ Properly typed recommended array
  const [recommended, setRecommended] = useState<Doctor[]>([]);
  const [loadingReco, setLoadingReco] = useState(true);

  useEffect(() => {
    if (doctor || !id) return;

    const fetchDoctor = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await api.get(`doctors/${id}/`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const data = res.data?.data ?? res.data;
        setDoctor(data);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctor, id]);

  useEffect(() => {
    if (!doctor?.id) return;

    const fetchRecommended = async () => {
      try {
        setLoadingReco(true);
        const token = localStorage.getItem("token");
        const res = await api.get(`recommend/from-doctor/${doctor.id}/`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        // ✅ Typecast response to Doctor[]
        setRecommended(res.data?.recommended as Doctor[] || []);
      } catch (err) {
        console.error("Recommendation API error:", err);
      } finally {
        setLoadingReco(false);
      }
    };

    fetchRecommended();
  }, [doctor]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-gray-500">
        Loading doctor profile...
      </div>
    );

  if (!doctor)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Doctor not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4 md:px-8">

      {/* Header Card */}
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-10 border border-white/40">

        {/* Top Section */}
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <img
            src={doctor.profile_picture || "https://via.placeholder.com/200"}
            className="w-44 h-44 rounded-2xl object-cover shadow-xl border-4 border-white"
            alt={doctor.user_name || "Doctor"}
          />

          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Dr. {doctor.user_name || "Unknown"}
            </h1>
            <p className="text-lg text-blue-600 mt-1 font-medium">
              {doctor.specialization || "General Physician"}
            </p>

            <div className="flex flex-wrap items-center gap-5 mt-4">
              <div className="flex items-center gap-2 text-yellow-500">
                <Star className="w-5 h-5" />
                <span className="font-semibold text-gray-800">
                  {doctor.rating ?? "4.5"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-5 h-5 text-blue-500" />
                <span>{doctor.clinic_address || "City Clinic"}</span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 text-gray-700">
              <Award className="w-5 h-5 text-indigo-500" />
              <span>{doctor.experience_years || 5}+ years experience</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">About Doctor</h2>
          <p className="text-gray-700 leading-relaxed">
            {doctor.bio || "Dedicated healthcare professional providing high-quality care with compassion."}
          </p>
        </div>

        {/* Fee */}
        <div className="mt-6 p-5 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3">
          <Building2 className="w-6 h-6 text-blue-600" />
          <p className="text-gray-700">
            Consultation Fee:{" "}
            <span className="font-semibold text-blue-700">
              ₹{doctor.consultation_fee || 500}
            </span>
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-10 flex flex-wrap gap-4">
          <button
            onClick={() => setOpenModal(true)}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all font-medium"
          >
            Book Appointment
          </button>

          <a
            href={`mailto:${doctor.user_email}`}
            className="px-8 py-3 rounded-xl bg-white border border-gray-300 shadow hover:bg-gray-100 text-gray-800 flex items-center gap-2"
          >
            <Mail className="w-5 h-5" /> Contact
          </a>
        </div>

        {/* Recommended */}
        <div className="max-w-5xl mx-auto mt-16">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Recommended Doctors
          </h2>

          {loadingReco ? (
            <p className="text-gray-500">Loading recommendations...</p>
          ) : recommended.length === 0 ? (
            <p className="text-gray-600">No similar doctors found.</p>
          ) : (
            <div className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar">
              {recommended.map((doc: Doctor) => (
                <motion.div
                  key={doc.id}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="min-w-[260px] bg-white/80 backdrop-blur-lg border border-white/40 shadow-lg 
                             rounded-3xl p-5 flex flex-col items-center text-center cursor-pointer 
                             hover:shadow-2xl transition-all duration-300"
                >
                  <img
                    src={doc.profile_picture || "https://via.placeholder.com/120"}
                    className="w-28 h-28 rounded-2xl object-cover shadow-md mb-4"
                  />

                  <h3 className="text-xl font-semibold text-gray-900">Dr. {doc.user_name}</h3>

                  <p className="text-blue-600 font-medium text-sm mt-1">
                    {doc.specialization}
                  </p>

                  <div className="flex justify-center gap-3 mt-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      ⭐ {doc.rating || "4.5"}
                    </span>

                    <span className="flex items-center gap-1">
                      💰 ₹{doc.consultation_fee || 500}
                    </span>
                  </div>

                  <div className="w-full mt-4 flex gap-2">
                    <button
                      onClick={() =>
                        window.location.href = `/doctors/${doc.slug || doc.id}`
                      }
                      className="flex-1 py-2 rounded-xl bg-blue-600 text-white shadow hover:bg-blue-700 transition"
                    >
                      View
                    </button>

                    <button
                      onClick={() =>
                        window.location.href = `/doctors/${doc.slug || doc.id}?book=true`
                      }
                      className="flex-1 py-2 rounded-xl bg-white text-blue-600 border border-blue-600 
                                 hover:bg-blue-50 transition"
                    >
                      Book
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </div>

      {openModal && <BookModal doctor={doctor} onClose={() => setOpenModal(false)} />}
    </div>
  );
};

export default DoctorDetails;
