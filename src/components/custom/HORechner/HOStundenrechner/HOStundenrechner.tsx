import React, {ChangeEvent, useEffect, useState} from "react";
import {LimitedNumberInput} from "../../../lib/form/LimitedNumberInput";
import {getDaysInMonth} from "date-fns";
import {SophisticatedTimeInput} from "../../../lib/form/SophisticatedTimeInput";
import {HOStundenData} from "../../../../types/Arbeitszeitrechner.types";
import {getHolidays, Region} from "feiertagejs";
import {getStorageValue, setStorageValue, StorageKey} from "../../../../storage/StorageProvider";

type ErrorState = {
    abwesenheit?: string;
    year?: string;
    arbeitszeit?: string;
    bereitsHOStunden?: string;
};

const months = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
];

const regions: { label: string; value: Region }[] = [
    { label: "Bundesweit", value: "BUND" },
    { label: "Baden-Württemberg", value: "BW" },
    { label: "Bayern", value: "BY" },
    { label: "Berlin", value: "BE" },
    { label: "Brandenburg", value: "BB" },
    { label: "Bremen", value: "HB" },
    { label: "Hamburg", value: "HH" },
    { label: "Hessen", value: "HE" },
    { label: "Mecklenburg-Vorpommern", value: "MV" },
    { label: "Niedersachsen", value: "NI" },
    { label: "Nordrhein-Westfalen", value: "NW" },
    { label: "Rheinland-Pfalz", value: "RP" },
    { label: "Saarland", value: "SL" },
    { label: "Sachsen", value: "SN" },
    { label: "Sachsen-Anhalt", value: "ST" },
    { label: "Schleswig-Holstein", value: "SH" },
    { label: "Thüringen", value: "TH" },
];

function load<T>(key: StorageKey, fallback?: T): T {
    const val = getStorageValue(key) as T;
    return val ?? fallback ?? ({} as T);
}


function getWorkingDays(year: number, month: number, region: Region): number {
    const holidays = getHolidays(year.toString(), region).map(value => value.date.toDateString());

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let workingDays = 0;

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);

        if (date.getDay() === 0 || date.getDay() === 6) continue; // weekend
        if (holidays.includes(date.toDateString())) continue; // holiday

        workingDays++;
    }

    return workingDays;
}

// Hilfsfunktion für Anzeige "hh:mm"
function formatHoursMinutes(decimalHours: number): string {
    const hours = Math.floor(decimalHours);
    const minutes = Math.round((decimalHours - hours) * 60);
    return `${Number.isNaN(hours) ? "--" : hours}:${Number.isNaN(minutes) ? "--" : minutes.toString().padStart(2, "0")}`;
}

