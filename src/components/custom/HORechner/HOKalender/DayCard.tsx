import React from "react";
import {format} from "date-fns";
import {motion} from "framer-motion";
import {DayStatus} from "../../../../types/Arbeitszeitrechner.types";
import {statusConfigs} from "../../../../config/HORechner.config";

const getStatusConfig = (status: DayStatus) => statusConfigs.find(s => s.key === status)!;

interface DayCardProps {
    date: Date;
    status: DayStatus;
    isToday: boolean;
    isHoliday: boolean;
    inMonth: boolean;
    onCycleStatus: (forward: boolean) => void;
}

export const DayCard: React.FC<DayCardProps> = ({
                                             date, status, isToday, isHoliday, inMonth, onCycleStatus
                                         }) => {
    const config = getStatusConfig(status);

    // Prevent context menu and cycle backwards on right-click
    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!isHoliday && inMonth) onCycleStatus(false);
    };

    return (
        <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95, rotate: -2 }}
            onClick={() => !isHoliday && inMonth && onCycleStatus(true)}
            onContextMenu={handleContextMenu}
            className={[
                "w-16 h-16 flex flex-col items-center justify-center rounded-xl m-1 shadow-lg transition-all duration-300 border-2",
                config.color,
                config.border,
                isHoliday
                    ? "opacity-40 bg-borders cursor-not-allowed"
                    : inMonth
                        ? "cursor-pointer"
                        : "opacity-20 cursor-not-allowed",
                isToday && !isHoliday ? "ring-4 ring-accent" : "",
            ].join(" ")}
            disabled={isHoliday || !inMonth}
            title={isHoliday ? "Feiertag" : config.label}
        >
            <span className="font-bold text-lg text-text-primary">{format(date, "d")}</span>
            <span className="mt-1">{React.createElement(config.icon)}</span>
        </motion.button>
    );
};
