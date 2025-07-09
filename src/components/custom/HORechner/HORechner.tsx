import React, {useState} from "react";
import {TabKey, TabsControlBar} from "./TabsControlBar";
import {HOKalender} from "./HOKalender/HOKalender";
import {HOStundenrechner} from "./HOStundenrechner/HOStundenrechner";

export const HORechner: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabKey>("tagesrechner");

    return (
        <div>
            <div className={`my-4`}>
                <TabsControlBar activeTab={activeTab} onSwitch={setActiveTab} />
            </div>
            <div>
                {activeTab === "tagesrechner" ? (<HOKalender />) : (<HOStundenrechner />)}
            </div>
        </div>
    )
}