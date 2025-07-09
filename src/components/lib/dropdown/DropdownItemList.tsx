import {DropdownItem} from "./Dropdown";

export const ItemList = ({
                             items,
                             onItemClick,
                         }: {
    items: DropdownItem[];
    onItemClick: (item: DropdownItem) => void;
}) => (
    <>
        {items.map((item, idx) => (
            <button
                key={idx}
                onClick={() => onItemClick(item)}
                className="w-full px-4 py-3 text-left flex items-center gap-3 text-text-primary hover:bg-cards focus:outline-none transition-all"
            >
                <span className="text-accent text-xl">{item.icon}</span>
                {item.label}
            </button>
        ))}
    </>
);