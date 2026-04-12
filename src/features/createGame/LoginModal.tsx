import Modal from "react-responsive-modal";

interface LoginModalProps {
    open: boolean;
    onClose: () => void;
}

const RulesModal = ({ open, onClose }: LoginModalProps) => {
    return (
        <Modal open={open} onClose={onClose} center>
            <div className="flex flex-col gap-4 text-black">
                <h1>Indtast din email</h1>
                <input type="email" placeholder="Email" className="border p-2 rounded" />
                <button className="bg-green-500 text-white p-2 rounded">Log ind</button>
            </div>
        </Modal>
    );
};

export default RulesModal;