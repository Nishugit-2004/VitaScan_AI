"use client";

import jsPDF from "jspdf";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

interface Report {
  id: string;
  disease: string;
  prediction: string;
  confidence: number;
  image_path: string;
  created_at: string;
}

export default function ReportDetailsPage() {
  const { id } = useParams();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const res = await axios.get(
          `http://127.0.0.1:8000/api/v1/medical/reports/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setReport(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchReport();
  }, [id]);

  if (loading)
    return (
      <div className="p-10 text-xl font-semibold">
        Loading report...
      </div>
    );

  if (!report)
    return (
      <div className="p-10 text-red-600 text-xl">
        Report not found.
      </div>
    );

  const imageUrl = report.image_path
    ? `http://127.0.0.1:8000/${report.image_path.replace(/\\/g, "/")}`
    : "";

    const diseaseRecommendations: Record<
        string,
        {
            risk: string;
            riskColor: string;
            doctor: string;
            tests: string[];
            advice: string[];
        }
        > = {
        Malaria: {
            risk: "Medium",
            riskColor: "text-yellow-600",
            doctor: "General Physician / Infectious Disease Specialist",
            tests: [
            "Peripheral Blood Smear",
            "Rapid Malaria Test",
            "Complete Blood Count"
            ],
            advice: [
            "Stay hydrated.",
            "Complete the prescribed antimalarial medication.",
            "Monitor fever regularly.",
            "Seek emergency care if symptoms worsen."
            ]
        },

        "Breast Cancer": {
            risk: "High",
            riskColor: "text-red-600",
            doctor: "Oncologist",
            tests: [
            "Biopsy",
            "Mammography",
            "MRI (if recommended)"
            ],
            advice: [
            "Consult an oncologist immediately.",
            "Schedule follow-up investigations.",
            "Discuss treatment options.",
            "Attend regular screenings."
            ]
        },

        Dementia: {
            risk: "Medium",
            riskColor: "text-orange-600",
            doctor: "Neurologist",
            tests: [
            "MRI Brain",
            "Cognitive Assessment",
            "Blood Tests"
            ],
            advice: [
            "Consult a neurologist.",
            "Maintain physical activity.",
            "Keep mentally active.",
            "Attend periodic follow-up visits."
            ]
        },

        Anemia: {
            risk: "Low",
            riskColor: "text-green-600",
            doctor: "General Physician",
            tests: [
            "Complete Blood Count",
            "Iron Profile",
            "Vitamin B12 Test"
            ],
            advice: [
            "Increase iron-rich foods.",
            "Take supplements if prescribed.",
            "Repeat blood tests after treatment.",
            "Maintain a balanced diet."
            ]
        }
    };

    const recommendation =
        diseaseRecommendations[report.disease] ??
        diseaseRecommendations["Anemia"];

    const downloadPDF = () => {
        if (!report) return;

        const pdf = new jsPDF();

        pdf.setFontSize(22);
        pdf.text("VitaScan AI", 20, 20);

        pdf.setFontSize(18);
        pdf.text("Medical Report", 20, 35);

        pdf.line(20, 40, 190, 40);

        pdf.setFontSize(14);

        pdf.text(`Disease: ${report.disease}`, 20, 55);
        pdf.text(`Prediction: ${report.prediction}`, 20, 68);
        pdf.text(`Confidence: ${report.confidence.toFixed(2)}%`, 20, 81);

        pdf.text(
            `Date: ${new Date(report.created_at).toLocaleString()}`,
            20,
            94
        );

        pdf.line(20, 105, 190, 105);

        pdf.setFontSize(16);
        pdf.text("AI Diagnosis Summary", 20, 120);

        pdf.setFontSize(12);

        const summary =
            `The uploaded image has been analyzed using VitaScan AI. ` +
            `The AI predicts "${report.prediction}" for "${report.disease}" ` +
            `with ${report.confidence.toFixed(2)}% confidence.`;

        const wrappedSummary = pdf.splitTextToSize(summary, 170);
        pdf.text(wrappedSummary, 20, 132);

        let y = 150;

        pdf.setFontSize(16);
        pdf.text("Recommendations", 20, y);

        y += 12;

        pdf.setFontSize(12);

        const recommendations = [
            "Consult the appropriate medical specialist.",
            "Do not rely solely on AI predictions.",
            "Perform additional laboratory tests if advised.",
            "Seek immediate medical attention if symptoms worsen."
        ];

        recommendations.forEach((item) => {
            pdf.text(`• ${item}`, 25, y);
            y += 10;
        });

        pdf.line(20, y + 5, 190, y + 5);

        pdf.setFontSize(10);

        pdf.text(
            "Generated automatically by VitaScan AI",
            20,
            y + 18
        );

        pdf.save(`${report.disease}_Medical_Report.pdf`);
    };

  return (
    <div className="p-10">

      <h1 className="text-4xl font-bold mb-8">
        Medical Report
      </h1>

      <div className="grid grid-cols-2 gap-8">

        <div className="space-y-5 bg-white rounded-xl shadow p-6">

          <div>
            <h2 className="font-semibold text-gray-500">
              Disease
            </h2>
            <p className="text-2xl font-bold">
              {report.disease}
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-500">
              Prediction
            </h2>
            <p className="text-xl">
              {report.prediction}
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-500">
              Confidence
            </h2>
            <p className="text-green-600 text-2xl font-bold">
              {report.confidence.toFixed(2)}%
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-500">
              Date
            </h2>
            <p>
              {new Date(report.created_at).toLocaleString()}
            </p>
          </div>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="font-semibold mb-4">
            Uploaded Image
          </h2>

          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Uploaded"
              className="rounded-lg border w-full max-h-[450px] object-contain"
            />
          ) : (
            <div className="text-gray-500">
              No image available.
            </div>
          )}

        </div>

      </div>

      <div className="mt-10 bg-white rounded-xl shadow p-6">

        <h2 className="text-2xl font-bold mb-4">
          AI Diagnosis Summary
        </h2>

        <p className="text-lg leading-8">
          The AI model predicts that the uploaded image belongs to
          <span className="font-bold"> {report.prediction}</span>
          {" "}for
          <span className="font-bold"> {report.disease}</span>
          {" "}with an overall confidence score of
          <span className="text-green-600 font-bold">
            {" "} {report.confidence.toFixed(2)}%
          </span>.
        </p>

      </div>

      <div className="mt-8 bg-white rounded-xl shadow p-6">

  <h2 className="text-2xl font-bold mb-6">
    AI Medical Recommendation
  </h2>

  <div className="grid grid-cols-2 gap-8">

    <div>

      <p className="font-semibold text-gray-600">
        Risk Level
      </p>

      <p className={`text-2xl font-bold ${recommendation.riskColor}`}>
        {recommendation.risk}
      </p>

      <div className="mt-6">

        <p className="font-semibold text-gray-600">
          Recommended Specialist
        </p>

        <p className="text-lg">
          {recommendation.doctor}
        </p>

      </div>

    </div>

    <div>

      <p className="font-semibold text-gray-600 mb-2">
        Suggested Tests
      </p>

      <ul className="list-disc pl-6 space-y-1">
        {recommendation.tests.map((test) => (
          <li key={test}>{test}</li>
        ))}
      </ul>

    </div>

  </div>

  <hr className="my-6"/>

  <h3 className="font-bold text-xl mb-3">
    Personalized Advice
  </h3>

  <ul className="list-disc pl-8 space-y-2">
    {recommendation.advice.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>

</div>

      <div className="mt-10">
        <button
  onClick={downloadPDF}
  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"
>
  Download PDF
</button>
      </div>

    </div>
  );
}