import {FiChevronLeft} from "react-icons/fi";
import {SubmenuDefinition} from "./Dropdown";

export const SubmenuView = ({
                                submenu,
                                onBack,
                            }: {
    submenu: SubmenuDefinition;
    onBack: () => void;
}) => {

    return (
        <div>
            <div className="flex items-center px-3 py-3 border-b border-borders text-text-primary font-medium">
                <button onClick={onBack} className="mr-2 text-xl text-accent cursor-pointer">
                    <FiChevronLeft />
                </button>
                <span>{submenu.title}</span>
            </div>
            <div>{submenu.content}</div>
        </div>
    );
}