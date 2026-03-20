import { useParams, useNavigate } from "react-router-dom";
import { useCourse } from "../../hooks/useCourses.ts";
import { useCreateGame } from "../../hooks/useGame.ts";
import { useState } from "react";
import 'react-responsive-modal/styles.css';
import scorecard_logo from "../../assets/scorecard logo.png";
import {InformationCircleIcon} from "@heroicons/react/24/outline";
import Modal from "react-responsive-modal";
import type { Game } from "../../utils/interfaces/Game.ts";
import {da} from "date-fns/locale";
import {format as formatDate} from "date-fns";

const CreateGamePage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { data: course, isLoading, isError } = useCourse(String(courseId));
    const { mutate: createGame } = useCreateGame();

    const [format, setFormat] = useState<string>("slagspil");
    const [gameName, setGameName] = useState<string>("");
    const [modalOpen, setModalOpen] = useState(false);
    const [playerCount, setPlayerCount] = useState<number>(0);
    const [playerNames, setPlayerNames] = useState<string[]>([]);

    const handlePlayerCountChange = (count: number) => {
        setPlayerCount(count);
        setPlayerNames((prev) => {
            const updated = [...prev];
            if (count > updated.length) {
                return [...updated, ...Array(count - updated.length).fill("")];
            }
            return updated.slice(0, count);
        });
    };

    const handlePlayerNameChange = (index: number, name: string) => {
        setPlayerNames((prev) => {
            const updated = [...prev];
            updated[index] = name;
            return updated;
        });
    };

    const handleCreateGame = () => {
        if (!course || !courseId || playerCount === 0) return;
        if (playerNames.some((name) => !name.trim())) return;

        const defaultName = formatDate(new Date(), "dd/MM/yyyy", { locale: da });

        const game: Game = {
            courseId: courseId,
            name: gameName.trim() || defaultName,
            format: format as "slagspil" | "hulspil",
            numberOfPlayers: playerCount,
            players: playerNames.map((name) => ({
                name: name.trim(),
                scores: Array(course.numberOfHoles).fill(null),
            })),
            createdAt: new Date().toISOString(),
        };

        createGame(game, {
            onSuccess: (savedGame) => {
                navigate(`game/${savedGame.id}`);
            },
        });
    }



    if (isLoading) return <p className="text-center mt-20 animate-pulse">Henter information...</p>;
    if (isError || !course) return <p className="text-center mt-20 text-red-500">Der er sket en fejl. Prøv at genindlæs siden</p>;

    return (
        <div className="max-w-md mx-auto px-6 pb-10">
            {/* Header */}
            <div className="flex flex-col items-center pt-6 pb-4">
                <div className="w-full border-b flex justify-center">
                <img src={scorecard_logo} alt="Scorecard Logo" className="w-20" />
                </div>
            </div>

            {/* Bane-info kort */}
            <div className="bg-linear-to-br from-green-600 to-green-800 text-white rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                    <h1 className="text-2xl font-bold">{course.name}</h1>
                </div>

                <div className="flex flex-col gap-1 text-green-100 text-sm mb-4">
                    <h1>{course.address}</h1>
                    <h1>{course.zipCode} {course.city}</h1>
                    <h1>{course.country}</h1>

                </div>

                {course.description && (
                    <p className="text-green-100 text-sm italic mb-4">{course.description}</p>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                        <p className="text-2xl font-bold">{course.numberOfHoles}</p>
                        <p className="text-xs text-green-200">Huller</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                        <p className="text-2xl font-bold">{course.par}</p>
                        <p className="text-xs text-green-200">Par</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                        <p className="text-2xl font-bold">{course.length}</p>
                        <p className="text-xs text-green-200">Meter</p>
                    </div>
                </div>

                {/* Difficulty badge */}
                <div className="mt-4 flex items-center gap-2">
                    <span className="text-xs text-green-200">Sværhedsgrad:</span>
                    <span className="bg-white/20 text-sm font-medium px-3 py-0.5 rounded-full">
                        {course.difficulty}
                    </span>
                </div>

                {/* Kontaktinfo */}
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-green-200">
                    {course.phoneNumber && <span>📞 {course.phoneNumber}</span>}
                    {course.email && <span>✉️ {course.email}</span>}
                    {course.website && <span>🌐 {course.website}</span>}
                </div>
            </div>

            {/* Formular */}
            <div className="mt-8 flex flex-col gap-5">
                <h2 className="text-lg font-bold">Opret spil</h2>

                {/* Format */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">Format</label>
                        <InformationCircleIcon onClick={() => setModalOpen(true)} className="size-6 text-blue-400" />
                    </div>

                    <Modal open={modalOpen} onClose={() => setModalOpen(false)} center>
                        <div className="flex flex-col gap-2 text-xs text-black">
                            <h1 className="font-bold text-2xl">Hvad er slagspil?</h1>

                            <p className="text-xl">Slagspil handler om at bruge færrest mulige slag over hele runden (typisk 18 huller).</p>
                        </div>
                    </Modal>

                    <div className="grid grid-cols-1 gap-2">
                        <button
                            type="button"
                            onClick={() => setFormat("slagspil")}
                            className={`py-2 px-4 rounded-lg font-medium text-sm transition
                                ${format === "slagspil"
                                ? "bg-green-700 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                        >
                            Slagspil
                        </button>
                    </div>
                </div>

                {/* Kampnavn */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="gameName" className="text-sm font-medium">Kampnavn</label>
                    <input
                        id="gameName"
                        type="text"
                        placeholder="F.eks. Søndagsrunden"
                        value={gameName}
                        onChange={(e) => setGameName(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>

                {/* Antal spillere */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Antal spillere</label>
                    <div className="grid grid-cols-4 gap-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((count) => (
                            <button
                                key={count}
                                type="button"
                                onClick={() => handlePlayerCountChange(count)}
                                className={`py-2 rounded-lg font-medium text-sm transition
                    ${playerCount === count
                                    ? "bg-green-700 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                            >
                                {count}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Spillernavne */}
                {playerCount > 0 && (
                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-medium">Spillernavne</label>
                        {playerNames.map((name, index) => (
                            <input
                                key={index}
                                type="text"
                                placeholder={`Spiller ${index + 1}`}
                                value={name}
                                onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        ))}
                    </div>
                )}


                {playerCount > 0 && playerNames.every((name) => name.trim()) && (
                <button
                    onClick={() => handleCreateGame()}
                    className="w-full bg-linear-to-r from-green-500 to-green-800 text-white font-bold
                    rounded-lg py-3 px-4 transition hover:opacity-90"
                >
                    Start spil
                </button>
                )}
            </div>

        </div>
    );
};

export default CreateGamePage;
