import React, { useRef, useState, useEffect } from "react";

type TimeInputProps = {
    hours: number;
    minutes: number;
    onChange: (hours: number, minutes: number) => void;
    maxHours?: number;
    maxMinutes?: number;
    className?: string;
    storageKey?: string;
};

const pad = (num: number, size = 2) => num.toString().padStart(size, "0");

export const SophisticatedTimeInput: React.FC<TimeInputProps> = ({
                                                                     hours,
                                                                     minutes,
                                                                     onChange,
                                                                     maxHours = 99,
                                                                     maxMinutes = 59,
                                                                     className = "",
                                                                     storageKey,
                                                                 }) => {
    const [hourVal, setHourVal] = useState(hours);
    const [minuteVal, setMinuteVal] = useState(minutes);

    const hourRef = useRef<HTMLInputElement>(null);
    const minuteRef = useRef<HTMLInputElement>(null);

    // Load from storage
    useEffect(() => {
        if (!storageKey) return;
        const stored = window.localStorage.getItem(storageKey);
        if (stored) {
            try {
                const { h, m } = JSON.parse(stored);
                setHourVal(h);
                setMinuteVal(m);
                onChange(h, m);
            } catch { /* empty */ }
        }
        // eslint-disable-next-line
    }, [storageKey]);

    // Save to storage
    useEffect(() => {
        if (!storageKey) return;
        window.localStorage.setItem(
            storageKey,
            JSON.stringify({ h: hourVal, m: minuteVal })
        );
    }, [hourVal, minuteVal, storageKey]);

    // Sync with props
    useEffect(() => setHourVal(hours), [hours]);
    useEffect(() => setMinuteVal(minutes), [minutes]);

    // Block input if it would exceed max
    function handleHourChange(e: React.ChangeEvent<HTMLInputElement>) {
        const val = e.target.value.replace(/\D/g, "");
        if (val === "") {
            setHourVal(0);
            onChange(0, minuteVal);
            return;
        }
        const num = Number(val);
        if (num > maxHours) return; // block
        setHourVal(num);
        onChange(num, minuteVal);
        if (val.length >= maxHours.toString().length) {
            minuteRef.current?.focus();
        }
    }

    function handleMinuteChange(e: React.ChangeEvent<HTMLInputElement>) {
        const val = e.target.value.replace(/\D/g, "");
        if (val === "") {
            setMinuteVal(0);
            onChange(hourVal, 0);
            return;
        }
        const num = Number(val);
        if (num > maxMinutes) return; // block
        setMinuteVal(num);
        onChange(hourVal, num);
    }

    function handleHourBlur() {
        if (!hourVal) {
            setHourVal(0);
            onChange(0, minuteVal);
        }
    }
    function handleMinuteBlur() {
        if (!minuteVal) {
            setMinuteVal(0);
            onChange(hourVal, 0);
        }
    }

    return (
        <div
            className={`flex items-center rounded-lg border border-borders bg-cards px-2 py-1 gap-1.5 ${className}`}
            aria-label="Time input"
        >
            <input
                ref={hourRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={hourVal === 0 ? "" : pad(hourVal)}
                onChange={handleHourChange}
                onBlur={handleHourBlur}
                placeholder="hh"
                min={0}
                max={maxHours}
                className="w-8 bg-transparent text-right outline-none border-none text-primary placeholder:text-muted"
                aria-label="Hours"
                autoComplete="off"
            />
            <span className="mx-1 text-secondary select-none font-medium">h</span>
            <input
                ref={minuteRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={minuteVal === 0 ? "" : pad(minuteVal)}
                onChange={handleMinuteChange}
                onBlur={handleMinuteBlur}
                placeholder="mm"
                min={0}
                max={maxMinutes}
                className="w-8 bg-transparent text-left outline-none border-none text-primary placeholder:text-muted"
                aria-label="Minutes"
                autoComplete="off"
            />
            <span className="ml-1 text-secondary select-none font-medium">m</span>
        </div>
    );
};
