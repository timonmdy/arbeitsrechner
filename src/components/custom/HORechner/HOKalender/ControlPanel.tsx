import React, {useEffect, useState} from "react";
import {motion} from "framer-motion";
import {getStorageValue} from "../../../../storage/StorageProvider";
import {HiOutlineCalendar, HiOutlineHome, HiOutlineMinusCircle, HiOutlineOfficeBuilding,} from "react-icons/hi";
import {LimitedNumberInput} from "../../../lib/form/LimitedNumberInput";

// Typen
export type DayStatus = {
    neutral: number;
    homeOffice: number;
    onSite: number;
    offDay: number;
};

export type ControlPanelProps = {
    quote?: number;
    dayStatus: DayStatus;
    mode?: "countOffDays" | "ignoreOffDays";
    onSettingChange?: (settings: { quote: number; mode: "countOffDays" | "ignoreOffDays" }) => void;
    onModeChange?: (mode: "countOffDays" | "ignoreOffDays") => void;
};

const MODES = [
    {
        key: "countOffDays",
        label: "Arbeitsfreie Tage zählen",
        description: "Arbeitsfreie Tage werden wie Vor-Ort-Tage berücksichtigt.",
    },
    {
        key: "ignoreOffDays",
        label: "Arbeitsfreie Tage ignorieren",
        description: "Arbeitsfreie Tage werden bei der Berechnung nicht berücksichtigt.",
    },
] as const;

const BAR_COLORS = {
    homeOffice: "bg-blue-400",
    onSite: "bg-green-400",
    offDay: "bg-yellow-300",
};

