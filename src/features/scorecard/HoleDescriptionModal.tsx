import Modal from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { useHoleImage } from "../../hooks/useHoleImage.ts";

interface HoleDescriptionModalProps {
    open: boolean;
    onClose: () => void;
    courseId: string;
    holeNumber: number;
}

const HoleDescriptionModal = ({ open, onClose, courseId, holeNumber }: HoleDescriptionModalProps) => {
    const { data: imageUrl, isLoading, isError } = useHoleImage(courseId, holeNumber);

    return (
        <Modal open={open} onClose={onClose} center
               classNames={{ modal: '!bg-transparent !shadow-none !p-0' }}
        >
            <div>
                {isLoading && (
                    <p className="text-sm text-gray-400 animate-pulse text-center py-8">Henter billede...</p>
                )}

                {isError && (
                    <p className="text-sm text-gray-400 text-center py-8 mt-5">Ingen banebeskrivelse for dette hul.</p>
                )}

                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt={`Banebeskrivelse for hul ${holeNumber}`}
                        className="w-full rounded-lg max-h-[calc(100vh-120px)] object-contain"
                    />
                )}
            </div>
        </Modal>
    );
};

export default HoleDescriptionModal;

