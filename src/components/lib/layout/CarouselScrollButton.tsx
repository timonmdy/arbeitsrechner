import { IconType } from "react-icons";
import "./Carousel.css";

type CarouselScrollButtonProps = {
    onClick?: () => void;
    disabled?: boolean;
    icon?: IconType;
    className?: string;
};

export const CarouselScrollButton: React.FC<CarouselScrollButtonProps> = ({ onClick, disabled, icon: Icon, className = "" }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`absolute ${className} top-1/2 -translate-y-1/2 z-20 bg-cards hover:ring-2 hover:ring-accent text-text-primary rounded-full p-2 shadow-lg transition-opacity duration-300 opacity-0 group-hover/carousel:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed`}
        >
            {Icon && <Icon className="w-6 h-6" />}
        </button>
    );
};