import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { Star, MapPin, ArrowRight } from "lucide-react";

type Doctor = {
  id: number;
  user_name?: string;
  user_email?: string;
  profile_image?: string;
  image_url?: string;
  specialization?: string;
  rating?: number;
  clinic_address?: string;
  consultation_fee?: number;
  experience_years?: number;
};

const DoctorList: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const makeSlug = (name: string) =>
    name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("doctors/", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const list = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
          ? res.data
          : [];

        setDoctors(list);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-gray-500">
        Loading doctors…
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-50 px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-10 tracking-tight">
        Find Your Specialist
      </h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {doctors.map((doc) => (
          <div
            key={doc.id}
            className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all border border-white/40 cursor-pointer"
          >
            {/* IMAGE */}
            <img
              src={doc.image_url || doc.profile_image || "https://via.placeholder.com/150"}
              alt={doc.user_name ? `Dr. ${doc.user_name}` : "Doctor"}
              onClick={() =>
                navigate(
                  `/doctors/${doc.user_name ? makeSlug(doc.user_name) : doc.id}`,
                  { state: { doctor: doc } }
                )
              }
              className="w-full h-56 object-cover rounded-2xl shadow-md border"
            />

            <h2 className="mt-5 text-2xl font-bold text-gray-900">
              Dr. {doc.user_name || "Unknown"}
            </h2>

            <p className="text-blue-600 font-medium">
              {doc.specialization || "General Physician"}
            </p>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2 text-yellow-500">
                <Star className="w-5 h-5" />
                <span className="font-semibold text-gray-800">
                  {doc.rating ?? "4.5"}
                </span>
              </div>

              <div className="flex items-center gap-1 text-gray-600 text-sm">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span>{doc.clinic_address || "City Clinic"}</span>
              </div>
            </div>

            <p className="mt-3 text-gray-700">
              Fee:
              <span className="font-semibold text-blue-700 ml-1">
                ₹{doc.consultation_fee || 500}
              </span>
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() =>
                  navigate(
                    `/doctors/${doc.user_name ? makeSlug(doc.user_name) : doc.id}`,
                    { state: { doctor: doc } }
                  )
                }
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white shadow hover:bg-blue-700 transition-all flex-1 justify-center"
              >
                View Profile <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {doctors.length === 0 && (
        <p className="text-center text-gray-700 mt-12 text-lg">
          No doctors available at the moment.
        </p>
      )}
    </div>
  );
};

export default DoctorList;
