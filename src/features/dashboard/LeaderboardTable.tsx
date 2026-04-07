import { TrophyIcon } from "@heroicons/react/24/solid";
import type { LeaderboardEntry } from "../../utils/interfaces/Leaderboard.ts";
import { getShotHeader } from "../../utils/parUtils.ts";

interface LeaderboardTableProps {
    entries?: LeaderboardEntry[];
    getDiffLabel: (diff: number) => string;
    getDiffColor: (diff: number) => string;
    getMedalColor: (pos: number) => string;
    sport?: string;
    parMode?: string;
}

const LeaderboardTable = ({ entries, getDiffLabel, getDiffColor, getMedalColor, sport, parMode }: LeaderboardTableProps) => {
    if (!entries || entries.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-white/5 rounded-2xl">
                <TrophyIcon className="w-12 h-12 text-white/10" />
                <p className="text-white/30">Ingen resultater endnu</p>
            </div>
        );
    }

    const displayEntries = entries.slice(0, 10);

    return (
        <div className="flex-1 overflow-hidden rounded-2xl bg-white/5 flex flex-col">
            <table className="w-full flex-1">
                <thead>
                    <tr className="text-white/40 uppercase tracking-wider border-b border-white/10">
                        <th className="py-3 px-4 text-left w-12"></th>
                        <th className="py-3 px-4 text-left">Spiller</th>
                        <th className="py-3 px-4 text-center">{getShotHeader(sport)}</th>
                        {parMode !== "calculated" && (
                        <th className="py-3 px-4 text-center">Score</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {displayEntries.map((entry, i) => (
                        <tr key={`${entry.id}-${i}`}
                            className={`border-b border-white/5 text-2xl`}
                            style={{ height: `${100 / displayEntries.length}%` }}>
                            <td className="px-4">
                                <span className={`size-10 rounded-full flex items-center justify-center font-bold ${getMedalColor(i)}`}>
                                    {i + 1}
                                </span>
                            </td>
                            <td className="px-4 font-semibold">{entry.playerName}</td>
                            <td className="px-4 text-center text-white">{entry.totalShots}</td>
                            {parMode !== "calculated" && (
                            <td className={`px-4 text-center font-bold ${getDiffColor(entry.totalDiff)}`}>
                                {getDiffLabel(entry.totalDiff)}
                            </td>
                                )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LeaderboardTable;
