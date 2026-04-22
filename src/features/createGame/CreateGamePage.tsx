import { useParams, useNavigate } from "react-router-dom";
import { useCourse } from "../../hooks/useCourses.ts";
import { useCreateGame } from "../../hooks/useGame.ts";
import { useState, useEffect, useRef } from "react";
import 'react-responsive-modal/styles.css';
import {InformationCircleIcon} from "@heroicons/react/24/outline";
import FormatModal from "./FormatModal.tsx";
import type { Game } from "../../utils/interfaces/Game.ts";
import {da} from "date-fns/locale";
import {format as formatDate} from "date-fns";
import RulesModal from "./RulesModal.tsx";
import { useCourseImage } from "../../hooks/useCourseImage.ts";
import { getTotalPar } from "../../utils/parUtils.ts";
import DynamicModal from "./DynamicModal.tsx";
import LoginModal from "./LoginModal.tsx";
import { useUserProfile } from "../../hooks/useUserProfile.ts";
import SearchPlayerModal from "./SearchPlayerModal.tsx";
import { useUsers } from "../../hooks/useUsers.ts";

const CreateGamePage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { profile } = useUserProfile();
    const { data: playersData, isLoading: playersLoading } = useUsers();
    const players = playersData ?? [];
    const { data: course, isLoading, isError } = useCourse(String(courseId));
    const { mutate: createGame } = useCreateGame();
    const { data: logoUrl, isLoading: imageLoading } = useCourseImage(String(courseId), "logo");
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
    const [gameName, setGameName] = useState<string>(formatDate(new Date(), "dd/MM/yyyy", { locale: da }));
    const [formatModalOpen, setFormatModalOpen] = useState(false);
    const [rulesModalOpen, setRulesModalOpen] = useState(false);
    const [dynamicModalOpen, setDynamicModalOpen] = useState(false);
    const [logInModalOpen, setLogInModalOpen] = useState(false);
    const [startMatchEnabled, setStartMatchEnabled] = useState(false);
    const [playerNames, setPlayerNames] = useState<string[]>([]);
    const [playerEmails, setPlayerEmails] = useState<(string | undefined)[]>([]);
    const [newPlayerName, setNewPlayerName] = useState<string>("");
    const [searchPlayerModalOpen, setSearchPlayerModalOpen] = useState(false);
    const [, setActivePlayerIndex] = useState<number | null>(null);
    const newPlayerInputRef = useRef<HTMLInputElement>(null);


    const playerCount = playerNames.length;

    const handleAddPlayer = (name: string, email?: string) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        setPlayerNames((prev) => [...prev, trimmed]);
        setPlayerEmails((prev) => [...prev, email]);
        setNewPlayerName("");
        setTimeout(() => {
            newPlayerInputRef.current?.focus();
            newPlayerInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 0);
    };

    const handleRemovePlayer = (index: number) => {
        setPlayerNames((prev) => prev.filter((_, i) => i !== index));
        setPlayerEmails((prev) => prev.filter((_, i) => i !== index));
    };


    const handlePlayerNameChange = (index: number, name: string) => {
        setPlayerNames((prev) => {
            const updated = [...prev];
            updated[index] = name;
            return updated;
        });
    };

    const handleCreateGame = () => {
        if (!course || !courseId || playerNames.length === 0) return;
        if (playerNames.some((name) => !name.trim())) return;

        const defaultName = formatDate(new Date(), "dd/MM/yyyy", { locale: da });

        // Bland rækkefølgen
        const combined = playerNames.map((name, i) => ({ name, email: playerEmails[i] }));
        for (let i = combined.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [combined[i], combined[j]] = [combined[j], combined[i]];
        }

        const game: Game = {
            courseId: courseId,
            name: gameName.trim() || defaultName,
            format: format as "slagspil" | "hulspil",
            numberOfPlayers: playerCount,
            players: combined.map((p) => ({
                name: p.name.trim(),
                email: p.email,
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

    const handleSelectPlayer = (player: import("../../utils/interfaces/Game.ts").Player) => {
        handleAddPlayer(player.name, player.email);
        setActivePlayerIndex(null);
        setSearchPlayerModalOpen(false);
    };



    if (isLoading || imageLoading) return <p className="text-center mt-20 animate-pulse">Henter information...</p>;
    if (playersLoading) return <p className="text-center mt-20 animate-pulse">Henter spillere...</p>;
    if (isError || !course) return <p className="text-center mt-20 text-red-500">Der er sket en fejl. Prøv at genindlæs siden</p>;

    return (
        <div className="mx-auto px-6 py-10">

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

                    {logoUrl === "" && (
                <div className="flex items-center justify-between mb-3">
                    <h1 className="text-2xl font-bold">{course.name}</h1>
                </div>
                    )}

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
                            <span className="bg-linear-to-r from-yellow-500 to-orange-500 text-sm font-medium px-3 py-0.5 rounded-full">
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

            <div className="mt-4 grid grid-cols-2 gap-5">

                <button
                    onClick={() => {
                        setStartMatchEnabled((prev) => {
                            if (!prev) setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }), 50);
                            return !prev;
                        });
                    }}
                    className={`w-full shadow-xl ${startMatchEnabled ? 'bg-green-500 text-white' : ''} border border-gray-200 text-green-700 font-bold rounded-lg py-3 px-4 transition hover:bg-green-50`}
                >
                    🎯
                    <p>Start kamp</p>
                </button>

                <button
                    onClick={() => setLogInModalOpen((prev) => !prev)}
                    className={`w-full shadow-xl border border-gray-200 text-green-700 
                    font-bold rounded-lg py-3 px-4 transition hover:bg-green-50 ${profile ? 'bg-green-500 text-white' : ''}`}
                >
                    👤
                    <p>{profile ? `Hej ${profile.name}!` : "Log ind"}</p>
                </button>

                <button
                    onClick={() => navigate(`/${courseId}/leaderboard`)}
                    className="w-full p-4 shadow-xl border border-gray-200 text-green-700 font-bold rounded-lg transition hover:bg-green-50"
                >
                    🏆
                    <p>Se rangliste</p>
                </button>

                <button
                    onClick={() => setRulesModalOpen(true)}
                    className="w-full p-4 shadow-xl border border-gray-200 text-green-700 font-bold rounded-lg transition hover:bg-green-50"
                >
                    📋
                    <p>Læs regler</p>
                </button>
                
                <LoginModal open={logInModalOpen} onClose={() => setLogInModalOpen(false)} />
                <RulesModal open={rulesModalOpen} onClose={() => setRulesModalOpen(false)} rules={course.rules ?? []} />

            </div>

            {/* Formular */}
            {startMatchEnabled && (
                <div className="mt-8 flex flex-col gap-5">

                    {/* Format */}
                    {course.sport === "Fodboldgolf" && (
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium">Format</label>
                                <InformationCircleIcon onClick={() => setFormatModalOpen(true)} className="size-6 text-blue-400" />
                            </div>

                            <FormatModal open={formatModalOpen} onClose={() => setFormatModalOpen(false)} />

                            <div>
                                <button
                                    type="button"
                                    onClick={() => setFormat("slagspil")}
                                    className={`py-2 px-4 rounded-lg font-medium text-sm transition w-full
                                    ${format === "slagspil"
                                        ? "bg-green-700 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                                >
                                    Slagspil
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Kampnavn */}
                    <label htmlFor="gameName" className="text-sm font-medium -mb-3">Kampnavn</label>
                    <div className="grid grid-cols-[80%_20%] gap-2 items-center h-full">
                        <input
                            id="gameName"
                            type="text"
                            placeholder="Er feltet tomt sættes dagens dato som navn"
                            value={gameName}
                            onChange={(e) => setGameName(e.target.value)}
                            className="w-full p-3
                                 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-xs"
                        />


                        <button
                            type="button"
                            onClick={() => setGameName("")}
                            className={`p-3 rounded-lg transition w-full border border-gray-300
                                    ${gameName.trim() === "" ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-500"}`}
                        >
                            Ryd
                        </button>
                    </div>

                    {/* Spillere */}
                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-medium">Tilføj spillere</label>

                        {/* Eksisterende spillere */}
                        {playerNames.map((name, index) => (
                            <div key={index} className="grid grid-cols-[80%_20%] items-center gap-2">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemovePlayer(index)}
                                    className="shadow-xl border border-gray-300 rounded-lg p-3 bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-500 transition duration-200"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}

                        {/* Nyt spiller-input */}
                        <div className="grid grid-cols-[60%_20%_20%] items-center gap-2">
                            <input
                                type="text"
                                placeholder="Indtast spillernavn"
                                value={newPlayerName}
                                onChange={(e) => setNewPlayerName(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") handleAddPlayer(newPlayerName); }}
                                ref={newPlayerInputRef}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            {profile && playerNames.length === 0 && (
                                <button
                                    type="button"
                                    onClick={() => handleAddPlayer(profile.name, profile.email)}
                                    className="shadow-xl border border-gray-300 rounded-lg p-3 bg-gray-100 text-gray-600 hover:bg-green-100 transition duration-200"
                                >
                                    Mig
                                </button>
                            )}
                            {!(profile && playerNames.length === 0) && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setActivePlayerIndex(playerNames.length);
                                        setSearchPlayerModalOpen(true);
                                    }}
                                    className="shadow-xl border border-gray-300 rounded-lg p-3 bg-gray-100 text-gray-600 hover:bg-gray-200 transition duration-200"
                                >
                                    🔎
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => handleAddPlayer(newPlayerName)}
                                disabled={!newPlayerName.trim()}
                                className="shadow-xl border border-gray-300 rounded-lg p-3 bg-green-600 text-white font-bold hover:bg-green-700 disabled:opacity-30 transition duration-200"
                            >
                                +
                            </button>
                        </div>
                    </div>


                    <SearchPlayerModal
                        open={searchPlayerModalOpen}
                        onClose={() => {
                            setSearchPlayerModalOpen(false);
                            setActivePlayerIndex(null);
                        }}
                        players={players}
                        onSelect={handleSelectPlayer}
                    />

                    <div className="flex flex-col gap-2">
                        <h1 className="text-center text-sm italic text-gray-500">Antal spillere: {playerNames.length} spillere</h1>

                        {playerNames.length > 0 && playerNames.every((name) => name.trim()) && (
                            <button
                                onClick={() => handleCreateGame()}
                                className="w-full bg-linear-to-r from-green-500 to-green-800 text-white font-bold
                                    rounded-lg p-4 transition hover:opacity-90 mb-10"
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
