import { IconType } from "react-icons";
import { NavLink } from "react-router";
import { Tooltip } from "react-tooltip";

interface SidebarItemProps {
    icon: IconType;
    label: string;
    to: string;
    description?: string;
}
export default function SidebarItem({ icon: Icon, label, to, description }: SidebarItemProps) {

    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center gap-4 px-3 py-3 rounded-lg text-sm font-medium ${!isActive && "hover:bg-cards/50"} transition-colors 
                ${isActive ? "bg-cards text-text-primary" : "text-text-secondary"}`
            }
            data-tooltip-id={label}
        >
            <Icon className="text-xl shrink-0" />
            <span className="truncate">{label}</span>
                <Tooltip id={label} place="right">
                    {description}
                </Tooltip>
        </NavLink>
    );
}
