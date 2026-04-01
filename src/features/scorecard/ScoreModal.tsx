import Modal from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { getScoreDescription } from "./scoreUtils.ts";

interface ScoreModalProps {
    open: boolean;
    onClose: () => void;
    playerName: string;
    holeNumber: number;
    holePar: number;
    sport: string;
    options: number[];
    currentScore: number | null;
    onSelectScore: (score: number) => void;
}

const ScoreModal = ({ open, onClose, playerName, holeNumber, holePar, sport, options, currentScore, onSelectScore }: ScoreModalProps) => {
    const handleSelect = (value: number) => {
        onSelectScore(value);
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose} center>
            <div className="flex flex-col gap-4">
                <div className="text-center">
                    <h2 className="text-lg font-bold text-gray-800">{playerName}</h2>
                    <p className="text-sm text-gray-500">Hul {holeNumber}</p>
                </div>

                <div className="flex justify-center items-center gap-2">
                <div className="w-3/4 grid grid-cols-3 gap-y-3 justify-items-center">
                    {options.map((value) => (
                        <button
                            key={value}
                            onClick={() => handleSelect(value)}
                            className={`size-14 rounded-xl text-lg font-bold transition
                                ${currentScore === value
                                    ? "bg-green-700 text-white ring-2 ring-green-400"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                        >
                            {value}
                        </button>
                    ))}
                </div>
                </div>

                <p className="text-gray-600 italic text-sm">{getScoreDescription(sport, holePar)}</p>

                {/* Nulstil */}
                <button
                    onClick={() => { onSelectScore(null as unknown as number); onClose(); }}
                    className="text-sm text-red-400 hover:text-red-600 transition text-center mt-1"
                >
                    Nulstil score
                </button>
            </div>
        </Modal>
    );
};

export default ScoreModal;



