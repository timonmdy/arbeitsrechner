import {IconType} from "react-icons";
import {FaCalendar, FaClock, FaCog, FaHome, FaList} from "react-icons/fa";

export const sidebarItems: {
    icon: IconType;
    label: string;
    to: string;
    description: string;
}[] = [
    { icon: FaHome, label: "Home", to: "/", description: "Übersicht" },
    { icon: FaClock, label: "Tageszeit", to: "/day", description: "Arbeitszeit für den aktuellen Tag" },
    { icon: FaList, label: "Wochenzeit", to: "/week", description: "Arbeitszeit für die aktuelle Woche" },
    { icon: FaCalendar, label: "HomeOffice", to: "/homeoffice", description: "Übersicht der HomeOffice-Tage" },
];
