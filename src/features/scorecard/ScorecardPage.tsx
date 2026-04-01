import {useNavigate, useParams} from "react-router-dom";
import { useGame, useUpdateGame } from "../../hooks/useGame.ts";
import { useCourse } from "../../hooks/useCourses.ts";
import { useState } from "react";
import type { Player } from "../../utils/interfaces/Game.ts";
import type { Game } from "../../utils/interfaces/Game.ts";
import ScoreTab from "./ScoreTab.tsx";
import StandingsTab from "./StandingsTab.tsx";
import { useCourseImage } from "../../hooks/useCourseImage.ts";

const ScorecardPage = () => {
    const { courseId, gameId } = useParams();
    const { data: game, isLoading: gameLoading } = useGame(String(gameId));
    const { data: course, isLoading: courseLoading } = useCourse(String(courseId));
    const { mutate: updateGame } = useUpdateGame();
    const navigate = useNavigate();
    const { data: logoUrl } = useCourseImage(String(courseId), "logo");


    const [activeTab, setActiveTab] = useState<"score" | "oversigt">("score");
    const [currentHole, setCurrentHole] = useState<number>(0);
    const [localPlayers, setLocalPlayers] = useState<Player[] | null>(null);


    const saveToServer = (players: Player[]) => {
        if (!game) return;
        updateGame({ ...game, players });
    };

    if (gameLoading || courseLoading) return <p className="text-center mt-20 animate-pulse">Henter spil...</p>;
    if (!game || !course) return <p className="text-center mt-20 text-red-500">Kunne ikke hente spillet</p>;

    const currentPlayers = localPlayers ?? game.players;
    const workingGame: Game = { ...game, players: currentPlayers };

    const handleScoreChange = (playerIndex: number, value: number | null) => {
        const updatedPlayers: Player[] = currentPlayers.map((player, i) => {
            if (i !== playerIndex) return player;
            const updatedScores = [...player.scores];
            updatedScores[currentHole] = value;
            return { ...player, scores: updatedScores };
        });

        setLocalPlayers(updatedPlayers);
    };

    const handleHoleChange = (newHole: number) => {
        saveToServer(currentPlayers);
        setCurrentHole(newHole);
    };

    const handleTabChange = (tab: "score" | "oversigt") => {
        if (activeTab === "score") {
            saveToServer(currentPlayers);
        }
        setActiveTab(tab);
    };

    const getPlayerTotal = (player: Player) =>
        player.scores.reduce((sum: number, s) => sum + (s ?? 0), 0);

    const getPlayerDiffForHole = (score: number | null, par: number) => {
        if (score === null) return null;
        const diff = score - par;
        if (diff === 0) return "Par";
        return diff > 0 ? `+${diff}` : `${diff}`;
    };

    const getPlayerTotalDiff = (player: Player) => {
        let totalPar = 0;
        let totalScore = 0;
        player.scores.forEach((s, i) => {
            if (s !== null) {
                totalScore += s;
                totalPar += course.holes[i].par;
            }
        });
        if (totalScore === 0) return "-";
        const diff = totalScore - totalPar;
        if (diff === 0) return "Par";
        return diff > 0 ? `+${diff}` : `${diff}`;
    };

    const getDiffColor = (diff: string | null) => {
        if (!diff || diff === "-") return "";
        if (diff === "Par") return "text-gray-500";
        if (diff.startsWith("-")) return "text-green-600 font-bold";
        return "text-red-500 font-bold";
    };

    return (
        <div>
            {/* Header */}
            <div className="bg-linear-to-r from-green-600 to-green-800 text-white px-5 py-4 flex justify-between items-center">
                <div className="flex flex-col gap-1">
                    <h1 className="text-lg font-bold">{game.name}</h1>
                </div>

                <span onClick={() => {
                    const newRound = confirm("Er du sikker på at du vil afslutte runden? Denne runde bliver ikke gemt.");
                    if (newRound) {
                        navigate(`/${courseId}/creategame`)
                    }
                }}>Afslut runde</span>
            </div>

            {/* Tab-bar */}
            <div className="grid grid-cols-2">
                <button
                    onClick={() => handleTabChange("score")}
                    className={`py-3 text-sm font-semibold transition
                        ${activeTab === "score"
                            ? "border-b-2 border-green-600 text-green-700"
                            : "text-gray-400"}`}
                >
                    Indtast score
                </button>
                <button
                    onClick={() => handleTabChange("oversigt")}
                    className={`py-3 text-sm font-semibold transition
                        ${activeTab === "oversigt"
                            ? "border-b-2 border-green-600 text-green-700"
                            : "text-gray-400"}`}
                >
                    Stilling
                </button>
            </div>

            {activeTab === "score" && (
                <ScoreTab
                    game={workingGame}
                    course={course}
                    currentHole={currentHole}
                    setCurrentHole={handleHoleChange}
                    onScoreChange={handleScoreChange}
                    getPlayerDiffForHole={getPlayerDiffForHole}
                    getDiffColor={getDiffColor}
                    goToStandingsTab={() => handleTabChange("oversigt")}
                />
            )}

            {activeTab === "oversigt" && (
                <StandingsTab
                    game={workingGame}
                    course={course}
                    getPlayerTotal={getPlayerTotal}
                    getPlayerTotalDiff={getPlayerTotalDiff}
                    getPlayerDiffForHole={getPlayerDiffForHole}
                    getDiffColor={getDiffColor}
                />
            )}

            {/* Banelogo */}
            {logoUrl && (
                <div className="flex justify-center py-8">
                    <img src={logoUrl} alt="Banens logo" className="h-12 object-contain" />
                </div>
            )}
        </div>

);
};

export default ScorecardPage;

