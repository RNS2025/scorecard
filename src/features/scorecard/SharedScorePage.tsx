import { useParams } from "react-router-dom";
import { useGame } from "../../hooks/useGame.ts";
import { useCourse } from "../../hooks/useCourses.ts";
import type { Player } from "../../utils/interfaces/Game.ts";
import { getHolePar, getTotalPar, getShotLabel, hasParData } from "../../utils/parUtils.ts";
import {format} from "date-fns";
import {da} from "date-fns/locale";

const SharedScorePage = () => {
    const { courseId, gameId } = useParams();
    const { data: game, isLoading: gameLoading } = useGame(String(gameId));
    const { data: course, isLoading: courseLoading } = useCourse(String(courseId));

    if (gameLoading || courseLoading) return <p className="text-center mt-20 animate-pulse">Henter scorekort...</p>;
    if (!game || !course) return <p className="text-center mt-20 text-red-500">Kunne ikke hente scorekortet</p>;

    const getPlayerTotal = (player: Player) =>
        player.scores.reduce((sum: number, s) => sum + (s ?? 0), 0);

    const getPlayerTotalDiff = (player: Player) => {
        if (!hasParData(course)) return "-";
        let totalPar = 0;
        let totalScore = 0;
        let hasAnyPar = false;
        player.scores.forEach((s, i) => {
            if (s !== null) {
                const hp = getHolePar(course, i);
                if (hp !== undefined) {
                    totalScore += s;
                    totalPar += hp;
                    hasAnyPar = true;
                }
            }
        });
        if (!hasAnyPar || totalScore === 0) return "-";
        const diff = totalScore - totalPar;
        if (diff === 0) return "Par";
        return diff > 0 ? `+${diff}` : `${diff}`;
    };

    const getPlayerDiffForHole = (score: number | null, par: number | undefined) => {
        if (score === null || par === undefined) return null;
        const diff = score - par;
        if (diff === 0) return "Par";
        return diff > 0 ? `+${diff}` : `${diff}`;
    };

    const getDiffColor = (diff: string | null) => {
        if (!diff || diff === "-") return "";
        if (diff === "Par") return "text-gray-500";
        if (diff.startsWith("-")) return "text-green-600 font-bold";
        return "text-red-500 font-bold";
    };

    const sorted = [...game.players]
        .map((player, originalIndex) => ({ player, originalIndex }))
        .sort((a, b) => getPlayerTotal(a.player) - getPlayerTotal(b.player));

    return (
        <div className="mx-auto">
            {/* Header */}
            <div className="bg-linear-to-r from-green-600 to-green-800 text-white px-5 py-5">
                <h1 className="text-xl font-bold">{game.name}</h1>
                <p className="text-green-200 text-sm mt-1">{game.createdAt && format(game.createdAt, 'dd/MM/yyyy', {locale: da})}</p>
                <p className="text-green-200 text-sm mt-1">
                    {course.name} · {course.numberOfHoles} huller
                    {getTotalPar(course) !== undefined && ` · Par ${getTotalPar(course)}`}
                </p>
                <p className="text-green-300 text-xs mt-1">{game.players.length} spillere</p>
            </div>

            {/* Stilling */}
            <div className="px-4 py-5 flex flex-col gap-3">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wide">Stilling</h2>
                {sorted.map(({ player, originalIndex }, i) => (
                    <div key={originalIndex} className="flex items-center justify-between shadow-lg rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                                ${i === 0 ? "bg-yellow-400 text-white" : "bg-gray-100 text-gray-500"}`}>
                                {i + 1}
                            </span>
                            <p className="font-semibold">{player.name}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-bold">{getPlayerTotal(player)} {getShotLabel(course.sport)}</p>
                            <p className={`text-xs ${getDiffColor(getPlayerTotalDiff(player))}`}>
                                {getPlayerTotalDiff(player)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Scorekort */}
            <div className="px-4 pb-8">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">Scorekort</h2>
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-green-700 text-white">
                                <th className="py-2 px-3 text-left sticky left-0 bg-green-700 w-[10%]">Hul</th>
                                <th className="py-2 px-2 text-center">Par</th>
                                {game.players.map((p, i) => (
                                    <th key={i} className="py-2 px-2 text-center">{p.name.split(" ")[0]}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {course.holes.map((h, holeIndex) => {
                                const hp = getHolePar(course, holeIndex);
                                return (
                                    <tr key={h.number} className={holeIndex % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                        <td className={`py-2 px-3 font-bold sticky left-0 ${holeIndex % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                                            {h.number}
                                        </td>
                                        <td className="py-2 px-2 text-center text-gray-400">{hp ?? "–"}</td>
                                        {game.players.map((player, pi) => {
                                            const score = player.scores[holeIndex];
                                            const diff = hp !== undefined ? getPlayerDiffForHole(score, hp) : null;
                                            return (
                                                <td key={pi} className={`py-2 px-2 text-center ${getDiffColor(diff)}`}>
                                                    {score ?? "—"}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                            <tr className="border-t-2 border-green-700 font-bold">
                                <td className="py-2 px-3 sticky left-0 bg-white">Total</td>
                                <td className="py-2 px-2 text-center text-gray-400">{getTotalPar(course) ?? "–"}</td>
                                {game.players.map((player, pi) => (
                                    <td key={pi} className={`py-2 px-2 text-center ${getDiffColor(getPlayerTotalDiff(player))}`}>
                                        {getPlayerTotal(player)}
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SharedScorePage;

