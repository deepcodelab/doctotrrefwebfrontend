import { useEffect, useMemo, useState } from "react";
import { X, Calendar, Clock, MapPin } from "lucide-react";
import api from "../api/axiosInstance";

type Availability = {
  id?: number;
  day: string; // e.g. "Monday"
  start_time: string; // "09:00:00" or "09:00"
  end_time: string; // "12:30:00" or "12:30"
};

type Doctor = {
  id: number;
  user_name?: string;
  specialization?: string;
  profile_picture?: string;
  clinic_address?: string;
  consultation_fee?: number;
  availabilities?: Availability[];
};

type Props = {
  doctor: Doctor;
  onClose: () => void;
  onBooked?: () => void;
};

const SLOT_MINUTES = 30;

function toTimeHHMM(raw: string) {
  // Accept "09:00:00" or "09:00" or "9:00"
  if (!raw) return "";
  const parts = raw.split(":");
  return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`;
}

function formatDisplayHHMM(hhmm: string) {
  // "09:00" -> locale short "9:00 AM" or "09:00"
  const [hh, mm] = hhmm.split(":").map(Number);
  const d = new Date();
  d.setHours(hh, mm, 0, 0);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function generate30MinSlots(startRaw: string, endRaw: string) {
  const start = toTimeHHMM(startRaw);
  const end = toTimeHHMM(endRaw);
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);

  const base = new Date(2025, 0, 1, sh, sm, 0, 0);
  const endDate = new Date(2025, 0, 1, eh, em, 0, 0);
  const out: string[] = [];

  let cur = new Date(base);
  while (cur < endDate) {
    const h = String(cur.getHours()).padStart(2, "0");
    const m = String(cur.getMinutes()).padStart(2, "0");
    out.push(`${h}:${m}`);
    cur = new Date(cur.getTime() + SLOT_MINUTES * 60000);
  }
  return out;
}

export default function BookModal({ doctor, onClose, onBooked }: Props) {
  const todayDefault = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState<string>(todayDefault);
  const [slots, setSlots] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);
  const [booking, setBooking] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>("");

  // weekday name e.g. "Monday"
  const weekdayName = useMemo(() => {
    if (!selectedDate) return "";
    return new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long" });
  }, [selectedDate]);

  // Build slots for selectedDate from doctor.availabilities
  useEffect(() => {
    setSelectedTime("");
    setSlots([]);
    setBookedSlots([]);
    if (!selectedDate || !doctor?.availabilities) return;

    setLoadingSlots(true);

    try {
      const availForDay = (doctor.availabilities || []).filter(
        (a) => String(a.day).toLowerCase() === weekdayName.toLowerCase()
      );

      let all: string[] = [];
      availForDay.forEach((a) => {
        const s = a.start_time ?? (a as any).start ?? "";
        const e = a.end_time ?? (a as any).end ?? "";
        if (s && e) {
          const gen = generate30MinSlots(s, e);
          all = all.concat(gen);
        }
      });

      // dedupe & sort
      all = Array.from(new Set(all)).sort((a, b) => a.localeCompare(b));
      // remove past slots if date is today
      const isToday =
        selectedDate === new Date().toISOString().slice(0, 10);

      if (isToday) {
        const now = new Date();
        all = all.filter((t) => {
          const [hh, mm] = t.split(":").map(Number);
          const d = new Date(selectedDate);
          d.setHours(hh, mm, 0, 0);
          return d >= now;
        });
      }

      setSlots(all);
      // fetch booked slots after generating
      (async () => {
        try {
          // API: GET /appointments/?doctor=<id>&date=YYYY-MM-DD
          const token = localStorage.getItem("token");
          const res = await api.get("appointments/", {
            params: { doctor: doctor.id, date: selectedDate },
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });

          let payload = res.data;
          let items: any[] = [];
          if (Array.isArray(payload)) items = payload;
          else if (Array.isArray(payload.data)) items = payload.data;
          else if (Array.isArray(payload.results)) items = payload.results;
          else if (payload && payload.appointments && Array.isArray(payload.appointments)) items = payload.appointments;

          // normalize times to HH:MM
          const normalized = items
            .map((it) => {
              // try different fields
              const t =
                it.appointment_time ??
                it.time ??
                it.slot ??
                it.start_time ??
                it.appointment_time_display;
              if (!t) return null;
              // t might be "09:00:00" or "2025-11-14T09:00:00Z"
              if (typeof t === "string" && t.includes("T")) {
                const dt = new Date(t);
                return dt.toTimeString().slice(0, 5);
              }
              if (typeof t === "string") {
                return toTimeHHMM(t);
              }
              return null;
            })
            .filter(Boolean) as string[];

          setBookedSlots(Array.from(new Set(normalized)));
        } catch (err) {
          // ignore backend errors gracefully
          setBookedSlots([]);
        } finally {
          setLoadingSlots(false);
        }
      })();
    } catch (err) {
      console.error("Slot generation error:", err);
      setLoadingSlots(false);
    }
  }, [selectedDate, doctor, weekdayName]);

  // helpers to move date
  const changeDate = (offsetDays: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + offsetDays);
    const iso = d.toISOString().slice(0, 10);
    setSelectedDate(iso);
  };

  const handleBook = async () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select date and time");
      return;
    }
    setBooking(true);
    try {
      const token = localStorage.getItem("token");
      // Your backend earlier accepted appointment_date & appointment_time
      await api.post(
        "appointments/",
        {
          doctor: doctor.id,
          appointment_date: selectedDate,
          appointment_time: selectedTime,
          notes,
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      alert("Appointment booked!");
      if (onBooked) onBooked();
      onClose();
    } catch (err) {
      console.error("Booking error:", err);
      alert("Failed to book appointment.");
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-5">
        <div className="flex justify-between items-start">
          <div className="flex gap-3 items-center">
            <img
              src={doctor.profile_picture ?? "https://via.placeholder.com/80"}
              alt={doctor.user_name}
              className="w-14 h-14 rounded-lg object-cover"
            />
            <div>
              <div className="text-lg font-semibold">Dr. {doctor.user_name}</div>
              <div className="text-sm text-gray-500">{doctor.specialization}</div>
              <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <MapPin className="w-4 h-4" /> {doctor.clinic_address ?? "Clinic"}
              </div>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Date selection + prev/next */}
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={() => changeDate(-1)}
            className="px-3 py-1 rounded-md bg-gray-100 text-sm"
          >
            Prev
          </button>

          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">
              <Calendar className="inline w-4 h-4 mr-2 text-blue-600" /> Select date
            </label>
            <input
              className="w-full p-2 border rounded-md"
              type="date"
              value={selectedDate}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <button
            onClick={() => changeDate(1)}
            className="px-3 py-1 rounded-md bg-gray-100 text-sm"
          >
            Next
          </button>
        </div>

        {/* Slots area */}
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">
              <Clock className="inline w-4 h-4 mr-1 text-blue-600" />
              Available slots ({weekdayName})
            </div>
            <div className="text-xs text-gray-500">{loadingSlots ? "Loading..." : `${slots.length} slots`}</div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
            {loadingSlots ? (
              <div className="col-span-3 text-sm text-gray-500">Loading slots…</div>
            ) : slots.length === 0 ? (
              <div className="col-span-3 text-sm text-red-500">No slots available for this day.</div>
            ) : (
              slots.map((t) => {
                const isBooked = bookedSlots.includes(t);
                const isPast = (() => {
                  // check if slot is in the past for selectedDate
                  const now = new Date();
                  const d = new Date(selectedDate + "T" + `${t}:00`);
                  return d < now;
                })();

                const disabled = isBooked || isPast;
                return (
                  <button
                    key={t}
                    onClick={() => !disabled && setSelectedTime(t)}
                    disabled={disabled}
                    className={`p-2 text-sm rounded-md border transition-all ${
                      selectedTime === t
                        ? "bg-blue-600 text-white"
                        : disabled
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white hover:bg-blue-50"
                    }`}
                  >
                    {formatDisplayHHMM(t)}
                    {isBooked && <span className="text-xs ml-1 text-red-500"> • Booked</span>}
                    {isPast && !isBooked && <span className="text-xs ml-1 text-gray-400"> • Past</span>}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="mt-4">
          <label className="block text-sm text-gray-600 mb-1">Notes (optional)</label>
          <textarea
            className="w-full p-2 border rounded-md"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Briefly describe the reason for visit..."
          />
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-3">
          <button
            onClick={handleBook}
            disabled={booking}
            className={`flex-1 py-2 rounded-md text-white font-medium ${
              booking ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {booking ? "Booking..." : selectedTime ? `Confirm • ${formatDisplayHHMM(selectedTime)}` : "Confirm"}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border bg-white text-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
