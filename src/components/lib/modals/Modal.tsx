import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    backgroundOpacity?: number;
}

export const Modal = ({ isOpen, onClose, children, backgroundOpacity = 50 }: ModalProps) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleBackdropClick = () => {
        onClose();
    };

    const handleContentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    const backgroundStyle = {
        backgroundColor: `rgba(0, 0, 0, ${backgroundOpacity / 100})`
    };

    return (
        <div
            onClick={handleBackdropClick}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
            style={backgroundStyle}
            className="fixed inset-0 z-50 flex items-center justify-center"
        >

            <div
                onClick={handleContentClick}
                className="bg-zinc-800 p-6 rounded-xl shadow-xl w-full max-w-2xl text-text-primary relative"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-text-primary hover:text-accent transition-all duration-300"
                    aria-label="Close modal"
                >
                    <FiX size={24} />
                </button>
                {children}
            </div>
        </div>
    );
};
