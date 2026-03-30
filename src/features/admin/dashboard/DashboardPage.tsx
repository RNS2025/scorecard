import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase/firebase.ts";
import { useAdminProfile, useAdminStats } from "../../../hooks/useAdmin.ts";
import {
    ArrowRightStartOnRectangleIcon,
    TrophyIcon,
    ChartBarIcon,
    EnvelopeIcon,
} from "@heroicons/react/24/solid";
import scorecard_logo from "../../../assets/scorecard logo.png";
import AdminOverviewTab from "./AdminOverviewTab.tsx";
import AdminRankingTab from "./AdminRankingTab.tsx";
import AdminMailsTab from "./AdminMailsTab.tsx";

type Tab = "oversigt" | "rangliste" | "mailliste";

const DashboardPage = () => {
    const navigate = useNavigate();
    const { data: profile, isLoading: profileLoading } = useAdminProfile();
    const { data: stats, isLoading: statsLoading } = useAdminStats();

    const [activeTab, setActiveTab] = useState<Tab>("oversigt");

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/admin");
    };

    if (profileLoading) {
        return <p className="text-center mt-20 animate-pulse">Indlæser dashboard...</p>;
    }

    if (!profile) {
        return <p className="text-center mt-20 text-red-500">Kunne ikke hente profil</p>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-linear-to-r from-green-600 to-green-800 text-white px-5 pt-5 pb-5">
                <div className="flex items-center justify-between mb-3">
                    <img src={scorecard_logo} alt="Scorecard" className="w-10" />
                    <button onClick={handleLogout} className="flex items-center gap-1.5 text-green-200 hover:text-white text-sm transition">
                        <ArrowRightStartOnRectangleIcon className="w-4 h-4" />
                        Log ud
                    </button>
                </div>
                <h1 className="text-xl font-bold">{profile.courseName}</h1>
                <p className="text-green-200 text-sm">Admin Dashboard</p>
            </div>

            {/* Tab-bar */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="flex">
                    {([
                        { key: "oversigt" as Tab, label: "Overblik", icon: ChartBarIcon },
                        { key: "rangliste" as Tab, label: "Rangliste", icon: TrophyIcon },
                        { key: "mailliste" as Tab, label: "Mailliste", icon: EnvelopeIcon },
                    ]).map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`flex-1 py-3 flex items-center justify-center gap-1.5 text-sm font-semibold transition
                                ${activeTab === key
                                    ? "border-b-2 border-green-600 text-green-700"
                                    : "text-gray-400 hover:text-gray-600"}`}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="px-4 py-5">
                {activeTab === "oversigt" && <AdminOverviewTab stats={stats} isLoading={statsLoading} />}
                {activeTab === "rangliste" && <AdminRankingTab />}
                {activeTab === "mailliste" && <AdminMailsTab />}
            </div>
        </div>
    );
};

export default DashboardPage;
