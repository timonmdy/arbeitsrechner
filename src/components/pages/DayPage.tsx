import React, { useState, useEffect, ChangeEvent } from "react";
import { getStorageValue, setStorageValue } from "../../storage/StorageProvider";

// Hilfsfunktionen
function toMinutes(t: string): number {
    if (!t) return 0;
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
}
function toTime(min: number): string {
    const isNegative = min < 0;
    const absMin = Math.abs(min);
    const h = Math.floor(absMin / 60);
    const m = absMin % 60;
    const sign = isNegative ? "-" : "";
    return `${sign}${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}
function clamp(v: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, v));
}
function todayStr() {
    return new Date().toISOString().slice(0, 10);
}

// Internal rounding functions
function roundDownToNearest5(min: number): number {
    return min - (min % 5);
}
function roundUpToNearest5(min: number): number {
    return min % 5 === 0 ? min : min + (5 - (min % 5));
}

type PauseOption = "00:00" | "00:30" | "00:45";
const pauseOptions: PauseOption[] = ["00:00", "00:30", "00:45"];

const Arbeitszeitrechner: React.FC = () => {
    const [arbeitszeitProTag, setArbeitszeitProTag] = useState<string>("07:06");
    const [pause, setPause] = useState<PauseOption>("00:30");
    const [start, setStart] = useState<string>("");
    const [manualEnd, setManualEnd] = useState<boolean>(false);
    const [end, setEnd] = useState<string>("");

    useEffect(() => {
        const storedArb = getStorageValue("arbeitszeitProTag") as string;
        if (storedArb) setArbeitszeitProTag(storedArb);

        const stored = getStorageValue("arbeitsbeginn") as {
            value: string;
            date: string;
        };
        if (stored) {
            try {
                const { value, date } = stored;
                if (date === todayStr()) setStart(value);
                else localStorage.removeItem("arbeitsbeginn");
            } catch {
                localStorage.removeItem("arbeitsbeginn");
            }
        }
    }, []);

    useEffect(() => {
        if (arbeitszeitProTag) setStorageValue("arbeitszeitProTag", arbeitszeitProTag);
    }, [arbeitszeitProTag]);

    useEffect(() => {
        if (start) {
            setStorageValue(
                "arbeitsbeginn", { value: start, date: todayStr() }
            );
        }
    }, [start]);

    // Internal rounding for calculations
    const rawStartMin = toMinutes(start);
    const rawEndMin = toMinutes(end);

    const startMin = start ? roundDownToNearest5(rawStartMin) : 0;
    const endMin = end ? roundUpToNearest5(rawEndMin) : 0;

    const sollMin = toMinutes(arbeitszeitProTag);
    const pauseMin = toMinutes(pause);

    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();

    // Berechnung: Bis jetzt gearbeitet
    // Die Anwesenheitszeit ist: jetzt - Start
    // Die Arbeitszeit ist: Anwesenheitszeit - Pause (wenn Pause greift)
    const totalDuration = nowMin - startMin;
    const effectivePause = totalDuration >= 360 ? pauseMin : 0;
    const workedMin = start
        ? clamp(nowMin - startMin - effectivePause, 0, 24 * 60)
        : 0;

    // Gleitzeit (bei sofortigem Ende = jetzt)
    const gleitzeitSofort = workedMin - sollMin;

    // Gleitzeit basierend auf tatsächlichem Arbeitsende (wenn gesetzt)
    // Anwesenheitszeit (Ende - Start) minus Pause = tatsächliche Arbeitszeit
    const totalPresenceTime = end && start ? endMin - startMin : 0;
    const effectivePauseForEnd = totalPresenceTime >= 360 ? pauseMin : 0;
    const actualWorkedWithEnd = end && start ? totalPresenceTime - effectivePauseForEnd : workedMin;
    const gleitzeit = end && start ? actualWorkedWithEnd - sollMin : gleitzeitSofort;

    // Progress basierend auf tatsächlichem Zeitraum (Start bis Ende)
    const totalWorkPeriod = end && start ? endMin - startMin : sollMin + pauseMin;
    const elapsedSinceStart = start ? nowMin - startMin : 0;
    const progress = totalWorkPeriod > 0 ? clamp((elapsedSinceStart / totalWorkPeriod) * 100, 0, 100) : 0;

    useEffect(() => {
        if (start && !manualEnd) {
            const autoEndMin = startMin + sollMin + pauseMin;
            setEnd(toTime(autoEndMin));
        }
        // eslint-disable-next-line
    }, [start, arbeitszeitProTag, pause]);

    useEffect(() => {
        if (!start) {
            setEnd("");
            setManualEnd(false);
        }
    }, [start]);

    const [countdown, setCountdown] = useState<string>("--:--:--");
    useEffect(() => {
        if (!start || !end) {
            setCountdown("--:--:--");
            return;
        }
        const update = () => {
            const now = new Date();
            const nowMin = now.getHours() * 60 + now.getMinutes();
            const nowSec = now.getSeconds();
            const targetMin = toMinutes(end);
            let restSec = (targetMin - nowMin) * 60 - nowSec;
            if (restSec < 0) restSec = 0;
            const h = Math.floor(restSec / 3600);
            const m = Math.floor((restSec % 3600) / 60);
            const s = restSec % 60;
            setCountdown(
                `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
                    .toString()
                    .padStart(2, "0")}`
            );
        };
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [start, end]);

    const handleStartChange = (e: ChangeEvent<HTMLInputElement>) => {
        setStart(e.target.value);
        setManualEnd(false);
    };

    const handleEndChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEnd(e.target.value);
        setManualEnd(true);
    };

    const handleArbeitszeitChange = (e: ChangeEvent<HTMLInputElement>) => {
        setArbeitszeitProTag(e.target.value);
        setManualEnd(false);
    };

    const reset = () => {
        setArbeitszeitProTag("07:06");
        setPause("00:30");
        setStart("");
        setEnd("");
        setManualEnd(false);
        localStorage.removeItem("arbeitsbeginn");
        localStorage.removeItem("arbeitszeitProTag");
    };

    return (
        <main className="container mx-auto pt-24">
            <div className="max-w-2xl mx-auto rounded-3xl p-8 bg-neutral-900/80 border border-neutral-800 shadow-2xl backdrop-blur-lg">
                <h1 className="text-4xl font-extrabold text-white mb-8 text-center tracking-tight">
                    Arbeitszeitrechner
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="flex flex-col gap-6 items-center">
                        <div>
                            <h5 className="font-semibold mb-2 text-neutral-300">Pausenzeit</h5>
                            <div className="flex gap-2">
                                {pauseOptions.map((p) => (
                                    <button
                                        key={p}
                                        className={`px-4 py-2 rounded-lg font-bold transition-all border-2 ${
                                            pause === p
                                                ? "bg-emerald-500/80 text-white border-emerald-500 shadow-lg scale-105"
                                                : "bg-neutral-800/60 text-neutral-300 border-neutral-700 hover:bg-neutral-700"
                                        }`}
                                        onClick={() => {
                                            setPause(p);
                                            setManualEnd(false);
                                        }}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h5 className="font-semibold mb-2 text-neutral-300">Tägliche Arbeitszeit</h5>
                            <input
                                type="time"
                                step={300}
                                value={arbeitszeitProTag}
                                onChange={handleArbeitszeitChange}
                                className="w-32 px-4 py-2 rounded-lg border-2 border-neutral-700 bg-neutral-800 text-white font-bold text-lg focus:ring-2 focus:ring-emerald-400 outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-6 items-center">
                        <div>
                            <label className="block text-neutral-300 font-semibold mb-1" htmlFor="start">
                                Arbeitsbeginn
                            </label>
                            <input
                                type="time"
                                id="start"
                                value={start}
                                onChange={handleStartChange}
                                className="w-32 px-4 py-2 rounded-lg border-2 border-neutral-700 bg-neutral-800 text-white font-bold text-lg focus:ring-2 focus:ring-emerald-400 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-neutral-300 font-semibold mb-1" htmlFor="end">
                                Arbeitsende
                            </label>
                            <input
                                type="time"
                                id="end"
                                value={end}
                                onChange={handleEndChange}
                                className="w-32 px-4 py-2 rounded-lg border-2 border-neutral-700 bg-neutral-800 text-white font-bold text-lg focus:ring-2 focus:ring-emerald-400 outline-none"
                            />
                        </div>
                    </div>
                </div>
                <div className="rounded-2xl p-8 bg-neutral-800/90 shadow-xl mb-8 relative">
                    <div className="mb-6">
                        <div className="flex justify-between mb-1">
                            <span className="text-neutral-300 font-semibold">Fortschritt</span>
                        </div>
                        <div className="w-full h-4 bg-neutral-700 rounded-full overflow-hidden">
                            <div
                                className="h-4 rounded-full transition-all duration-500 flex flex-row items-center"
                                style={{
                                    width: `${progress}%`,
                                    background:
                                        "linear-gradient(90deg, #34d399 0%, #38bdf8 50%, #818cf8 100%)",
                                }}
                            >
                <span className={`ms-auto mr-2 text-[10px]`}>
                  {progress > 5 && (progress.toFixed(0) + "%")}{" "}
                </span>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
                        <div>
                            <div className="text-neutral-400 text-sm mb-1">Arbeitszeit Soll</div>
                            <div className="text-2xl font-extrabold text-white">{arbeitszeitProTag} h</div>
                        </div>
                        <div>
                            <div className="text-neutral-400 text-sm mb-1">Bis jetzt gearbeitet</div>
                            <div className="text-2xl font-extrabold text-white">{toTime(workedMin)} h</div>
                        </div>
                        <div>
                            <div className="text-neutral-400 text-sm mb-1">Gleitzeit</div>
                            <div className={`text-2xl font-extrabold ${
                                gleitzeit >= 0 ? "text-emerald-400" : "text-rose-400"
                            }`}>{toTime(gleitzeit)} h</div>
                        </div>
                        <div>
                            <div className="text-neutral-400 text-sm mb-1">Verbleibend</div>
                            <div className="text-2xl font-extrabold text-white">{countdown}</div>
                        </div>
                        <div></div>
                        <div>
                            <div className="text-neutral-400 text-sm mb-1">Gleitzeit (bei sofortigem Ende)</div>
                            <div
                                className={`text-2xl font-extrabold ${
                                    gleitzeitSofort >= 0 ? "text-emerald-400" : "text-rose-400"
                                }`}
                            >
                                {toTime(gleitzeitSofort)} h
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center">
                    <button
                        onClick={reset}
                        className="px-8 py-3 rounded-xl bg-neutral-800 text-white font-bold text-lg shadow hover:bg-emerald-500/80 hover:text-white transition-all border-2 border-neutral-700"
                    >
                        Reset
                    </button>
                </div>
            </div>
        </main>
    );
};

export default Arbeitszeitrechner;
