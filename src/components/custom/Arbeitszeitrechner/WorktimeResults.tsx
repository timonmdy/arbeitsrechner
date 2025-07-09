export default function WorktimeResults() {
    return (
        <div className="mt-8 bg-background rounded-lg border border-borders p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                    <label htmlFor="countedworktime" className="block text-text-secondary">Gewertete Arbeitszeit</label>
                    <p className="text-2xl font-bold" id="countedworktime">0.00</p>
                </div>
                <div>
                    <label htmlFor="trueworktime" className="block text-text-secondary">Tatsächliche Arbeitszeit</label>
                    <p className="text-2xl font-bold" id="trueworktime">0.00</p>
                </div>
                <div>
                    <label htmlFor="gleitzeit" className="block text-text-secondary">Gleitzeit</label>
                    <p className="text-2xl font-bold" id="gleitzeit">0.00</p>
                </div>
            </div>
            {/* Countdown Platzhalter */}
            <div className="mt-4 flex justify-center">
                <div className="w-40 h-20 bg-cards rounded flex items-center justify-center text-text-muted">
                    Countdown
                </div>
            </div>
        </div>
    )
}
