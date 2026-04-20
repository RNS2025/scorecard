import Modal from "react-responsive-modal";
import { useState, useMemo } from "react";
import type {Player} from "../../utils/interfaces/Game.ts";


interface SearchPlayerModalProps {
    open: boolean;
    onClose: () => void;
    players: Player[];
    onSelect: (player: Player) => void;
}

const SearchPlayerModal = ({ open, onClose, players, onSelect }: SearchPlayerModalProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [submittedQuery, setSubmittedQuery] = useState("");
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

    const filteredPlayers = useMemo(() => {
        if (!submittedQuery.trim()) return [];

        return players.filter((player) =>
            player.name.toLowerCase().includes(submittedQuery.toLowerCase())
        );
    }, [players, submittedQuery]);

    const handleSearch = () => {
        setSubmittedQuery(searchQuery.trim());
        setSelectedPlayer(null);
    };

    const handleAddPlayer = () => {
        if (!selectedPlayer) return;
        onSelect(selectedPlayer);
        handleClose();
    };

    const handleClose = () => {
        setSelectedPlayer(null);
        setSearchQuery("");
        setSubmittedQuery("");
        onClose();
    };

    const maskEmail = (email: string) => {
        const [name, domain] = email.split("@");

        if (!name || !domain) return email;

        const visible = name.slice(0, 2);
        const masked = "*".repeat(Math.max(name.length - 2, 0));

        return `${visible}${masked}@${domain}`;
    };

    return (
        <Modal open={open} onClose={handleClose} showCloseIcon={false} center>
            <div className="p-5 flex flex-col gap-4 text-sm text-black">
                <h1 className="font-bold text-2xl">Find bruger</h1>
                <p className="text-base">
                    Søg efter en bruger ved at skrive navnet og trykke på søg.
                </p>

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && searchQuery.trim()) {
                                handleSearch();
                            }
                        }}
                        className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2
                                    focus:ring-green-500"
                        placeholder="Søg efter bruger"
                    />
                    <button
                        type="button"
                        onClick={handleSearch}
                        disabled={!searchQuery.trim()}
                        className={`px-4 py-2 rounded-lg text-white whitespace-nowrap ${
                            searchQuery.trim()
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-gray-300 cursor-not-allowed"
                        }`}
                    >
                        Søg
                    </button>
                </div>

                {submittedQuery && (
                    <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-md">
                        {filteredPlayers.length > 100 ? (
                            <p className="p-3 text-gray-500">
                                For mange resultater. Prøv at søge mere specifikt.
                            </p>
                        ) : filteredPlayers.length > 0 ? (
                            filteredPlayers.map((player) => (
                                <button
                                    key={player.id}
                                    type="button"
                                    onClick={() => setSelectedPlayer(player)}
                                    className={`w-full text-left px-3 py-2 border-b last:border-b-0 transition ${
                                        selectedPlayer?.name === player.name
                                            ? "bg-green-500 text-white"
                                            : "hover:bg-gray-100"
                                    }`}
                                >
                                    <p>{player.name}</p>
                                    <p className="italic">{player.email && maskEmail(player.email)}</p>
                                </button>
                            ))
                        ) : (
                            <p className="p-3 text-gray-500">Ingen brugere fundet</p>
                        )}
                    </div>
                )}

                <div className="flex gap-2 justify-end">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                    >
                        Luk
                    </button>
                    <button
                        type="button"
                        onClick={handleAddPlayer}
                        disabled={!selectedPlayer}
                        className={`px-4 py-2 rounded-lg text-white ${
                            selectedPlayer
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-gray-300 cursor-not-allowed"
                        }`}
                    >
                        Vælg
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default SearchPlayerModal;