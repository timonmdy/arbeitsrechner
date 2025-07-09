export default function PauseArbeitszeitSelector() {
    return (
        <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
                <h5 className="font-semibold mb-2 text-text-secondary">Pausenzeit</h5>
                <div className="inline-flex gap-2">
                    <button className="btn-selector">0:00</button>
                    <button className="btn-selector active">0:30</button>
                    <button className="btn-selector">0:45</button>
                </div>
            </div>
            <div className="text-center">
                <h5 className="font-semibold mb-2 text-text-secondary">Arbeitszeit</h5>
                <div className="inline-flex gap-2">
                    <button className="btn-selector">6:00</button>
                    <button className="btn-selector active">7:06</button>
                </div>
            </div>
        </div>
    )
}
