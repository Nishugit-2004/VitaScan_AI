"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Appointment {
  id: string;
  disease: string;
  doctor: string;
  appointment_date: string;
  appointment_time: string;
  notes: string;
  status: string;
}

export default function Appointments() {

  const [success, setSuccess] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [form, setForm] = useState({
    disease: "",
    doctor: "",
    appointment_date: "",
    appointment_time: "",
    notes: "",
  });

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : "";

  const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/v1",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  async function loadAppointments() {
    const res = await api.get("/medical/appointments/");
    setAppointments(res.data);
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  async function bookAppointment() {
    await api.post("/medical/appointments/", form);

    setSuccess("✅ Appointment booked successfully!");

    setTimeout(() => {
      setSuccess("");
    }, 3000);

    setForm({
      disease: "",
      doctor: "",
      appointment_date: "",
      appointment_time: "",
      notes: "",
    });

    loadAppointments();
  }

  return (
    <div className="space-y-8">

      <div className="bg-white rounded-xl shadow p-6">

        <h1 className="text-3xl font-bold mb-6">
          Book Appointment
        </h1>

        {success && (

<div className="mb-4 rounded-lg bg-green-100 border border-green-400 text-green-700 p-4">

    {success}

</div>

)}

        <div className="grid grid-cols-2 gap-4">

          <input
            className="border p-3 rounded"
            placeholder="Disease"
            value={form.disease}
            onChange={(e) =>
              setForm({ ...form, disease: e.target.value })
            }
          />

          <select
            className="border p-3 rounded"
            value={form.doctor}
            onChange={(e) =>
              setForm({ ...form, doctor: e.target.value })
            }
          >
            <option value="">Select Doctor</option>
            <option>General Physician</option>
            <option>Neurologist</option>
            <option>Oncologist</option>
            <option>Hematologist</option>
          </select>

          <input
            type="date"
            className="border p-3 rounded"
            value={form.appointment_date}
            onChange={(e) =>
              setForm({
                ...form,
                appointment_date: e.target.value,
              })
            }
          />

          <input
            type="time"
            className="border p-3 rounded"
            value={form.appointment_time}
            onChange={(e) =>
              setForm({
                ...form,
                appointment_time: e.target.value,
              })
            }
          />

        </div>

        <textarea
          className="border p-3 rounded w-full mt-4"
          rows={4}
          placeholder="Symptoms / Notes"
          value={form.notes}
          onChange={(e) =>
            setForm({ ...form, notes: e.target.value })
          }
        />

        <button
          onClick={bookAppointment}
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Book Appointment
        </button>

      </div>

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-2xl font-bold mb-4">
          My Appointments
        </h2>

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left py-3">
                Disease
              </th>

              <th className="text-left">
                Doctor
              </th>

              <th className="text-left">
                Date
              </th>

              <th className="text-left">
                Time
              </th>

              <th className="text-left">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {appointments.map((a) => (

              <tr
                key={a.id}
                className="border-b"
              >

                <td className="py-3">
                  {a.disease}
                </td>

                <td>
                  {a.doctor}
                </td>

                <td>
                  {a.appointment_date}
                </td>

                <td>
  {new Date(`1970-01-01T${a.appointment_time}`)
    .toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}
</td>

                <td>

                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">

                    {a.status}

                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}