export const HOStundenrechner = () => {
    const today = new Date();

    // State mit LocalStorage-Fallback
    const [region, setRegion] = useState<Region>(() => load<Region>("region", "BUND"));
    const [month, setMonth] = useState<number>(() => load<number>("hoMonat", today.getMonth()));
    const [year, setYear] = useState<number>(() => load<number>("hoJahr", today.getFullYear()));
    const [quote, setQuote] = useState<number>(() => load<number>("hoQuote", 60));
    const [abwesenheit, setAbwesenheit] = useState<number>(() => load<number>("hoAbwesenheit", 0));
    const [arbeitszeitProTag, setArbeitszeitProTag] = useState<string>(() => load<string>("arbeitszeitProTag", "07:06"));
    const [bereitsHOStunden, setBereitsHOStunden] = useState<HOStundenData>(() =>
        load<HOStundenData>("hoBereitsGearbeitet", { hours: 0, minutes: 0 })
    );
    const [errors, setErrors] = useState<ErrorState>({});

    // Speicherung bei Änderungen
    useEffect(() => { setStorageValue("region", region); }, [region]);
    useEffect(() => { setStorageValue("hoMonat", String(month)); }, [month]);
    useEffect(() => { setStorageValue("hoJahr", String(year)); }, [year]);
    useEffect(() => { setStorageValue("hoQuote", String(quote)); }, [quote]);
    useEffect(() => { setStorageValue("hoAbwesenheit", String(abwesenheit)); }, [abwesenheit]);
    useEffect(() => { setStorageValue("arbeitszeitProTag", arbeitszeitProTag); }, [arbeitszeitProTag]);
    useEffect(() => { setStorageValue("hoBereitsGearbeitet", JSON.stringify(bereitsHOStunden)); }, [bereitsHOStunden]);

    // Berechnungen
    const arbeitstage = getWorkingDays(year, month, region);
    const maxAbwesenheit = getDaysInMonth(new Date(year, month));
    const gearbeiteteTage = Math.max(0, arbeitstage - abwesenheit);

    // Arbeitszeit pro Tag parsen
    let [hours, minutes] = arbeitszeitProTag.split(":").map(Number);
    if (isNaN(hours)) hours = 0;
    if (isNaN(minutes)) minutes = 0;
    const arbeitszeitStunden = hours + minutes / 60;

    const gesamtArbeitsstunden = gearbeiteteTage * arbeitszeitStunden;
    const maxHOStunden = +(gesamtArbeitsstunden * (quote / 100)).toFixed(4);
    const bereitsGearbeitet = (bereitsHOStunden.hours) * 60 + (bereitsHOStunden.minutes);

    const restHOStunden = Math.max(
        0,
        +(((maxHOStunden * 60) - bereitsGearbeitet) / 60).toFixed(4)
    );

    // Validierung
    useEffect(() => {
        const newErrors: ErrorState = {};
        if (abwesenheit < 0 || abwesenheit > arbeitstage) {
            newErrors.abwesenheit = "Ungültige Anzahl an Abwesenheitstagen.";
        }
        if (year < 2020 || year > 2100) {
            newErrors.year = "Jahr muss zwischen 2020 und 2100 liegen.";
        }
        if (arbeitszeitStunden <= 0 || arbeitszeitStunden > 24) {
            newErrors.arbeitszeit = "Arbeitszeit pro Tag muss zwischen 0 und 24 Stunden liegen.";
        }
        if (
            bereitsHOStunden.hours < 0 || bereitsHOStunden.minutes < 0 ||
            (bereitsHOStunden.hours + bereitsHOStunden.minutes / 60) > maxHOStunden
        ) {
            newErrors.bereitsHOStunden = "Wert außerhalb des erlaubten Bereichs.";
        }
        setErrors(newErrors);
    }, [abwesenheit, year, arbeitszeitStunden, bereitsHOStunden, maxHOStunden, arbeitstage]);

    // Handler
    const handleMonthChange = (e: ChangeEvent<HTMLSelectElement>) => setMonth(Number(e.target.value));
    const handleYearChange = (e: ChangeEvent<HTMLInputElement>) => setYear(Number(e.target.value));
    const handleAbwesenheitChange = (tage: number) => setAbwesenheit(tage);
    const handleBereitsHOStundenChange = (data: HOStundenData) => setBereitsHOStunden(data);
    const handleArbeitszeitChange = (e: ChangeEvent<HTMLInputElement>) => setArbeitszeitProTag(e.target.value);
    const handleQuoteChange = (newValue: number) => setQuote(newValue);

    return (
        <div className="max-w-xl mx-auto mt-12 mb-12">
            <div className="rounded-2xl shadow-xl p-8 bg-cards border border-borders">
                <h1 className="text-3xl font-extrabold text-center mb-6 text-text-primary tracking-wide">
                    HomeOffice Stundenrechner
                </h1>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* HO Quote */}
                    <div>
                        <label className="block font-semibold mb-1 text-text-secondary"
                               htmlFor="hoStunden">HO-Quote</label>
                        <LimitedNumberInput
                            value={quote}
                            onChange={handleQuoteChange}
                            min={0}
                            max={100}
                            storageKey={"hoQuote"}
                            className="w-full rounded-lg border p-2 bg-background text-text-primary border-borders"
                            placeholder="0-100"
                        />
                    </div>
                    {/* Bundesland */}
                    <div>
                        <label className="block font-semibold mb-1 text-text-secondary"
                               htmlFor="region">Bundesland</label>
                        <select
                            id="region"
                            value={region}
                            onChange={e => setRegion(e.target.value as Region)}
                            className="w-full rounded-lg border border-borders bg-background p-2 text-text-primary"
                        >
                            {regions.map(r => (
                                <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Monat */}
                    <div>
                        <label className="block font-semibold mb-1 text-text-secondary" htmlFor="monat">Monat</label>
                        <select
                            id="monat"
                            value={month}
                            onChange={handleMonthChange}
                            className="w-full rounded-lg border border-borders bg-background p-2 text-text-primary"
                        >
                            {months.map((m, i) => (
                                <option key={m} value={i}>{m}</option>
                            ))}
                        </select>
                    </div>
                    {/* Jahr */}
                    <div>
                        <label className="block font-semibold mb-1 text-text-secondary" htmlFor="jahr">Jahr</label>
                        <input
                            id="jahr"
                            type="number"
                            value={year}
                            onChange={handleYearChange}
                            min={2020}
                            max={2100}
                            required
                            className={`w-full rounded-lg border p-2 bg-background text-text-primary ${errors.year ? 'border-error' : 'border-borders'}`}
                        />
                        {errors.year && <p className="text-error text-sm mt-1">{errors.year}</p>}
                    </div>
                    {/* Arbeitszeit pro Tag */}
                    <div>
                        <label className="block font-semibold mb-1 text-text-secondary" htmlFor="arbeitszeit">Tägliche
                            Arbeitszeit</label>
                        <input
                            id="arbeitszeit"
                            type="time"
                            step={300}
                            value={arbeitszeitProTag}
                            onChange={handleArbeitszeitChange}
                            required
                            className={`w-full rounded-lg border p-2 bg-background text-text-primary ${errors.arbeitszeit ? 'border-error' : 'border-borders'}`}
                        />
                        {errors.arbeitszeit && <p className="text-error text-sm mt-1">{errors.arbeitszeit}</p>}
                    </div>
                </form>

                <hr className="my-8 border-borders"/>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-center">
                    {/* Abwesenheitstage */}
                    <div>
                        <label className="block font-semibold mb-1 text-text-secondary"
                               htmlFor="abwesenheit">Abwesenheitstage</label>
                        <LimitedNumberInput
                            value={abwesenheit}
                            onChange={handleAbwesenheitChange}
                            min={0}
                            max={maxAbwesenheit}
                            storageKey={"hoAbwesenheit"}
                            className="w-full rounded-lg border p-2 bg-background text-text-primary border-borders"
                            placeholder={`0-${maxAbwesenheit}`}
                        />
                        {errors.abwesenheit && <p className="text-error text-sm mt-1">{errors.abwesenheit}</p>}
                    </div>
                    {/* Bereits HO Stunden */}
                    <div>
                        <label className="block font-semibold mb-1 text-text-secondary" htmlFor="hoStunden">Bereits im HomeOffice gearbeitete Stunden</label>
                        <SophisticatedTimeInput
                            hours={bereitsHOStunden.hours ?? 0}
                            minutes={bereitsHOStunden.minutes ?? 0}
                            onChange={(h, m) => handleBereitsHOStundenChange({ hours: h, minutes: m })}
                            maxHours={99}
                            maxMinutes={59}
                            storageKey="hoBereitsGearbeitet"
                            className="w-full rounded-lg border p-2 bg-background text-text-primary border-borders"
                        />
                        {errors.bereitsHOStunden && <p className="text-error text-sm mt-1">{errors.bereitsHOStunden}</p>}
                    </div>
                </form>

                <hr className="my-8 border-borders" />

                <div className="mt-4">
                    <h2 className="text-xl font-bold mb-4 text-accent">Ergebnis</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Info label="Berechneter Monat" value={`${months[month]} ${year}`} />
                        <Info label="Arbeitstage" value={arbeitstage} />
                        <Info label="Gearbeitete Tage (abzgl. Abwesenheit)" value={gearbeiteteTage} />
                        <Info label="Gesamtarbeitsstunden" value={formatHoursMinutes(gesamtArbeitsstunden)} />
                        <Info label="Max. HomeOffice-Stunden" value={formatHoursMinutes(maxHOStunden)} />
                        <Info label="Bereits im HomeOffice gearbeitet" value={formatHoursMinutes(bereitsGearbeitet / 60)} />
                        <Info label="Restliche HomeOffice-Stunden" value={formatHoursMinutes(restHOStunden)} />
                    </div>
                    {Object.keys(errors).length > 0 && (
                        <div className="bg-warning/10 border-l-4 border-warning text-warning p-4 mt-6 rounded-lg">
                            Bitte prüfe deine Eingaben!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

type InfoProps = {
    label: string;
    value: string | number;
};

function Info({ label, value }: InfoProps) {
    return (
        <div>
            <div className="text-sm text-text-secondary font-semibold">{label}:</div>
            <div className="text-base text-text-primary ml-1">{value}</div>
        </div>
    );
}
