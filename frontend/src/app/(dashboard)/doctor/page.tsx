"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DoctorDashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.replace("/login");
            } else if (user.role !== "DOCTOR") {
                router.replace("/dashboard");
            }
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="text-center text-lg">Loading...</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Doctor Portal - {user?.full_name}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 font-medium mb-2">
                        Today's Appointments
                    </h3>
                    <p className="text-3xl font-bold text-blue-600">0</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 font-medium mb-2">
                        Pending Reviews
                    </h3>
                    <p className="text-3xl font-bold text-red-600">0</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 font-medium mb-2">
                        Total Patients
                    </h3>
                    <p className="text-3xl font-bold text-green-600">0</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 font-medium mb-2">
                        Unread Notifications
                    </h3>
                    <p className="text-3xl font-bold text-orange-600">0</p>
                </div>
            </div>
        </DashboardLayout>
    );
}