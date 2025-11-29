import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Search,
  Calendar,
  Users,
  DollarSign,
  Star,
  Plus,
  Video,
  FileText,
  MessageCircle,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import api from '../api/axiosInstance'

/**
 * DoctorDashboardNoSidebar.tsx
 * Single-file doctor dashboard (no sidebar). Replace mock data with API calls.
 */
const today = new Date().toISOString().split("T")[0];

type Patient = { id: number; name: string; age?: number; avatar?: string; lastVisit?: string };
type Appt = { id: number; time: string; patient: string; type: string; status: "Confirmed" | "Pending" | "Completed" | "Cancelled" };
type Review = { id: number; name: string; rating: number; text: string; date: string };

interface docStats {
  today: number;
  upcoming: number;
  completed: number;
  earningsMonth: number;
  rating: number;
  clinicName?: string;
  address?: string;
  specialization?: string;
}

const earningsData = [
  { day: "Mon", earnings: 4500, appts: 8 },
  { day: "Tue", earnings: 5200, appts: 10 },
  { day: "Wed", earnings: 4800, appts: 9 },
  { day: "Thu", earnings: 6000, appts: 11 },
  { day: "Fri", earnings: 7500, appts: 13 },
  { day: "Sat", earnings: 3300, appts: 6 },
  { day: "Sun", earnings: 1900, appts: 3 },
];

const reviews: Review[] = [
  { id: 1, name: "Anita K.", rating: 5, text: "Very professional and attentive. Highly recommended!", date: "3 days ago" },
  { id: 2, name: "Rahul S.", rating: 5, text: "Clear diagnosis, good follow-up.", date: "1 week ago" },
  { id: 3, name: "Simran P.", rating: 4, text: "Helpful and patient. Clinic was clean.", date: "2 weeks ago" },
];

