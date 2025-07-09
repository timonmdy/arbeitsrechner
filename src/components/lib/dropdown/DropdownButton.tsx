import React from "react";
import {FiChevronDown} from "react-icons/fi";

export const DropdownButton = ({
                            icon,
                            label,
                            onClick,
                            isOpen
                        }: {
    icon?: React.ReactNode;
    label?: string;
    onClick: () => void;
    isOpen: boolean;
}) => (
    <button
        onClick={onClick}
        className="flex items-center gap-2 px-3 py-2 bg-cards hover:bg-cards/60 text-text-primary rounded-xl transition-all"
    >
        {icon}
        {label && <span>{label}</span>}
        <FiChevronDown className={`text-text-muted transition-transform ${isOpen ? "rotate-180" : ""}`} />
    </button>
);