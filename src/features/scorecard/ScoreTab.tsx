import { useState } from "react";
import { useParams } from "react-router-dom";
import type { Game } from "../../utils/interfaces/Game.ts";
import type { Course } from "../../utils/interfaces/Course.ts";
import ScoreModal from "./ScoreModal.tsx";
import { getScoreOptions } from "./scoreUtils.ts";
import RulesModal from "../createGame/RulesModal.tsx";
import HoleDescriptionModal from "./HoleDescriptionModal.tsx";
import { getHolePar } from "../../utils/parUtils.ts";

interface ScoreTabProps {
    game: Game;
    course: Course;
    currentHole: number;
    setCurrentHole: (hole: number) => void;
    onScoreChange: (playerIndex: number, value: number | null) => void;
    getPlayerDiffForHole: (score: number | null, par: number | undefined) => string | null;
    getDiffColor: (diff: string | null) => string;
    goToStandingsTab: () => void;
}

const ScoreTab = ({ game, course, currentHole, setCurrentHole, onScoreChange, getPlayerDiffForHole, getDiffColor, goToStandingsTab }: ScoreTabProps) => {
    const { courseId } = useParams();
    const hole = course.holes[currentHole];
    const holePar = getHolePar(course, currentHole);
    const [activePlayerIndex, setActivePlayerIndex] = useState<number | null>(null);
    const scoreOptions = getScoreOptions(course.sport ?? "", holePar ?? 0);
    const [rulesModalOpen, setRulesModalOpen] = useState(false);
    const [holeDescModalOpen, setHoleDescModalOpen] = useState(false);


    return (
        <div className="px-5 pt-5">
            {/* Score Modal */}
            {activePlayerIndex !== null && (
                <ScoreModal
                    open={true}
                    onClose={() => setActivePlayerIndex(null)}
                    playerName={game.players[activePlayerIndex].name}
                    holeNumber={hole.number}
                    holePar={holePar ?? 0}
                    sport={course.sport ?? ""}
                    options={scoreOptions}
                    currentScore={game.players[activePlayerIndex].scores[currentHole]}
                    onSelectScore={(value) => onScoreChange(activePlayerIndex, value)}
                />
            )}
            {/* Hul-vælger */}
            <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
                {course.holes.map((h, i) => {
                    const allFilled = game.players.every((p) => p.scores[i] !== null);
                    return (
                        <button
                            key={h.number}
                            onClick={() => setCurrentHole(i)}
                            className={`shrink-0 w-10 h-10 rounded-full text-sm font-bold transition
                                ${currentHole === i
                                    ? "bg-green-700 text-white"
                                    : allFilled
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-500"}`}
                        >
                            {h.number}
                        </button>
                    );
                })}
            </div>

            {/* Hul-info */}
            <div className="mb-5">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Hul {hole.number}</h2>
                    <div className="flex gap-4 text-sm text-gray-500">
                        {holePar !== undefined && (
                            <span>Par <span className="font-bold text-gray-800">{holePar}</span></span>
                        )}
                        {hole.length !== undefined && <span>{hole.length}m</span>}
                    </div>
                </div>
            </div>

            {/* Score-input per spiller */}
            <div className="flex flex-col gap-4">
                {game.players.map((player, playerIndex) => {
                    const score = player.scores[currentHole];
                    return (
                        <div key={playerIndex} className="flex items-center justify-between shadow-lg rounded-xl p-4">
                            <div>
                                <p className="font-semibold">{player.name}</p>
                                {holePar !== undefined && (
                                    <p className={`text-xs ${getDiffColor(getPlayerDiffForHole(score, holePar))}`}>
                                        {getPlayerDiffForHole(score, holePar)}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={() => setActivePlayerIndex(playerIndex)}
                                className={`w-14 h-14 rounded-xl text-xl font-bold transition
                                    ${score !== null
                                        ? "bg-green-700 text-white"
                                        : "bg-gray-100 text-gray-400 border-2 border-dashed border-gray-300"}`}
                            >
                                {score ?? "—"}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
                <button
                    onClick={() => setCurrentHole(Math.max(0, currentHole - 1))}
                    disabled={currentHole === 0}
                    className="px-5 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 disabled:opacity-30 transition"
                >
                    ← Forrige
                </button>
                <button
                    onClick={() => {
                        if (currentHole < course.holes.length - 1) {
                            setCurrentHole(Math.min(course.holes.length - 1, currentHole + 1))
                        } else {
                            goToStandingsTab();
                        }
                    }}
                    className={`px-5 py-2 rounded-lg text-sm font-medium bg-green-700 text-white disabled:opacity-30 transition`}
                >
                    {currentHole === course.holes.length - 1 ? "Gå til stilling →" : "Næste →"}
                </button>
            </div>

            <div className="py-8 grid grid-cols-2 gap-2 text-sm">
                    <button
                        onClick={() => setHoleDescModalOpen(true)}
                        className="w-full shadow-md text-green-700 font-bold rounded-lg py-3 px-1 transition hover:bg-green-50"
                    >
                        ⛳ Banebeskrivelse
                    </button>
                    <HoleDescriptionModal
                        open={holeDescModalOpen}
                        onClose={() => setHoleDescModalOpen(false)}
                        courseId={courseId ?? ""}
                        holeNumber={hole.number}
                    />

                <button
                    onClick={() => setRulesModalOpen(true)}
                    className="w-full shadow-md text-green-700 font-bold rounded-lg py-3 px-1 transition hover:bg-green-50"
                >
                    📋 Læs regler
                </button>
                <RulesModal open={rulesModalOpen} onClose={() => setRulesModalOpen(false)} rules={course.rules ?? []} />
            </div>
        </div>
    );
};

export default ScoreTab;