export default function DoctorHomePage() {
  const [userName, setUserName] = useState("");
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [stats, setStats] = useState<docStats>({
  today: 0,
  upcoming: 0,
  completed: 0,
  earningsMonth: 0,
  rating: 0,
});
  const [schedule, setSchedule] = useState<Appt[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [notifCount] = useState(3);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  useEffect(() => {
    // Example: load user from localStorage or API
    const fetchData = async () => {
    try {
      const token = localStorage.getItem("token")
      console.log("mmm", token)
      const res = await api.get('doctor-homepage', {headers: {Authorization:`Bearer ${token}`}});
      const data = res.data
      console.log(data,"data")
      const profilePicture = data.doctor_image
      setProfilePic(profilePicture)
      setUserName(data.name)
      const docClinicName = data.clinic_name;
      const docClinicAddress = data.clinic_address
      const specialization = data.specialization
      // const appointmentList = data.appointments
      const appointmentList = data.appointments ?? [];
      const todayAppointments = appointmentList.filter(
        (a: any) => a.appointment_date === today
      );
      const todayTotalAppointment = todayAppointments.length
      const upcommingAppointments = appointmentList.filter(
        (a: any) => a.status === "confirmed"
      );
      const upcomingTotalAppointment = upcommingAppointments.length
      const completedAppointments = appointmentList.filter(
        (a: any) => a.status === "completed"
      );
      const completedTotalAppointment = completedAppointments.length

      const formattedCompletedAppointments = completedAppointments.map((a: any) => ({
        name: a.customer_name,
        avatar: a.image
      }))

      setPatients(formattedCompletedAppointments)

      const docStats = {
        today: todayTotalAppointment,
        upcoming: upcomingTotalAppointment,
        completed: completedTotalAppointment,
        earningsMonth: 52200,
        rating: 4.9,
        clinicName: docClinicName,
        address: docClinicAddress,
        specialization: specialization
      };
      setStats(docStats)

      const formattedAppointments = todayAppointments.map((a: any) => ({
        id: a.id,
        patient: a.customer_name,
        date: a.appointment_date,
        time: a.appointment_time,
        status:
          a.status === "pending"
            ? "pending"
            : a.status === "confirmed"
            ? "upcoming"
            : a.status === "completed"
            ? "completed"
            : "cancelled",
      }));

      setSchedule(formattedAppointments);
    } catch {}
    // TODO: replace mocked data with real fetch calls
  }

  fetchData();
  }, []);

  // Auto-advance reviews carousel
  useEffect(() => {
    const t = setInterval(() => setActiveReviewIndex((i) => (i + 1) % reviews.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 text-gray-800 p-6 lg:p-10">
      {/* Top nav */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-6">
          <div>
            <h2 className="text-lg text-gray-500">Good morning</h2>
            <h1 className="text-2xl lg:text-3xl font-extrabold">Welcome back, <span className="text-indigo-600">{userName}</span></h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              placeholder="Search patients, appointments..."
              className="pl-10 pr-4 py-2 rounded-2xl border border-gray-200 w-72 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>

          <button className="relative p-2 rounded-lg hover:bg-white/60">
            <Bell className="w-6 h-6" />
            {notifCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{notifCount}</span>
            )}
          </button>

          <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold">
            {userName?.[0]}
          </div>
        </div>
      </header>

      {/* Hero / Overview */}
      <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 lg:p-8 shadow-lg mb-6 flex flex-col lg:flex-row gap-6 items-center">
        <div className="flex items-center gap-6">
          <motion.div whileHover={{ scale: 1.03 }} className="relative group w-28 h-28 rounded-full overflow-hidden ring-4 ring-indigo-50 shadow-md bg-white flex items-center justify-center">
            {profilePic ? (
              <img src={profilePic} alt="profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-indigo-600">{userName?.[0]}</span>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <button className="bg-white/90 px-3 py-1 rounded-full text-sm">Change</button>
            </div>
          </motion.div>

          <div>
            <div className="text-sm text-gray-500">Clinic — {stats.clinicName}</div>
            <div className="text-sm text-gray-500">Address — {stats.address}</div>
            {/* <div className="text-xl lg:text-2xl font-semibold">{userName}</div> */}
            <div className="text-sm text-gray-600 mt-1">{stats.specialization} • Online consultations available</div>

            <div className="mt-4 flex gap-3 flex-wrap">
              <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white shadow hover:bg-indigo-700 flex items-center gap-2">
                <Video className="w-4 h-4" /> Start Video Consult
              </button>
              <button className="px-4 py-2 rounded-lg border border-gray-200 flex items-center gap-2">
                <Plus className="w-4 h-4" /> New Appointment
              </button>
              <button className="px-4 py-2 rounded-lg border border-gray-200 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Patient History
              </button>
            </div>
          </div>
        </div>

        {/* top-right summary cards */}
        <div className="ml-auto grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:w-auto">
          <StatCard title="Today" value={stats.today} icon={<Calendar />} />
          <StatCard title="Upcoming" value={stats.upcoming} icon={<Users />} />
          <StatCard title="Earnings" value={`₹${stats.earningsMonth.toLocaleString()}`} icon={<DollarSign />} />
          <StatCard title="Rating" value={`${stats.rating}★`} icon={<Star />} />
        </div>
      </section>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Schedule + Quick actions + Reviews */}
        <div className="lg:col-span-2 space-y-6">
          {/* Schedule timeline */}
          <div className="bg-white rounded-2xl shadow p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Today's Timeline</h3>
              <div className="text-sm text-gray-500">Timezone: Local</div>
            </div>

            <div className="space-y-3">
              {schedule.map((s) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg border hover:shadow-md transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 text-sm text-indigo-600 font-medium">{s.time}</div>
                    <div>
                      <div className="font-medium">{s.patient}</div>
                      <div className="text-xs text-gray-500">{s.type}</div>
                    </div>
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      s.status === "Confirmed" ? "bg-green-100 text-green-700" :
                      s.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>{s.status}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow p-5">
            <h3 className="font-semibold text-lg mb-3">Quick Actions</h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              <Action icon={<Plus />} label="New Appt" />
              <Action icon={<FileText />} label="Prescribe" />
              <Action icon={<MessageCircle />} label="Messages" />
              <Action icon={<Video />} label="Video" />
              <Action icon={<Search />} label="Scan QR" />
              <Action icon={<Users />} label="Patients" />
            </div>
          </div>

          {/* Reviews carousel */}
          <div className="bg-white rounded-2xl shadow p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">Patient Reviews</h3>
              <div className="text-sm text-gray-500">{reviews.length} recent</div>
            </div>

            <div className="space-y-3">
              {reviews.map((r, i) => (
                <div key={r.id} className={`p-4 rounded-lg transition ${i === activeReviewIndex ? "bg-indigo-50 border border-indigo-100" : "bg-white"}`}>
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center font-semibold text-indigo-700">{r.name[0]}</div>
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="font-medium">{r.name}</div>
                        <div className="text-xs text-gray-500">{r.date}</div>
                      </div>
                      <div className="text-sm text-gray-700 mt-1">{r.text}</div>
                      <div className="mt-2 text-xs text-yellow-500">{"★".repeat(Math.round(r.rating))}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Charts, Patients list, Notifications */}
        <aside className="space-y-6">
          {/* Earnings chart */}
          <div className="bg-white rounded-2xl shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold">Earnings (7 days)</div>
              <div className="text-sm text-gray-500">This month ₹{stats.earningsMonth.toLocaleString()}</div>
            </div>
            <div style={{ width: "100%", height: 140 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef2ff" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip />
                  <Line type="monotone" dataKey="earnings" stroke="#4F46E5" strokeWidth={3} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Patients */}
          <div className="bg-white rounded-2xl shadow p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold">Recent Patients</div>
              <div className="text-sm text-gray-500">{patients.length}</div>
            </div>
            <div className="space-y-3">
              {patients.map((p) => (
                <div key={p.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-gray-500">{p.lastVisit}</div>
                    </div>
                  </div>
                  <button className="text-indigo-600 text-sm">Open</button>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-2xl shadow p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold">Notifications</div>
              <div className="text-xs text-gray-500">Recent</div>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-3"><Bell className="w-4 h-4 text-indigo-600 mt-1" /> New message from Amit</li>
              <li className="flex items-start gap-3"><Bell className="w-4 h-4 text-indigo-600 mt-1" /> 5PM appointment pending</li>
              <li className="flex items-start gap-3"><Bell className="w-4 h-4 text-indigo-600 mt-1" /> New review posted</li>
            </ul>
          </div>
        </aside>
      </div>

      <footer className="text-center text-gray-500 mt-8">
        © {new Date().getFullYear()} DocConnect — Empowering Healthcare.
      </footer>
    </div>
  );
}

/* -------------------------
   Small subcomponents below
   ------------------------- */

function StatCard({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) {
  return (
    <motion.div whileHover={{ y: -6 }} className="bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm">
      <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">{icon}</div>
      <div>
        <div className="text-xs text-gray-500">{title}</div>
        <div className="font-semibold text-lg">{value}</div>
      </div>
    </motion.div>
  );
}

function Action({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex flex-col gap-2 items-center justify-center p-3 rounded-xl bg-white/70 border border-gray-100 hover:shadow-md transition text-xs">
      <div className="p-2 rounded-md bg-indigo-50 text-indigo-600">{icon}</div>
      <div className="font-medium">{label}</div>
    </button>
  );
}
