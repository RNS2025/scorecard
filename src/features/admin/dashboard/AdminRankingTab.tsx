import { useEffect, useState } from "react";
import { TrophyIcon } from "@heroicons/react/24/solid";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import type { LeaderboardEntry } from "../../../utils/interfaces/Leaderboard.ts";
import AdminService from "../../../services/AdminService.ts";

type Period = "all" | "month" | "week";

const monthNames = [
    "Januar", "Februar", "Marts", "April", "Maj", "Juni",
    "Juli", "August", "September", "Oktober", "November", "December"
];

const getDiffLabel = (diff: number) => {
    if (diff === 0) return "Par";
    return diff > 0 ? `+${diff}` : `${diff}`;
};

const getDiffColor = (diff: number) => {
    if (diff === 0) return "text-gray-500";
    if (diff < 0) return "text-green-600";
    return "text-red-500";
};

const AdminRankingTab = () => {
    const now = new Date();
    const [period, setPeriod] = useState<Period>("all");
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
    const [selectedYear, setSelectedYear] = useState(now.getFullYear());
    const [allEntries, setAllEntries] = useState<LeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch all entries once
    useEffect(() => {
        let cancelled = false;
        AdminService.getLeaderboard().then((data) => {
            if (!cancelled) {
                setAllEntries(data);
                setIsLoading(false);
            }
        }).catch(() => {
            if (!cancelled) setIsLoading(false);
        });
        return () => { cancelled = true; };
    }, []);

    // Filter client-side — pure derivation, no state
    const getFilteredLeaderboard = (): LeaderboardEntry[] => {
        if (period === "all") return allEntries;

        if (period === "week") {
            const startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return allEntries.filter(e => e.createdAt && new Date(e.createdAt) >= startDate);
        }

        if (period === "month") {
            const startDate = new Date(selectedYear, selectedMonth, 1);
            const endDate = new Date(selectedYear, selectedMonth + 1, 1);
            return allEntries.filter(e => {
                if (!e.createdAt) return false;
                const d = new Date(e.createdAt);
                return d >= startDate && d < endDate;
            });
        }

        return allEntries;
    };

    const leaderboard = getFilteredLeaderboard();

    // Generate year options from 2024 to current year
    const yearOptions: number[] = [];
    for (let y = now.getFullYear(); y >= 2026; y--) {
        yearOptions.push(y);
    }

    return (
        <div>
            {/* Period filter */}
            <div className="flex gap-2 mb-4">
                {([
                    { key: "all" as Period, label: "All-time" },
                    { key: "month" as Period, label: "Måned" },
                    { key: "week" as Period, label: "Uge" },
                ]).map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => setPeriod(key)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition
                            ${period === key
                                ? "bg-green-700 text-white"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Month/Year picker */}
            {period === "month" && (
                <div className="flex gap-2 mb-4">
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        {monthNames.map((name, i) => (
                            <option key={i} value={i}>{name}</option>
                        ))}
                    </select>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        {yearOptions.map((y) => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
            )}

            {isLoading && <p className="text-center animate-pulse text-gray-400">Henter rangliste...</p>}

            {!isLoading && (!leaderboard || leaderboard.length === 0) && (
                <div className="text-center mt-10">
                    <TrophyIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Ingen resultater i denne periode</p>
                </div>
            )}

            {!isLoading && leaderboard && leaderboard.length > 0 && (
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-green-700 text-white text-left">
                                <th className="py-2.5 px-3">#</th>
                                <th className="py-2.5 px-3">Navn</th>
                                <th className="py-2.5 px-3">Email</th>
                                <th className="py-2.5 px-3 text-center">Score</th>
                                <th className="py-2.5 px-3 text-center">Diff</th>
                                <th className="py-2.5 px-3">Dato</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboard.map((entry: LeaderboardEntry, i: number) => (
                                <tr key={entry.id ?? i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                    <td className="py-2.5 px-3 font-bold text-gray-400">{i + 1}</td>
                                    <td className="py-2.5 px-3 font-medium">{entry.playerName}</td>
                                    <td className="py-2.5 px-3 text-gray-500">{entry.email}</td>
                                    <td className="py-2.5 px-3 text-center font-bold">{entry.totalShots}</td>
                                    <td className={`py-2.5 px-3 text-center font-bold ${getDiffColor(entry.totalDiff)}`}>
                                        {getDiffLabel(entry.totalDiff)}
                                    </td>
                                    <td className="py-2.5 px-3 text-gray-400 whitespace-nowrap">
                                        {entry.createdAt
                                            ? format(new Date(entry.createdAt), "d. MMM yyyy", { locale: da })
                                            : "—"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminRankingTab;

