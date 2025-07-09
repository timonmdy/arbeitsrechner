export default function TimeInputs() {
    return (
        <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
                <div className="text-center mb-1">
                    <label htmlFor="start">Arbeitsbeginn</label>
                </div>
                <input
                    type="time"
                    id="start"
                    className="w-full border border-borders rounded px-2 py-1 bg-background text-text-primary"
                />
            </div>
            <div>
                <div className="text-center mb-1">
                    <label htmlFor="pause">Pausenzeit</label>
                </div>
                <input
                    type="time"
                    id="pause"
                    className="w-full border border-borders rounded px-2 py-1 bg-background text-text-primary"
                    value="00:30"
                    readOnly
                />
            </div>
            <div>
                <div className="text-center mb-1">
                    <label htmlFor="end">Arbeitsende</label>
                </div>
                <input
                    type="time"
                    id="end"
                    className="w-full border border-borders rounded px-2 py-1 bg-background text-text-primary"
                    readOnly
                />
            </div>
            {/* Zweite Zeile */}
            <div>
                <div className="text-center mb-1">
                    <label htmlFor="soll">Arbeitszeit</label>
                </div>
                <input
                    type="time"
                    id="soll"
                    className="w-full border border-borders rounded px-2 py-1 bg-background text-text-primary"
                    value="07:06"
                    readOnly
                />
            </div>
            <div>
                <div className="text-center mb-1">
                    <label htmlFor="float">Gleitzeit</label>
                </div>
                <input
                    id="float"
                    className="w-full border border-borders rounded px-2 py-1 bg-background text-text-primary"
                    value="0.00"
                    readOnly
                />
            </div>
            <div>
                <div className="text-center mb-1">&nbsp;</div>
                <button className="w-full btn-selector">Reset</button>
            </div>
        </div>
    )
}
