import { useParams, useNavigate } from "react-router-dom";
import { useLeaderboard } from "../../hooks/useLeaderboard.ts";
import { useCourse } from "../../hooks/useCourses.ts";
import { useState } from "react";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import { TrophyIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";
import scorecard_logo from "../../assets/scorecard logo.png";

type Period = "all" | "month" | "week";

const periodLabels: Record<Period, string> = {
    all: "All-time",
    month: "Seneste måned",
    week: "Seneste uge",
};

const LeaderboardPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { data: course, isLoading: courseLoading } = useCourse(String(courseId));
    const [period, setPeriod] = useState<Period>("all");
    const { data: entries, isLoading: lbLoading } = useLeaderboard(courseId, period);

    const isLoading = courseLoading || lbLoading;

    const getDiffLabel = (diff: number) => {
        if (diff === 0) return "Par";
        return diff > 0 ? `+${diff}` : `${diff}`;
    };

    const getDiffColor = (diff: number) => {
        if (diff === 0) return "text-gray-500";
        if (diff < 0) return "text-green-600";
        return "text-red-500";
    };

    const getMedalColor = (position: number) => {
        if (position === 0) return "bg-yellow-400 text-white";
        if (position === 1) return "bg-gray-300 text-white";
        if (position === 2) return "bg-amber-600 text-white";
        return "bg-gray-100 text-gray-500";
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-linear-to-r from-green-600 to-green-800 text-white px-5 pt-5 pb-6">
                <div className="flex items-center gap-3 mb-4">
                    <button onClick={() => navigate(`/${courseId}/creategame`)} className="p-1 hover:bg-white/10 rounded-lg transition">
                        <ArrowLeftIcon className="w-5 h-5" />
                    </button>
                    <img src={scorecard_logo} alt="Scorecard" className="w-10" />
                </div>

                <div className="flex items-center gap-3 mb-1">
                    <TrophyIcon className="w-7 h-7 text-yellow-300" />
                    <h1 className="text-2xl font-bold">Rangliste</h1>
                </div>

                {course && (
                    <p className="text-green-200 text-sm ml-10">
                        {course.name} · {course.numberOfHoles} huller · Par {course.par}
                    </p>
                )}
            </div>

            {/* Period tabs */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="flex">
                    {(Object.keys(periodLabels) as Period[]).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`flex-1 py-3 text-sm font-semibold transition
                                ${period === p
                                    ? "border-b-2 border-green-600 text-green-700"
                                    : "text-gray-400 hover:text-gray-600"}`}
                        >
                            {periodLabels[p]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="px-4 py-5">
                {isLoading && (
                    <p className="text-center mt-10 animate-pulse text-gray-400">Henter rangliste...</p>
                )}

                {!isLoading && (!entries || entries.length === 0) && (
                    <div className="text-center mt-16">
                        <TrophyIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">Ingen resultater endnu</p>
                        <p className="text-gray-400 text-sm mt-1">
                            {period === "all"
                                ? "Spil en runde og publicér din score!"
                                : "Ingen resultater i denne periode"}
                        </p>
                    </div>
                )}

                {!isLoading && entries && entries.length > 0 && (
                    <>
                        {/* Top 3 podium */}
                        {entries.length >= 3 && (
                            <div className="flex items-end justify-center gap-3 mb-8 mt-2">
                                {/* 2. plads */}
                                <div className="flex flex-col items-center">
                                    <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center text-white text-xl font-bold shadow-md">
                                        2
                                    </div>
                                    <p className="text-sm font-semibold mt-2 text-center leading-tight max-w-20 truncate">
                                        {entries[1].playerName.split(" ")[0]}
                                    </p>
                                    <p className="text-xs text-gray-500">{entries[1].totalShots} spark</p>
                                    <p className={`text-xs font-bold ${getDiffColor(entries[1].totalDiff)}`}>
                                        {getDiffLabel(entries[1].totalDiff)}
                                    </p>
                                </div>

                                {/* 1. plads */}
                                <div className="flex flex-col items-center -mt-4">
                                    <div className="w-18 h-18 rounded-full bg-yellow-400 flex items-center justify-center text-white text-2xl font-bold shadow-lg ring-4 ring-yellow-200">
                                        👑
                                    </div>
                                    <p className="text-sm font-bold mt-2 text-center leading-tight max-w-22.5 truncate">
                                        {entries[0].playerName.split(" ")[0]}
                                    </p>
                                    <p className="text-xs text-gray-500">{entries[0].totalShots} spark</p>
                                    <p className={`text-xs font-bold ${getDiffColor(entries[0].totalDiff)}`}>
                                        {getDiffLabel(entries[0].totalDiff)}
                                    </p>
                                </div>

                                {/* 3. plads */}
                                <div className="flex flex-col items-center">
                                    <div className="w-14 h-14 rounded-full bg-amber-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
                                        3
                                    </div>
                                    <p className="text-sm font-semibold mt-2 text-center leading-tight max-w-20 truncate">
                                        {entries[2].playerName.split(" ")[0]}
                                    </p>
                                    <p className="text-xs text-gray-500">{entries[2].totalShots} spark</p>
                                    <p className={`text-xs font-bold ${getDiffColor(entries[2].totalDiff)}`}>
                                        {getDiffLabel(entries[2].totalDiff)}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Full list */}
                        <div className="flex flex-col gap-2">
                            {entries.map((entry, i) => (
                                <div
                                     key={`${entry.id}-${i}`}
                                    className={`flex items-center gap-3 bg-white rounded-xl p-4 transition`}
                                >
                                    {/* Position */}
                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                                        ${getMedalColor(i)}`}>
                                        {i + 1}
                                    </span>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold truncate">{entry.playerName}</p>
                                        <p className="text-xs text-gray-400">
                                            {entry.createdAt
                                                ? format(new Date(entry.createdAt), "d. MMM yyyy", { locale: da })
                                                : "—"}
                                        </p>
                                    </div>

                                    {/* Score */}
                                    <div className="text-right shrink-0">
                                        <p className="text-lg font-bold">{entry.totalShots}</p>
                                        <p className={`text-xs font-bold ${getDiffColor(entry.totalDiff)}`}>
                                            {getDiffLabel(entry.totalDiff)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Stats summary */}
                        {entries.length >= 2 && (
                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <div className="bg-white rounded-xl p-3 text-center">
                                    <p className="text-xl font-bold text-green-700">
                                        {Math.min(...entries.map((e) => e.totalShots))}
                                    </p>
                                    <p className="text-xs text-gray-400">Bedste score</p>
                                </div>
                                <div className="bg-white rounded-xl p-3 text-center">
                                    <p className="text-xl font-bold text-gray-700">
                                        {entries.length}
                                    </p>
                                    <p className="text-xs text-gray-400">Runder spillet</p>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* CTA */}
                <button
                    onClick={() => navigate(courseId ? `/${courseId}/creategame` : "/")}
                    className="w-full mt-8 bg-linear-to-r from-green-500 to-green-800 text-white font-bold rounded-lg py-3 px-4 transition hover:opacity-90"
                >
                    Spil en ny runde
                </button>
            </div>
        </div>
    );
};

export default LeaderboardPage;