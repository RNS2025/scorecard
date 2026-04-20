import type { Game } from "../../utils/interfaces/Game.ts";
import type { Course } from "../../utils/interfaces/Course.ts";
import type { Player } from "../../utils/interfaces/Game.ts";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePublishScores } from "../../hooks/useLeaderboard.ts";
import type { LeaderboardEntry } from "../../utils/interfaces/Leaderboard.ts";
import { getHolePar, getTotalPar, getShotLabel } from "../../utils/parUtils.ts";

interface PublishForm {
    name: string;
    email: string;
    marketingConsent: boolean;
}

interface OverviewTabProps {
    game: Game;
    course: Course;
    getPlayerTotal: (player: Player) => number;
    getPlayerTotalDiff: (player: Player) => string;
    getPlayerDiffForHole: (score: number | null, par: number | undefined) => string | null;
    getDiffColor: (diff: string | null) => string;
    setAllowNavigation: (value: boolean) => void;
}

const StandingsTab = ({ game, course, getPlayerTotal, getPlayerTotalDiff, getPlayerDiffForHole, getDiffColor, setAllowNavigation }: OverviewTabProps) => {
    const navigate = useNavigate();
    const { mutate: publishScores, isPending: isPublishing } = usePublishScores();
    const [publishPlayers, setPublishPlayers] = useState<boolean[]>(game.players.map(() => false));
    const [step, setStep] = useState<"standings" | "publish">("standings");
    const [publishForms, setPublishForms] = useState<PublishForm[]>([]);
    const [marketingConsent, setMarketingConsent] = useState<boolean>(true);

    const allHolesPlayed = game.players.every((player) =>
        player.scores.every((s) => s !== null)
    );

    const togglePublish = (index: number) => {
        setPublishPlayers((prev) => {
            const updated = [...prev];
            updated[index] = !updated[index];
            return updated;
        });
    };

    const handleGoToPublish = () => {
        const selectedPlayers = game.players.filter((_, i) => publishPlayers[i]);
        setPublishForms(selectedPlayers.map((p) => ({
            name: p.name,
            email: p.email ?? "",
            marketingConsent: false,
        })));
        setStep("publish");
    };

    const updateForm = (index: number, field: keyof PublishForm, value: string | boolean) => {
        setPublishForms((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const allFormsValid = publishForms.every((f) => f.name.trim() && f.email.trim());

    const handlePublish = () => {
        const confirmPublish = confirm(`Er du sikker på, at du vil publicere disse resultater?`);
        if (!confirmPublish) return;

        if (!allFormsValid) return;

        const selectedOriginalIndices = game.players
            .map((_, i) => i)
            .filter((i) => publishPlayers[i]);

        const entries: Omit<LeaderboardEntry, "id" | "createdAt">[] = publishForms.map((f, i) => {
            const player = game.players[selectedOriginalIndices[i]];
            const totalShots = player.scores.reduce((sum: number, s) => sum + (s ?? 0), 0);
            const totalPar = course.holes.reduce((sum, _h, hi) => player.scores[hi] !== null ? sum + (getHolePar(course, hi) ?? 0) : sum, 0);
            return {
                playerName: f.name,
                email: f.email,
                marketingConsent,
                scores: player.scores,
                totalShots,
                totalDiff: totalShots - totalPar,
                courseId: course.id!,
                courseName: course.name,
                gameId: game.id!,
                format: game.format,
            };
        });

        publishScores(entries, {
            onSuccess: () => {
                setAllowNavigation(true);
                navigate(`/${course.id}/leaderboard`);
            },
            onError: (e) => {
                alert("Noget gik galt – prøv igen.")
                console.log("Publish error:", e);
            },
        });
    };

    // ==================== PUBLISH STEP ====================
    if (step === "publish") {
        return (
            <div className="px-3 py-5">
                <button
                    onClick={() => setStep("standings")}
                    className="text-sm mb-4 transition"
                >
                    ← Tilbage til stilling
                </button>

                <h2 className="text-lg font-bold mb-1">Bekræft dine oplysninger</h2>
                <p className="text-sm text-gray-500 mb-5">
                    Udfyld gerne dit fulde navn email så vi kan skelne dig fra andre spillere
                </p>

                <div className="flex flex-col gap-6">
                    {publishForms.map((form, i) => (
                        <div key={i} className="shadow-lg rounded-xl p-4 flex flex-col gap-3">
                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
                                Spiller {i + 1}
                            </p>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium">Navn</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => updateForm(i, "name", e.target.value)}
                                    placeholder="Fornavn Efternavn"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium">E-mail <span className="text-red-500">*</span></label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => updateForm(i, "email", e.target.value)}
                                    placeholder="din@email.dk"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <label className="flex items-start gap-2 cursor-pointer mt-6">
                    <input
                        type="checkbox"
                        checked={marketingConsent}
                        onChange={(e) => setMarketingConsent(e.target.checked)}
                        className="mt-1 accent-green-700"
                    />
                    <span className="text-xs text-gray-500">
                        Ja tak, vi vil gerne modtage nyheder og tilbud fra {course.name} på e-mail.
                        Du kan til enhver tid trække dit samtykke tilbage.
                    </span>
                </label>

                <button
                    onClick={handlePublish}
                    disabled={!allFormsValid || isPublishing}
                    className="w-full mt-4 bg-linear-to-r from-green-500 to-green-800 text-white font-bold rounded-lg py-3 px-4 transition disabled:opacity-30"
                >
                    {isPublishing
                        ? "Publicerer..."
                        : `Publicér ${publishForms.length} ${publishForms.length === 1 ? "resultat" : "resultater"}`
                    }
                </button>
            </div>
        );
    }

    // ==================== STANDINGS STEP ====================
    return (
        <div className="px-3 py-5">
            {/* Stilling */}
            <div className="flex flex-col gap-3 mb-6">
                {[...game.players]
                    .map((player, originalIndex) => ({ player, originalIndex }))
                    .sort((a, b) => getPlayerTotal(a.player) - getPlayerTotal(b.player))
                    .map(({ player, originalIndex }, i) => (
                        <div key={originalIndex} className="flex items-center justify-between shadow-lg rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                                    ${i === 0 ? "bg-yellow-400 text-white" : "bg-gray-100 text-gray-500"}`}>
                                    {i + 1}
                                </span>
                                <div>
                                    <p className="font-semibold">{player.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <p className="text-lg font-bold">{getPlayerTotal(player)} {getShotLabel(course.sport)}</p>
                                    <p className={`text-xs ${getDiffColor(getPlayerTotalDiff(player))}`}>
                                        {getPlayerTotalDiff(player)}
                                    </p>
                                </div>
                                {allHolesPlayed && (
                                    <button
                                        onClick={() => togglePublish(originalIndex)}
                                        className={`w-6 h-6 rounded border-2 flex items-center justify-center transition
                                            ${publishPlayers[originalIndex]
                                                ? "bg-green-700 border-green-700 text-white"
                                                : "border-gray-300 text-transparent"}`}
                                    >
                                        ✓
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                {/* Del kamp */}
                {allHolesPlayed && (
                    <button
                        onClick={() => {
                            const url = `${window.location.origin}/${course.id}/game/${game.id}/score-only`;
                            navigator.clipboard.writeText(url).then();
                            alert("Link kopieret!");
                        }}
                        className="w-full shadow-xl text-green-700 font-bold rounded-lg py-3 px-4 transition hover:bg-green-50"
                    >
                        🔗 Del kamp
                    </button>
                )}
            </div>

            {/* Publicerings-sektion */}
            {allHolesPlayed && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-center">
                    <p className="text-sm text-green-800 font-medium mb-3">
                        Tilfreds med runden? Publicér din score til ranglisten!
                    </p>
                    <p className="text-xs text-green-600 mb-4">
                        Marker spillere med checkboxen ved siden af scoren
                    </p>
                    <button
                        onClick={handleGoToPublish}
                        disabled={!publishPlayers.some((p) => p)}
                        className="w-full bg-linear-to-r from-green-500 to-green-800 text-white font-bold rounded-lg py-3 px-4 transition disabled:opacity-30"
                    >
                        Publicér {publishPlayers.filter((p) => p).length} {publishPlayers.filter((p) => p).length === 1 ? "resultat" : "resultater"}
                    </button>
                </div>
            )}

            {/* Detaljeret scorekort */}
            <div className="overflow-x-auto rounded-xl shadow-lg">
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
                        {/* Total-række */}
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
    );
};

export default StandingsTab;

