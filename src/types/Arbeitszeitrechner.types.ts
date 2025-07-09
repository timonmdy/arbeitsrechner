import {IconType} from "react-icons";

export type DayStatus = "neutral" | "homeoffice" | "on-site" | "off";

export interface StatusConfig {
    key: DayStatus;
    label: string;
    color: string; // Tailwind color class
    border: string; // Tailwind border color class
    icon: IconType;
}

export interface DayStatusMap {
    month: number;
    days: { [date: string]: DayStatus };
}

export interface HOStundenData {
    hours: number,
    minutes: number
}