import { EnvelopeIcon } from "@heroicons/react/24/solid";
import type { AdminStats } from "../../../services/AdminService.ts";

interface AdminOverviewTabProps {
    stats: AdminStats | undefined;
    isLoading: boolean;
}

const getDiffLabel = (diff: number) => {
    if (diff === 0) return "Par";
    return diff > 0 ? `+${diff}` : `${diff}`;
};

const getDiffColor = (diff: number) => {
    if (diff === 0) return "text-gray-500";
    if (diff < 0) return "text-green-600";
    return "text-red-500";
};

const AdminOverviewTab = ({ stats, isLoading }: AdminOverviewTabProps) => {
    if (isLoading) return <p className="text-center animate-pulse text-gray-400">Henter statistik...</p>;

    if (!stats) return null;

    return (
        <div>
            {/* Primære stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white border rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-green-700">{stats.totalRounds}</p>
                    <p className="text-xs text-gray-400 mt-1">Publicerede runder</p>
                </div>
                <div className="bg-white border rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-green-700">{stats.uniquePlayers}</p>
                    <p className="text-xs text-gray-400 mt-1">Unikke spillere</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white border rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold">{stats.avgScore || "—"}</p>
                    <p className="text-xs text-gray-400 mt-1">Gns. score</p>
                </div>
                <div className="bg-white border rounded-xl p-4 text-center">
                    <p className={`text-3xl font-bold ${stats.bestScore !== null ? getDiffColor(stats.bestScore) : ""}`}>
                        {stats.bestScore !== null ? getDiffLabel(stats.bestScore) : "—"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Bedste diff</p>
                </div>
            </div>

            {/* Aktivitet */}
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Aktivitet</h2>
            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white border rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <p className="text-xs text-gray-400">Denne uge</p>
                    </div>
                    <p className="text-2xl font-bold">{stats.roundsThisWeek}</p>
                    <p className="text-xs text-gray-400">runder</p>
                </div>
                <div className="bg-white border rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <p className="text-xs text-gray-400">Denne måned</p>
                    </div>
                    <p className="text-2xl font-bold">{stats.roundsThisMonth}</p>
                    <p className="text-xs text-gray-400">runder</p>
                </div>
            </div>

            {/* Marketing */}
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Marketing</h2>
            <div className="bg-white border rounded-xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <EnvelopeIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                    <p className="text-2xl font-bold">{stats.uniqueMarketingEmails}</p>
                    <p className="text-xs text-gray-400">unikke emails med marketing-samtykke</p>
                </div>
            </div>
        </div>
    );
};

export default AdminOverviewTab;

