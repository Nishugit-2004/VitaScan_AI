"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";

interface Report {
  id: string;
  disease: string;
  prediction: string;
  confidence: number;
  image_path: string;
  created_at: string;
}

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const res = await axios.get(
        "http://127.0.0.1:8000/api/v1/medical/reports",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReports(res.data);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = useMemo(() => {
    return reports.filter(
      (report) =>
        report.disease.toLowerCase().includes(search.toLowerCase()) ||
        report.prediction.toLowerCase().includes(search.toLowerCase())
    );
  }, [reports, search]);

  if (loading) {
    return (
      <div className="text-center text-lg font-semibold py-10">
        Loading reports...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Medical Reports
        </h1>

        <input
          type="text"
          placeholder="Search disease..."
          className="border rounded-lg px-4 py-2 w-72"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">

        <table className="w-full border-collapse">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left p-4">Disease</th>

              <th className="text-left p-4">Prediction</th>

              <th className="text-left p-4">Confidence</th>

              <th className="text-left p-4">Date</th>

              <th className="text-center p-4">Action</th>

            </tr>

          </thead>

          <tbody>

            {filteredReports.map((report) => (

              <tr
                key={report.id}
                className="border-b hover:bg-gray-50"
              >

                <td className="p-4 font-medium">
                  {report.disease}
                </td>

                <td className="p-4">
                  {report.prediction}
                </td>

                <td className="p-4">
                  {report.confidence.toFixed(2)}%
                </td>

                <td className="p-4">
                  {new Date(report.created_at).toLocaleString()}
                </td>

                <td className="text-center">

                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    onClick={() =>
                      window.location.href =
                        `/dashboard/reports/${report.id}`
                    }
                  >
                    View
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}
