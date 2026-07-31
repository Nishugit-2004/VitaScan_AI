"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface DashboardSummary {
  total_predictions: number;
  total_diseases: number;
  average_confidence: number;
  last_prediction: string;
}

interface RecentPrediction {
  id: string;
  disease: string;
  prediction: string;
  confidence: number;
  image_path: string | null;
  created_at: string;
}

interface DiseaseDistribution {
  name: string;
  value: number;
}

interface ConfidenceTrend {
  date: string;
  confidence: number;
}

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#9333ea",
  "#ea580c",
  "#dc2626",
  "#0891b2",
];

export default function Dashboard() {
  const router = useRouter();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  const [recent, setRecent] = useState<RecentPrediction[]>([]);

  const [distribution, setDistribution] = useState<DiseaseDistribution[]>([]);

  const [trend, setTrend] = useState<ConfidenceTrend[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

  const token = localStorage.getItem("access_token");

  if (!token) {
    router.replace("/login");
    return;
  }

  const loadDashboard = async () => {

    try {

      const summaryRes = await api.get("/medical/dashboard/summary");

      const recentRes = await api.get("/medical/dashboard/recent?limit=5");

      const distributionRes = await api.get("/medical/dashboard/distribution");

      const trendRes = await api.get("/medical/dashboard/confidence-trend");

      console.log("Distribution Data:", distributionRes.data);

      setSummary(summaryRes.data);

      setRecent(recentRes.data);

      setDistribution(distributionRes.data);

      setTrend(trendRes.data);

    } catch (error: any) {

      if (error.response?.status === 401) {

        localStorage.removeItem("access_token");

        router.replace("/login");

        return;
      }

      console.error("Dashboard Error:", error);

    } finally {

      setLoading(false);

    }

  };

  loadDashboard();

}, [router]);

  if (loading) {
    return (
      <div className="p-8 text-xl font-semibold">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <h1 className="text-3xl font-bold text-gray-800">
        VitaScan AI Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="bg-white rounded-xl shadow p-6 border">
          <p className="text-gray-500">
            Total Predictions
          </p>

          <h2 className="text-4xl font-bold text-blue-600">
            {summary?.total_predictions}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border">
          <p className="text-gray-500">
            Diseases Tested
          </p>

          <h2 className="text-4xl font-bold text-green-600">
            {summary?.total_diseases}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border">
          <p className="text-gray-500">
            Average Confidence
          </p>

          <h2 className="text-4xl font-bold text-purple-600">
            {summary?.average_confidence.toFixed(2)}%
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border">
          <p className="text-gray-500">
            Last Prediction
          </p>

          <h2 className="text-lg font-bold text-orange-600">
            {summary?.last_prediction
              ? new Date(summary.last_prediction).toLocaleString()
              : "-"}
          </h2>
        </div>

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <div className="bg-white rounded-xl shadow border p-6">

          <h2 className="text-2xl font-bold mb-4">
            Disease Distribution
          </h2>

          <ResponsiveContainer width="100%" height={320}>

            <PieChart>

              <Pie
  data={distribution}
  dataKey="value"
  nameKey="name"
  cx="50%"
  cy="50%"
  outerRadius={100}
  fill="#8884d8"
  label={({ name, percent }) =>
  `${name} ${(percent * 100).toFixed(0)}%`
}
>
  {distribution.map((entry, index) => (
    <Cell
      key={index}
      fill={COLORS[index % COLORS.length]}
    />
  ))}
</Pie>

              <Tooltip
  formatter={(value) => [`${value} Prediction(s)`, "Count"]}
/>

<Legend
  formatter={(value) => (
    <span className="text-gray-700">{value}</span>
  )}
/>

            </PieChart>

          </ResponsiveContainer>

        </div>

        <div className="bg-white rounded-xl shadow border p-6">

          <h2 className="text-2xl font-bold mb-4">
            Confidence Trend
          </h2>

          <ResponsiveContainer width="100%" height={320}>

            <LineChart data={trend}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="date" />

              <YAxis />

              <Tooltip />

<Legend />

              <Line
                type="monotone"
                dataKey="confidence"
                stroke="#2563eb"
                strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>
            <div className="bg-white rounded-xl shadow border p-6">

        <h2 className="text-2xl font-bold mb-4">
          Recent Predictions
        </h2>

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead>

              <tr className="bg-gray-100 border-b">

                <th className="text-left p-3">
                  Disease
                  
                </th>

                <th className="text-left p-3">
                  Prediction
                </th>

                <th className="text-left p-3">
                  Confidence
                </th>

                <th className="text-left p-3">
                  Date
                </th>

              </tr>

            </thead>

            <tbody>

              {recent.length === 0 ? (

                <tr>

                  <td
                    colSpan={4}
                    className="text-center p-6 text-gray-500"
                  >
                    No predictions found.
                  </td>

                </tr>

              ) : (

                recent.map((item) => (

                  <tr
                    key={item.id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="p-3">
                      {item.disease}
                    </td>

                    <td className="p-3 font-medium">
                      {item.prediction}
                    </td>

                    <td className="p-3">
                      {item.confidence.toFixed(2)}%
                    </td>

                    <td className="p-3">
                      {new Date(item.created_at).toLocaleString()}
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}