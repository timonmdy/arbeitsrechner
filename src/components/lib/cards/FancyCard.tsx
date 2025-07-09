import React, { useMemo } from "react";

type FancyCardProps = {
    title: string;
    description: string;
    onClick?: () => void;
    subText?: string;
    buttonText?: string;
    Icon?: React.ElementType;
    image?: string;
};

export const FancyCard: React.FC<FancyCardProps> = ({
                                                      title,
                                                      description,
                                                      subText,
                                                      buttonText = "Loslegen",
                                                      Icon,
                                                      image,
                                                      onClick,
                                                  }) => {
    const headerGradient = useMemo(() => {
        let hash = 0;
        for (let i = 0; i < title.length; i++) {
            hash = title.charCodeAt(i) + ((hash << 5) - hash);
        }
        const h = hash % 360;
        const s = 70; // Sättigung
        const l = 45; // Helligkeit
        const color1 = `hsl(${h}, ${s}%, ${l}%)`;
        const color2 = `hsl(${(h + 40) % 360}, ${s}%, ${l}%)`;
        return `linear-gradient(135deg, ${color1}, ${color2})`;
    }, [title]);

    const headerStyle = {
        backgroundImage: image ? `url('${image}')` : headerGradient,
    };

    return (
        <div className="flex flex-col h-full bg-cards rounded-xl shadow-lg hover:shadow-xl border border-borders overflow-hidden transition-shadow duration-300">
            {/* === Header === */}
            <div
                style={headerStyle}
                className="relative h-40 bg-cover bg-center p-4 flex flex-col justify-between text-white"
            >
                <div className="absolute inset-0 bg-black/40"></div>

                {/* Icon oder Fallback (erster Buchstabe des Titels) */}
                <div className="relative z-10 w-10 h-10 flex items-center justify-center bg-white/20 rounded-lg">
                    {Icon ? <Icon className="w-6 h-6" /> : <span className="text-xl font-bold">{title.charAt(0)}</span>}
                </div>

                {/* Titel */}
                <h3 title={title} className="relative z-10 text-xl font-bold truncate">
                    {title}
                </h3>
            </div>

            {/* === Body === */}
            <div className="flex flex-col flex-grow p-5 gap-2">
                {subText && (
                    <p className="text-xs text-text-secondary italic">{subText}</p>
                )}
                <p title={description} className="text-sm text-text-muted line-clamp-3">
                    {description}
                </p>
                <button
                    onClick={onClick}
                    className="w-full bg-accent hover:bg-accent/50 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 mt-auto hover:cursor-pointer"
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
};