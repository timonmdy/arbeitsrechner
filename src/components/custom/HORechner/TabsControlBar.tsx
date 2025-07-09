import React from "react";

export type TabKey = "tagesrechner" | "stundenrechner";

export interface TabBarProps {
    activeTab: TabKey;
    onSwitch: (tab: TabKey) => void;
    className?: string;
}

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    {
        key: "tagesrechner",
        label: "Kalender",
        icon: (
            <svg className="w-5 h-5 mr-2 text-accent" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" fill="none"/>
                <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor"/>
            </svg>
        ),
    },
    {
        key: "stundenrechner",
        label: "Stundenrechner",
        icon: (
            <svg className="w-5 h-5 mr-2 text-accent" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none"/>
                <path d="M12 7v5l4 2" stroke="currentColor"/>
            </svg>
        ),
    },
];

export const TabsControlBar: React.FC<TabBarProps> = ({ activeTab, onSwitch, className = "" }) => {
    return (
        <nav
            className={`relative flex items-center bg-cards rounded-xl shadow-lg px-2 py-1 border border-borders w-fit mx-auto ${className}`}
            role="tablist"
            aria-label="Rechner Tabs"
        >
            {tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                    <button
                        key={tab.key}
                        role="tab"
                        aria-selected={isActive}
                        aria-controls={`panel-${tab.key}`}
                        id={`tab-${tab.key}`}
                        tabIndex={isActive ? 0 : -1}
                        className={`
              relative flex items-center px-5 py-2 mx-1 rounded-lg font-semibold transition-colors duration-200
              ${isActive
                            ? "text-accent bg-background shadow"
                            : "text-text-secondary hover:text-accent hover:bg-background/60"}
              focus:outline-none focus-visible:ring-2 focus-visible:ring-accent
            `}
                        onClick={() => onSwitch(tab.key)}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                );
            })}
        </nav>
    );
};
