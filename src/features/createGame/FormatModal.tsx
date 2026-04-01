import Modal from "react-responsive-modal";

interface FormatModalProps {
    open: boolean;
    onClose: () => void;
}

const FormatModal = ({ open, onClose }: FormatModalProps) => {
    return (
        <Modal open={open} onClose={onClose} center>
            <div className="flex flex-col gap-2 text-xs text-black">
                <h1 className="font-bold text-2xl">Hvad er slagspil?</h1>
                <p className="text-xl">
                    Slagspil handler om at bruge færrest mulige slag over hele runden (typisk 18 huller).
                </p>
            </div>
        </Modal>
    );
};

export default FormatModal;