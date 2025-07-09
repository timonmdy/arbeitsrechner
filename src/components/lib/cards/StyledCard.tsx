import React from "react";

interface StyledCardProps {
    children: React.ReactNode;
    className?: string;
}

const StyledCard: React.FC<StyledCardProps> = ({ children, className = "" }) => {
    return (
        <div className={`bg-cards text-text-primary p-4 rounded-xl ${className}`}>
            {children}
        </div>
    );
};

export default StyledCard;
