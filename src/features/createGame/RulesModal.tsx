import Modal from "react-responsive-modal";

interface RulesModalProps {
    open: boolean;
    onClose: () => void;
    rules: string[];
}

const RulesModal = ({ open, onClose, rules }: RulesModalProps) => {
    return (
        <Modal open={open} onClose={onClose} center>
            <div className="flex flex-col gap-4 text-black">
                {rules.length > 0 ? (
                    <ol className="list-decimal list-inside flex flex-col gap-2 text-sm mt-5">
                        {rules.map((rule, index) => (
                            <li key={index}>{rule}</li>
                        ))}
                    </ol>
                ) : (
                    <p className="text-sm text-gray-500">Ingen regler tilgængelige for denne bane.</p>
                )}
            </div>
        </Modal>
    );
};

export default RulesModal;