function getCountedDaysAndQuote(dayStatus: DayStatus, mode: "countOffDays" | "ignoreOffDays") {
    const {homeOffice, onSite, offDay} = dayStatus;
    const countedOnSite = mode === "countOffDays" ? onSite + offDay : onSite;
    const countedDays = homeOffice + countedOnSite;
    const quote = countedDays === 0 ? 0 : (homeOffice / countedDays) * 100;
    return {countedDays, quote};
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
                                                              quote: propQuote,
                                                              dayStatus,
                                                              mode: propMode,
                                                              onSettingChange,
                                                              onModeChange,
                                                          }) => {
    // Initialwerte aus Storage oder Props
    const defaultQuote = propQuote ?? (getStorageValue("hoQuote") as number) ?? 60;
    const defaultMode = propMode ?? "countOffDays";

    const [quote, setQuote] = useState<number>(defaultQuote);
    const [mode, setMode] = useState<"countOffDays" | "ignoreOffDays">(defaultMode);

    // Prop-Änderungen übernehmen
    useEffect(() => {
        if (typeof propQuote === "number" && propQuote !== quote) {
            setQuote(propQuote);
        }
    }, [propQuote]);
    useEffect(() => {
        if (propMode && propMode !== mode) setMode(propMode);
    }, [propMode]);

    function handleQuoteChange(newValue: number) {
        setQuote(newValue);
        onSettingChange?.({quote: newValue, mode});
    }

    function handleModeChange(newMode: "countOffDays" | "ignoreOffDays") {
        setMode(newMode);
        onModeChange?.(newMode);
        onSettingChange?.({quote, mode: newMode});
    }

    const {quote: actualQuote} = getCountedDaysAndQuote(dayStatus, mode);

    // Arbeitsfreie Tage in der Bar/Liste ignorieren, wenn "ignoreOffDays"
    const showOffDays = mode === "countOffDays";
    const barSegments = [
        {
            key: "homeOffice",
            label: "HO",
            value: dayStatus.homeOffice,
            color: BAR_COLORS.homeOffice,
            icon: <HiOutlineHome/>,
        },
        {
            key: "onSite",
            label: "Vor Ort",
            value: dayStatus.onSite,
            color: BAR_COLORS.onSite,
            icon: <HiOutlineOfficeBuilding/>,
        },
        ...(showOffDays
            ? [{
                key: "offDay",
                label: "Frei",
                value: dayStatus.offDay,
                color: BAR_COLORS.offDay,
                icon: <HiOutlineCalendar/>,
            }]
            : []),
    ].filter((s) => s.value > 0);

    const totalForBar = barSegments.reduce((acc, seg) => acc + seg.value, 0);

    let acc = 0;
    const animatedBarSegments = barSegments.map((seg) => {
        const percent = totalForBar === 0 ? 0 : (seg.value / totalForBar) * 100;
        const start = acc;
        acc += percent;
        return {
            ...seg,
            percent,
            start,
        };
    });

    const segmentsForList = [
        {
            key: "neutral",
            label: "Nicht gewertet",
            value: dayStatus.neutral + (!showOffDays ? dayStatus.offDay : 0),
            color: "bg-gray-300",
            icon: <HiOutlineMinusCircle/>,
        },
        ...barSegments,
    ].filter((s) => s.value > 0);

    const quoteExceeded = actualQuote > quote;

    return (
        <div className="p-8 rounded-3xl shadow-2xl bg-background border-4 border-borders max-w-3xl mx-auto mt-8">
            <h2 className="text-2xl font-bold text-accent mb-6 text-center">
                Auswertung
            </h2>

            <div className={`flex flex-col md:flex-row gap-4 items-center justify-center mb-6`}>
                <label htmlFor="ho-quote" className="font-medium flex items-center gap-2">
                    <HiOutlineHome className="text-accent"/>
                    Maximale HO-Quote
                </label>
                <div className="relative w-64">
                    <LimitedNumberInput
                        value={quote}
                        onChange={handleQuoteChange}
                        min={0}
                        max={100}
                        storageKey={"hoQuote"}
                        className="border border-borders rounded-2xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent pr-10 text-lg transition"
                        placeholder={`0-100`}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-accent font-bold">
                  %
                </span>
                </div>
            </div>

            {/* Modus-Switch */}
            <div className="mb-6 flex flex-col items-center">
                <span className="font-medium mb-2">Berechnungsmodus</span>
                <div className="flex gap-4">
                    {MODES.map((m) => (
                        <button
                            key={m.key}
                            type="button"
                            onClick={() => handleModeChange(m.key)}
                            className={`px-4 py-2 rounded-xl border text-sm transition
                                ${
                                mode === m.key
                                    ? "bg-accent text-white border-accent shadow"
                                    : "bg-background border-borders text-accent hover:bg-accent/10"
                            }
                            `}
                            title={m.description}
                        >
                            {m.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Anzeige: Quote überschritten oder im grünen Bereich */}
            <div className="my-8">
                {!quoteExceeded ? (
                    <motion.div
                        initial={{opacity: 0, scale: 0.95}}
                        animate={{opacity: 1, scale: 1}}
                        transition={{duration: 0.7, type: "spring"}}
                        className="rounded-3xl border-4 border-green-400 bg-gradient-to-r from-green-300 via-green-200 to-green-100 shadow-xl p-6 flex flex-col items-center gap-2"
                    >
                        <span className="text-3xl font-extrabold text-green-700 flex items-center gap-2">
                            ✅ Alles im grünen Bereich!
                        </span>
                        <span className="text-xl font-semibold text-green-600">
                            Deine aktuelle HomeOffice-Quote: <span
                            className="font-mono">{actualQuote.toFixed(1)}%</span>
                        </span>
                        <span className="text-lg text-green-800">
                            Maximale erlaubte Quote: <span className="font-mono">{quote}%</span>
                        </span>
                        <span className="text-base text-green-700">
                            Du hast die Vorgabe nicht überschritten. Super!
                        </span>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{opacity: 0, scale: 0.95}}
                        animate={{opacity: 1, scale: 1}}
                        transition={{duration: 0.7, type: "spring"}}
                        className="rounded-3xl border-4 border-red-400 bg-gradient-to-r from-red-200 via-red-100 to-white shadow-xl p-6 flex flex-col items-center gap-2"
                    >
                        <span className="text-2xl font-extrabold text-red-700 flex items-center gap-2">
                            ⚠️ Zu viel HomeOffice!
                        </span>
                        <span className="text-lg font-semibold text-red-800">
                            Deine aktuelle HomeOffice-Quote: <span
                            className="font-mono">{actualQuote.toFixed(1)}%</span>
                        </span>
                        <span className="text-base text-red-700">
                            Erlaubt sind maximal <span className="font-mono">{quote}%</span>.<br/>
                            Bitte reduziere deine HomeOffice-Tage.
                        </span>
                    </motion.div>
                )}
            </div>

            {/* Animierte Prozent-Bar */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 mt-4">Verteilung der Tage</h3>
                <div
                    className="w-full h-8 rounded-xl overflow-hidden flex border border-borders bg-gray-100 shadow-inner">
                    {animatedBarSegments.map((seg) => (
                        <motion.div
                            key={seg.key}
                            initial={{width: 0}}
                            animate={{width: `${seg.percent}%`}}
                            transition={{duration: 0.8, ease: "easeInOut"}}
                            className={`${seg.color} h-full flex items-center justify-center text-xs font-bold text-white`}
                            style={{minWidth: seg.percent > 10 ? undefined : 32}}
                            title={`${seg.label}: ${seg.value} Tage (${seg.percent.toFixed(1)}%)`}
                        >
                            {seg.percent > 8 && (
                                <span className="flex items-center gap-1 px-2">
                                    {seg.label}
                                    <span className="ml-1">({Math.round(seg.percent)}%)</span>
                                </span>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Status-Liste */}
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                {segmentsForList.map((seg) => (
                    <li
                        key={seg.key}
                        className="flex items-center gap-3 mb-2 p-2 rounded-xl bg-background border border-borders"
                    >
                        <span className={`text-xl`}>{seg.icon}</span>
                        <span className="font-bold text-accent">{seg.label}:</span>
                        <span className="ml-auto font-mono">{seg.value}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};
