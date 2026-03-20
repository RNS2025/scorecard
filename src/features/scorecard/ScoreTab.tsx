import type { Game } from "../../utils/interfaces/Game.ts";
import type { Course } from "../../utils/interfaces/Course.ts";

interface ScoreTabProps {
    game: Game;
    course: Course;
    currentHole: number;
    setCurrentHole: (hole: number) => void;
    onScoreChange: (playerIndex: number, value: number | null) => void;
    getPlayerDiffForHole: (score: number | null, par: number) => string | null;
    getDiffColor: (diff: string | null) => string;
}

const ScoreTab = ({ game, course, currentHole, setCurrentHole, onScoreChange, getPlayerDiffForHole, getDiffColor }: ScoreTabProps) => {
    const hole = course.holes[currentHole];

    return (
        <div className="px-5 pt-5">
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
                        <span>Par <span className="font-bold text-gray-800">{hole.par}</span></span>
                        <span>{hole.length}m</span>
                    </div>
                </div>
            </div>

            {/* Score-input per spiller */}
            <div className="flex flex-col gap-4">
                {game.players.map((player, playerIndex) => {
                    const score = player.scores[currentHole];
                    return (
                        <div key={playerIndex} className="flex items-center justify-between bg-white border rounded-xl p-4">
                            <div>
                                <p className="font-semibold">{player.name}</p>
                                <p className={`text-xs ${getDiffColor(getPlayerDiffForHole(score, hole.par))}`}>
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => onScoreChange(playerIndex, Math.max(1, (score ?? 2) - 1))}
                                    className="w-10 h-10 rounded-full bg-gray-100 text-lg font-bold text-gray-600 hover:bg-gray-200 transition"
                                >
                                    −
                                </button>
                                <span className="w-8 text-center text-xl font-bold">
                                    {score ?? "—"}
                                </span>
                                <button
                                    onClick={() => onScoreChange(playerIndex, (score ?? 0) + 1)}
                                    className="w-10 h-10 rounded-full bg-gray-100 text-lg font-bold text-gray-600 hover:bg-gray-200 transition"
                                >
                                    +
                                </button>
                            </div>
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
                    onClick={() => setCurrentHole(Math.min(course.holes.length - 1, currentHole + 1))}
                    className={`${currentHole === course.holes.length - 1 ? "hidden" : ""} px-5 py-2 rounded-lg text-sm font-medium bg-green-700 text-white disabled:opacity-30 transition`}
                >
                    Næste →
                </button>
            </div>
        </div>
    );
};

export default ScoreTab;

