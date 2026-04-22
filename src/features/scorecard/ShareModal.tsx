import Modal from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { QRCodeSVG } from "qrcode.react";

interface ShareModalProps {
    open: boolean;
    onClose: () => void;
    gameUrl: string;
}

const ShareModal = ({ open, onClose, gameUrl }: ShareModalProps) => {
    return (
        <Modal open={open} onClose={onClose} center>
            <div className="flex flex-col items-center gap-4 px-2 pb-2">
                <div className="text-center">
                    <h2 className="text-lg font-bold text-gray-800">Del kamp</h2>
                    <p className="text-sm text-gray-500 mt-1">Scan QR-koden for at tilslutte kampen</p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <QRCodeSVG value={gameUrl} size={200} />
                </div>
            </div>
        </Modal>
    );
};

export default ShareModal;

