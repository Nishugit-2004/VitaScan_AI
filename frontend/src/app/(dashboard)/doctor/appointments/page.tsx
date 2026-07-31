"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "@/components/DashboardLayout";

interface Appointment {
  id: string;
  disease: string;
  doctor: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
}

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const res = await axios.get(
        "http://127.0.0.1:8000/api/v1/medical/appointments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">
        Appointment Requests
      </h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">Disease</th>

              <th className="p-4 text-left">Doctor</th>

              <th className="p-4 text-left">Date</th>

              <th className="p-4 text-left">Time</th>

              <th className="p-4 text-left">Status</th>

            </tr>

          </thead>

          <tbody>

            {appointments.map((a) => (

              <tr key={a.id} className="border-b">

                <td className="p-4">
                  {a.disease}
                </td>

                <td className="p-4">
                  {a.doctor}
                </td>

                <td className="p-4">
                  {a.appointment_date}
                </td>

                <td className="p-4">
                  {new Date(`1970-01-01T${a.appointment_time}`).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </td>

                <td className="p-4">

                  <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">

                    {a.status}

                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </DashboardLayout>
  );
}