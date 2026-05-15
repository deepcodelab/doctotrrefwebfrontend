import React, { useEffect, useState } from "react";
import { Search, User, Calendar, FileText, ChevronRight, X } from "lucide-react";
import api from "../api/axiosInstance";

interface Patient {
  id: number;
  name: string;
  email: string;
  phone?: string;
  age?: number;
  gender?: string;
  image?: string;
  totalVisits: number;
  lastVisit?: string;
}

interface Appointment {
  id: number;
  date: string;
  time: string;
  status: string;
  notes?: string;
}

const PatientHistory: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientAppointments, setPatientAppointments] = useState<Appointment[]>([]);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await api.get("patient-history/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data.data || response.data || [];

        const formattedPatients = data.map((p: any) => ({
          id: p.id,
          name: p.name || p.customer_name,
          email: p.email,
          phone: p.phone,
          age: p.age,
          gender: p.gender,
          image: p.image,
          totalVisits: p.total_visits || p.appointments_count || 0,
          lastVisit: p.last_visit,
        }));

        setPatients(formattedPatients);
      } catch (err) {
        console.error("Error fetching patients:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const openPatientDetails = async (patient: Patient) => {
    setSelectedPatient(patient);
    setModalLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`patient-history/${patient.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data.data || response.data.appointments || [];

      const formattedAppointments = data.map((a: any) => ({
        id: a.id,
        date: a.appointment_date,
        time: a.appointment_time,
        status: a.status,
        notes: a.notes,
      }));

      setPatientAppointments(formattedAppointments);
    } catch (err) {
      console.error("Error fetching patient appointments:", err);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedPatient(null);
    setPatientAppointments([]);
  };

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">Patient History</h1>
            <p className="text-sm text-gray-500">View and manage your patients' medical history</p>
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full md:w-72 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Patients</p>
                <p className="text-xl font-bold text-gray-800">{patients.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Visits</p>
                <p className="text-xl font-bold text-gray-800">
                  {patients.reduce((sum, p) => sum + p.totalVisits, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Patient List */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading patients...</div>
        ) : filteredPatients.length === 0 ? (
          <div className="bg-white p-8 rounded-xl text-center text-gray-600">
            {searchTerm ? "No patients found matching your search." : "No patients yet."}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Patient</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 hidden md:table-cell">Contact</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 hidden md:table-cell">Total Visits</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 hidden md:table-cell">Last Visit</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {patient.image ? (
                          <img
                            src={patient.image}
                            alt={patient.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">
                              {patient.name?.[0]?.toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-800">{patient.name}</p>
                          <p className="text-xs text-gray-500 md:hidden">{patient.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <p className="text-sm text-gray-600">{patient.email}</p>
                      {patient.phone && (
                        <p className="text-xs text-gray-500">{patient.phone}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                        <FileText className="w-4 h-4" /> {patient.totalVisits}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-sm text-gray-600">
                        {patient.lastVisit ? formatDate(patient.lastVisit) : "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openPatientDetails(patient)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        View <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                {selectedPatient.image ? (
                  <img
                    src={selectedPatient.image}
                    alt={selectedPatient.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-xl">
                      {selectedPatient.name?.[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{selectedPatient.name}</h3>
                  <p className="text-sm text-gray-500">{selectedPatient.email}</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <h4 className="text-sm font-medium text-gray-600 mb-4">Appointment History</h4>

              {modalLoading ? (
                <div className="text-center py-8 text-gray-500">Loading appointments...</div>
              ) : patientAppointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No appointments found.</div>
              ) : (
                <div className="space-y-3">
                  {patientAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-800">
                            {formatDate(apt.date)}
                          </span>
                          <span className="text-sm text-gray-500">at {apt.time}</span>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getStatusColor(apt.status)}`}
                        >
                          {apt.status}
                        </span>
                      </div>
                      {apt.notes && (
                        <p className="text-sm text-gray-600 mt-2 pl-6">{apt.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientHistory;
