import React, {useEffect, useState} from "react";
import {
    addDays,
    endOfMonth,
    endOfWeek,
    format,
    getMonth,
    isSameDay,
    isSameMonth,
    isWeekend,
    startOfMonth,
    startOfWeek
} from "date-fns";
import {DayStatus, DayStatusMap} from "../../../../types/Arbeitszeitrechner.types";
import {statusConfigs} from "../../../../config/HORechner.config";
import {DayCard} from "./DayCard";
import {getStorageValue, setStorageValue} from "../../../../storage/StorageProvider";
import {HOKalenderTable} from "./HOKalenderTagesrechner";
import {ControlPanel} from "./ControlPanel";
import {getHolidays} from "feiertagejs";

type ModeType = "countOffDays" | "ignoreOffDays";

const getDefaultStatus = (date: Date): DayStatus =>
    isWeekend(date) || !isSameMonth(date, new Date()) ? "neutral" : "on-site";

function summarizeDayStatus(dayStatus: { [date: string]: DayStatus }, monthStart: Date, monthEnd: Date) {
    const summary = {
        neutral: 0,
        homeOffice: 0,
        onSite: 0,
        offDay: 0,
    };
    let day = startOfWeek(monthStart, {weekStartsOn: 1});
    const lastDay = endOfWeek(monthEnd, {weekStartsOn: 1});

    while (day <= lastDay) {
        const dateStr = format(day, "yyyy-MM-dd");
        const status = dayStatus[dateStr] || getDefaultStatus(day);
        switch (status) {
            case "neutral":
                summary.neutral++;
                break;
            case "homeoffice":
                summary.homeOffice++;
                break;
            case "on-site":
                summary.onSite++;
                break;
            case "off":
                summary.offDay++;
                break;
        }
        day = addDays(day, 1);
    }
    return summary;
}

function getStoredDayStatus() {
    const storedValue = getStorageValue("dayStatus") as DayStatusMap;
    if (storedValue?.month !== getMonth(new Date())) {
        setStorageValue("dayStatus", {});
        return {};
    }

    return storedValue ? storedValue.days : {};
}

function setStoredDayStatus(dayStatus: { [date: string]: DayStatus }) {
    const month = getMonth(new Date());
    setStorageValue("dayStatus", {
        month,
        days: dayStatus
    });
}

export const HOKalender: React.FC = () => {
    const today = new Date();
    const holidays = getHolidays(today.getFullYear(), "BUND").map(holiday => format(holiday.date, "yyyy-MM-dd"));
    const [dayStatus, setDayStatus] = useState<{ [date: string]: DayStatus }>(getStoredDayStatus());

    // HO-Quote und Modus als State
    const [quote, setQuote] = useState<number>(getStorageValue("hoQuote") as number || 60);
    const [mode, setMode] = useState<ModeType>(
        (getStorageValue("hoMode") as ModeType) || "countOffDays"
    );

    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    const weekStart = startOfWeek(monthStart, {weekStartsOn: 1});
    const weekEnd = endOfWeek(monthEnd, {weekStartsOn: 1});

    useEffect(() => {
        setStoredDayStatus(dayStatus);
    }, [dayStatus]);

    useEffect(() => {
        setStorageValue("hoQuote", quote);
    }, [quote]);

    useEffect(() => {
        setStorageValue("hoMode", mode);
    }, [mode]);

    const cycleStatus = (dateStr: string, forward = true) => {
        const current = dayStatus[dateStr] || getDefaultStatus(new Date(dateStr));
        const idx = statusConfigs.findIndex(s => s.key === current);
        let nextIdx;
        if (forward) {
            nextIdx = (idx + 1) % statusConfigs.length;
        } else {
            nextIdx = (idx - 1 + statusConfigs.length) % statusConfigs.length;
        }
        setDayStatus(s => ({...s, [dateStr]: statusConfigs[nextIdx].key}));
    };

    // Kalender-Rendering
    const rows = [];
    let days = [];
    let day = weekStart;

    while (day <= weekEnd) {
        for (let i = 0; i < 7; i++) {
            const dateStr = format(day, "yyyy-MM-dd");
            const isHoliday = holidays.includes(dateStr);
            const inMonth = isSameMonth(day, monthStart);
            const status = dayStatus[dateStr] || getDefaultStatus(day);

            days.push(
                <DayCard
                    key={dateStr}
                    date={day}
                    status={status}
                    isToday={isSameDay(day, today)}
                    isHoliday={isHoliday}
                    inMonth={inMonth}
                    onCycleStatus={forward => cycleStatus(dateStr, forward)}
                />
            );
            day = addDays(day, 1);
        }
        rows.push(<div key={day.toString()} className="flex justify-center">{days}</div>);
        days = [];
    }

    const dayStatusSummary = summarizeDayStatus(dayStatus, monthStart, monthEnd);

    function handleSettingChange(settings: { quote: number; mode: ModeType }) {
        setQuote(settings.quote);
        setMode(settings.mode);
    }

    function handleModeChange(newMode: ModeType) {
        setMode(newMode);
    }

    return (

        <div>
            <HOKalenderTable rows={rows}/>
            <div className={`mt-2`}>
                <ControlPanel
                    quote={quote}
                    dayStatus={dayStatusSummary}
                    mode={mode}
                    onSettingChange={handleSettingChange}
                    onModeChange={handleModeChange}
                />
            </div>
        </div>
    )
};