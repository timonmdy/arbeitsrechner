import React from "react";
import {format} from "date-fns";
import {de} from "date-fns/locale/de";
import {statusConfigs} from "../../../../config/HORechner.config";

interface TagesrechnerProps {
    rows: any[];
}

export const HOKalenderTable: React.FC<TagesrechnerProps> = ({ rows }) => {
    const today = new Date();

    const Legend = () => (
        <div className="flex justify-center mt-8 w-full">
            <div className="flex gap-6 w-4/5 justify-between">
                {statusConfigs.map((s) => (
                    <div key={s.key} className="flex items-center gap-3">
                        <span className="text-text-muted text-sm">{s.label}</span>
                        <span
                            className={`w-10 h-10 rounded-full inline-flex items-center justify-center ${s.color} border-2 ${s.border} p-1`}
                        >
                            {React.createElement(s.icon)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="p-8 rounded-3xl shadow-2xl bg-background border-4 border-borders max-w-3xl mx-auto mt-8">
            <h2 className="text-3xl font-extrabold text-accent mb-6 text-center">
                {format(today, "MMMM yyyy", {
                    locale: de
                })}
            </h2>
            <div className="flex justify-center gap-2 mb-4">
                {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((d) => (
                    <span key={d} className="w-16 text-center font-semibold text-text-secondary">{d}</span>
                ))}
            </div>
            <div>{rows}</div>
            <Legend/>
        </div>
    );
};
