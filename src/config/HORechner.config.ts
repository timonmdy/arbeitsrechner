import { FaHome, FaBuilding, FaUmbrellaBeach, FaRegCircle } from "react-icons/fa";
import {StatusConfig} from "../types/Arbeitszeitrechner.types";

export const ARBEITSFREIE_TAGE = ["SA", "SO"];

export const statusConfigs: StatusConfig[] = [
    {
        key: "neutral",
        label: "Neutral",
        color: "bg-cards",
        border: "border-borders",
        icon: FaRegCircle,
    },
    {
        key: "homeoffice",
        label: "Home Office",
        color: "bg-accent",
        border: "border-accent",
        icon: FaHome,
    },
    {
        key: "on-site",
        label: "Vor Ort",
        color: "bg-success",
        border: "border-success",
        icon: FaBuilding,
    },
    {
        key: "off",
        label: "Arbeitsfrei",
        color: "bg-warning",
        border: "border-warning",
        icon: FaUmbrellaBeach,
    },
];
