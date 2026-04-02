import Modal from "react-responsive-modal";

interface DynamicModalProps {
    open: boolean;
    onClose: () => void;
}

const DynamicModal = ({ open, onClose }: DynamicModalProps) => {
    return (
        <Modal open={open} onClose={onClose} center>
            <div className="flex flex-col gap-2 text-xs text-black">
                <h1 className="font-bold text-2xl">Dette er en dynamisk bane!</h1>
                <p className="text-xl">
                    Banens og hullernes par opdateres dynamisk baseret på alle færdigspillede runder.
                </p>
            </div>
        </Modal>
    );
};

export default DynamicModal;