import React from 'react';
import WorktimeResults from "../custom/Arbeitszeitrechner/WorktimeResults";
import TimeInputs from "../custom/Arbeitszeitrechner/TimeInputs";
import PauseArbeitszeitSelector from "../custom/Arbeitszeitrechner/PauseArbeitszeitSelector";

const DayPage: React.FC = () => {

    return (
        <main className="container mx-auto pt-24">
            <div className="bg-cards rounded-lg shadow p-6">
                <PauseArbeitszeitSelector/>
                <div className="my-4 border-t border-borders"/>
                <TimeInputs/>
                <WorktimeResults/>
            </div>
        </main>
    );
};

export default DayPage;