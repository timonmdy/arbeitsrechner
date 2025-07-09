import SidebarItem from "./SidebarItem";
import 'react-tooltip/dist/react-tooltip.css';
import {sidebarItems} from "../../../config/Sidebar.config";

export default function Sidebar() {
    return (
        <aside
            className={`fixed top-4 left-0 h-[calc(100vh-4rem)] bg-background  z-40 transition-all duration-300 ease-in-out w-60`}
        >
            {/* Scrollable Container */}
            <div
                className={`h-full overflow-y-auto scrollbar-thin scrollbar-thumb-borders scrollbar-track-transparent`}
            >
                <nav className="flex flex-col gap-1 px-2 pt-2">
                    {sidebarItems.map((item, index) => (
                        <SidebarItem key={index} {...item} />
                    ))}
                </nav>
            </div>
        </aside>
    );
}
