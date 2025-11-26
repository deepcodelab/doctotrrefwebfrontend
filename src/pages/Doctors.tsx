import React, { useEffect, useState } from "react";
import api from '../api/axiosInstance'
import { Search, MapPin, Star, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience: number;
  location: string;
  image?: string;
  rating?: number;
}

const DoctorList: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");

useEffect(() => {
  const fetchDoctors = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found — stopping request.");
      setError("Please log in to view doctors.");
      setLoading(false);
      return; // 🚫 Stop here if no token
    }

    try {
      const response = await api.get("https://doctotrrefweb.onrender.com/api/doctors/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const doctorList = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];

      setDoctors(doctorList);
      setFilteredDoctors(doctorList);
    } catch (err: any) {
      console.error("Error fetching doctors:", err);

      // 🧩 Check for unauthorized
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("token");
        // Optionally redirect to login:
        // navigate("/login");
      } else {
        setError("Failed to load doctors. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  fetchDoctors();
}, []);

  useEffect(() => {
    let filtered = doctors;

    if (searchTerm) {
      filtered = filtered.filter((doc) =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSpecialty) {
      filtered = filtered.filter(
        (doc) => doc.specialty.toLowerCase() === selectedSpecialty.toLowerCase()
      );
    }

    setFilteredDoctors(filtered);
  }, [searchTerm, selectedSpecialty, doctors]);

  const specialties = Array.from(new Set(doctors.map((doc) => doc.specialty)));

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800">
            Find the Right <span className="text-blue-600">Doctor</span>
          </h1>
          <p className="text-gray-500 mt-2">
            Discover top specialists and book appointments instantly.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white shadow-md rounded-xl p-5 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-2/3">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search doctors by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white outline-none transition"
          >
            <option value="">All Specialties</option>
            {specialties.map((spec, index) => (
              <option key={index} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8 text-center">
            {error}
          </div>
        )}

        {/* Doctor Cards */}
        {loading ? (
          <p className="text-center text-gray-500">Loading doctors...</p>
        ) : filteredDoctors.length === 0 ? (
          <p className="text-center text-gray-500">
            No doctors found matching your search.
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-6 flex flex-col items-center text-center border border-gray-100"
              >
                <img
                  src={
                    doctor.image ||
                    "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
                  }
                  alt={doctor.name}
                  className="w-28 h-28 object-cover rounded-full border-4 border-blue-100 mb-4"
                />

                <h3 className="text-lg font-semibold text-gray-800">
                  {doctor.name}
                </h3>
                <p className="text-blue-600 font-medium mt-1">
                  {doctor.specialty}
                </p>

                <div className="flex items-center justify-center gap-1 mt-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < (doctor.rating || 4) ? "#FACC15" : "none"}
                      stroke="#FACC15"
                    />
                  ))}
                </div>

                <p className="text-gray-500 text-sm mt-2">
                  {doctor.experience} years of experience
                </p>

                <p className="flex items-center justify-center gap-1 text-gray-500 text-sm mt-1">
                  <MapPin size={14} /> {doctor.location}
                </p>

                <Link to='/book-appointment' className="mt-4 w-full bg-blue-600 text-white flex items-center justify-center gap-2 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                  <Calendar size={16} /> Book Appointment
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorList;
