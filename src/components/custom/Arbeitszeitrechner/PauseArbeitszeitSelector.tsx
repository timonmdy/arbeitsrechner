import React, {ChangeEvent, useState} from "react";
import {getStorageValue} from "../../../storage/StorageProvider";

export default function PauseArbeitszeitSelector() {

    const [arbeitszeitProTag, setArbeitszeitProTag] = useState<string>(() => getStorageValue("arbeitszeitProTag") as string);
    const handleArbeitszeitChange = (e: ChangeEvent<HTMLInputElement>) => setArbeitszeitProTag(e.target.value);

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
                <h5 className="font-semibold mb-2 text-text-secondary">Tägliche Arbeitszeit</h5>
                <div className="inline-flex gap-2">
                    <input
                        id="arbeitszeit"
                        type="time"
                        step={300}
                        value={arbeitszeitProTag}
                        onChange={handleArbeitszeitChange}
                        required
                        className={`w-full rounded-lg border p-2 bg-background text-text-primary border-borders`}
                    />
                </div>
            </div>
        </div>
    )
}
