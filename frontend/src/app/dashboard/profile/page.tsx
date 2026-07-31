"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

interface DashboardSummary {
  total_predictions: number;
  total_diseases: number;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const [userRes, summaryRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/v1/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get(
          "http://127.0.0.1:8000/api/v1/medical/dashboard/summary",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),
      ]);

      setUser(userRes.data);
      setSummary(summaryRes.data);
    } catch (err) {
      console.error("Profile Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="text-center text-xl font-semibold py-10">
        Loading Profile...
      </div>
    );

  if (!user) return <div>User not found.</div>;

  const initials = user.full_name
    ? user.full_name
        .split(" ")
        .map((x) => x[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">

      <h1 className="text-4xl font-bold mb-8">
        My Profile
      </h1>

      <div className="grid md:grid-cols-3 gap-8">

        <div className="flex flex-col items-center">

          <div className="w-36 h-36 rounded-full bg-blue-600 text-white flex items-center justify-center text-5xl font-bold shadow">
            {initials}
          </div>

          <h2 className="text-2xl font-bold mt-4">
            {user.full_name}
          </h2>

          <p className="text-gray-500">
            {user.email}
          </p>

        </div>

        <div className="md:col-span-2">

          <div className="grid grid-cols-2 gap-6">

            <div className="border rounded-lg p-5">
              <p className="text-gray-500">Role</p>
              <h3 className="text-xl font-semibold">
                {user.role}
              </h3>
            </div>

            <div className="border rounded-lg p-5">
              <p className="text-gray-500">Verified</p>
              <h3
                className={`text-xl font-semibold ${
                  user.is_verified
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {user.is_verified ? "Yes" : "No"}
              </h3>
            </div>

            <div className="border rounded-lg p-5">
              <p className="text-gray-500">Account Status</p>
              <h3
                className={`text-xl font-semibold ${
                  user.is_active
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {user.is_active ? "Active" : "Inactive"}
              </h3>
            </div>

            <div className="border rounded-lg p-5">
              <p className="text-gray-500">Member Since</p>
              <h3 className="text-xl font-semibold">
                {new Date(user.created_at).toLocaleDateString()}
              </h3>
            </div>

          </div>

          <div className="grid grid-cols-2 gap-6 mt-8">

            <div className="bg-blue-50 rounded-lg p-6">

              <p className="text-gray-600">
                Predictions Made
              </p>

              <h2 className="text-4xl font-bold text-blue-600">
                {summary?.total_predictions ?? 0}
              </h2>

            </div>

            <div className="bg-green-50 rounded-lg p-6">

              <p className="text-gray-600">
                Diseases Tested
              </p>

              <h2 className="text-4xl font-bold text-green-600">
                {summary?.total_diseases ?? 0}
              </h2>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}