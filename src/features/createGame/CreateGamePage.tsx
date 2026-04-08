import { useParams, useNavigate } from "react-router-dom";
import { useCourse } from "../../hooks/useCourses.ts";
import { useCreateGame } from "../../hooks/useGame.ts";
import { useState, useEffect } from "react";
import 'react-responsive-modal/styles.css';
import scorecard_logo from "../../assets/scorecard logo.png";
import {InformationCircleIcon} from "@heroicons/react/24/outline";
import FormatModal from "./FormatModal.tsx";
import type { Game } from "../../utils/interfaces/Game.ts";
import {da} from "date-fns/locale";
import {format as formatDate} from "date-fns";
import {ArrowLeftIcon} from "@heroicons/react/24/solid";
import RulesModal from "./RulesModal.tsx";
import { useCourseImage } from "../../hooks/useCourseImage.ts";
import { getTotalPar } from "../../utils/parUtils.ts";
import DynamicModal from "./DynamicModal.tsx";

const CreateGamePage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { data: course, isLoading, isError } = useCourse(String(courseId));
    const { mutate: createGame } = useCreateGame();
    const { data: logoUrl } = useCourseImage(String(courseId), "logo");
    const [logoShape, setLogoShape] = useState<"landscape" | "square" | null>(null);

    useEffect(() => {
        if (!logoUrl) return;
        const img = new Image();
        img.onload = () => {
            setLogoShape(img.naturalWidth / img.naturalHeight > 1.4 ? "landscape" : "square");
        };
        img.src = logoUrl;
    }, [logoUrl]);

    const [format, setFormat] = useState<string>("slagspil")
    const [gameName, setGameName] = useState<string>("");
    const [formatModalOpen, setFormatModalOpen] = useState(false);
    const [rulesModalOpen, setRulesModalOpen] = useState(false);
    const [dynamicModalOpen, setDynamicModalOpen] = useState(false);
    const [startMatchEnabled, setStartMatchEnabled] = useState(false);
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
                navigate(`/${courseId}/game/${savedGame.id}`);
            },
        });
    }



    if (isLoading) return <p className="text-center mt-20 animate-pulse">Henter information...</p>;
    if (isError || !course) return <p className="text-center mt-20 text-red-500">Der er sket en fejl. Prøv at genindlæs siden</p>;

    return (
        <div className="mx-auto px-6 pb-10">
            {/* Header */}
            <div className="grid grid-cols-3 items-center pt-6 pb-4">
                <button onClick={() => navigate(`/`)} className="p-1 hover:bg-white/10 rounded-lg transition">
                    <ArrowLeftIcon className="w-5 h-5" />
                </button>
                <div className="w-full flex justify-center">
                <img src={scorecard_logo} alt="Scorecard Logo" className="w-20" />
                </div>
                <span></span>
            </div>

            {/* Bane-info kort */}
            <div className={`relative bg-linear-to-br from-green-600 to-green-800 text-white rounded-2xl shadow-lg overflow-hidden ${logoUrl && logoShape === "square" ? "mt-8" : ""}`}>

                {/* Banner-logo (aflangt) */}
                {logoUrl && logoShape === "landscape" && (
                    <div className="px-5 pt-4 pb-3 flex justify-center">
                        <img src={logoUrl} alt={`${course.name} logo`} className="h-16 object-contain" />
                    </div>
                )}

                <div className="relative p-5">

                    {/* Badge-logo (kvadratisk/højt) */}
                    {logoUrl && logoShape === "square" && (
                        <div className="absolute -top-11 right-4 w-16 h-16 rounded-xl bg-white shadow-lg p-1.5 flex items-center justify-center">
                            <img src={logoUrl} alt={`${course.name} logo`} className="w-full h-full object-contain rounded-lg" />
                        </div>
                    )}

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
                <div className={`grid ${getTotalPar(course) !== undefined && course.length !== undefined ? 'grid-cols-3' : 'grid-cols-2'} gap-3`}>
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                        <p className="text-2xl font-bold">{course.numberOfHoles}</p>
                        <p className="text-xs text-green-200">Huller</p>
                    </div>
                    {getTotalPar(course) !== undefined ? (
                        <div className="bg-white/10 rounded-xl p-3 text-center">
                            <p className="text-2xl font-bold">{getTotalPar(course)}</p>
                            <p className="text-xs text-green-200">Par</p>
                        </div>
                    ) : (
                        <div className="bg-white/10 rounded-xl p-3 text-center">
                            <p className="text-2xl font-bold">-</p>
                            <p className="text-xs text-green-200">Par</p>
                        </div>
                    )}
                    {course.length !== undefined && (
                        <div className="bg-white/10 rounded-xl p-3 text-center">
                            <p className="text-2xl font-bold">{course.length}</p>
                            <p className="text-xs text-green-200">Meter</p>
                        </div>
                    )}
                </div>

                {/* Difficulty badge */}
                {course.difficulty && (
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-xs text-green-200">Sværhedsgrad:</span>
                        <span className="bg-white/20 text-sm font-medium px-3 py-0.5 rounded-full">
                            {course.difficulty}
                        </span>
                    </div>
                )}

                    {/* Dynamic badge */}
                    {course.parMode === "calculated" && (
                        <div onClick={() => setDynamicModalOpen(true)}
                            className="mt-4 flex items-center gap-2">
                            <span className="text-xs text-green-200">Partype:</span>
                            <span className="animate-pulse bg-linear-to-r from-yellow-500 to-orange-500 text-sm font-medium px-3 py-0.5 rounded-full">
                            Dynamisk
                        </span>
                        </div>
                    )}
                    <DynamicModal open={dynamicModalOpen} onClose={() => setDynamicModalOpen(false)} />


                    {/* Kontaktinfo */}
                <div className="mt-4 flex flex-col gap-x-4 gap-y-1 text-xs text-green-200">
                    {course.phoneNumber && <span>📞 {course.phoneNumber}</span>}
                    {course.email && <span>✉️ {course.email}</span>}
                    {course.website && <span>🌐 {course.website}</span>}
                </div>
            </div>
            </div>

            <div className="mt-4 flex flex-col gap-5">
                <button
                    onClick={() => setStartMatchEnabled((prev) => !prev)}
                    className={`w-full shadow-xl ${startMatchEnabled ? 'bg-green-500 text-white' : ''} border border-gray-200 text-green-700 font-bold rounded-lg py-3 px-4 transition hover:bg-green-50`}
                >
                    🎯 Start kamp
                </button>

            <button
                onClick={() => navigate(`/${courseId}/leaderboard`)}
                className="w-full shadow-xl border border-gray-200 text-green-700 font-bold rounded-lg py-3 px-4 transition hover:bg-green-50"
            >
                🏆 Se rangliste
            </button>

            <button
                onClick={() => setRulesModalOpen(true)}
                className="w-full shadow-xl border border-gray-200 text-green-700 font-bold rounded-lg py-3 px-4 transition hover:bg-green-50"
            >
                📋 Læs regler
            </button>

            <RulesModal open={rulesModalOpen} onClose={() => setRulesModalOpen(false)} rules={course.rules ?? []} />

            </div>

            {/* Formular */}
            {startMatchEnabled && (
            <div className="mt-8 flex flex-col gap-5">
                <h2 className="text-lg font-bold">Opret kamp</h2>

                {/* Format */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">Format</label>
                        <InformationCircleIcon onClick={() => setFormatModalOpen(true)} className="size-6 text-blue-400" />
                    </div>

                    <FormatModal open={formatModalOpen} onClose={() => setFormatModalOpen(false)} />

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

                <div className="flex flex-col gap-2">

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
            )}

        </div>
    );
};

export default CreateGamePage;
