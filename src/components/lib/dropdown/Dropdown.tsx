import React, { useEffect, useRef, useState, useCallback } from "react";
import clsx from "clsx";
import { SubmenuView } from "./DropdownSubmenuView";
import { ItemList } from "./DropdownItemList";
import { DropdownButton } from "./DropdownButton";

export interface DropdownLinkItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export interface DropdownSubmenuItem {
  label: string;
  icon: React.ReactNode;
  submenu: SubmenuDefinition;
}

export interface SubmenuDefinition {
  title: string;
  content: React.ReactNode;
}

export type DropdownItem = DropdownLinkItem | DropdownSubmenuItem;

export interface DropdownProps {
  label?: string;
  icon?: React.ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({
                                                    label,
                                                    icon,
                                                    items,
                                                    align = "right",
                                                    isOpen,
                                                    onOpenChange,
                                                  }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [internalOpen, setInternalOpen] = useState(false);
  const [submenu, setSubmenu] = useState<SubmenuDefinition | null>(null);

  const open = isOpen ?? internalOpen;

  const setOpen = useCallback((value: boolean) => {
    if (isOpen === undefined) setInternalOpen(value);
    onOpenChange?.(value);
    setSubmenu(null);
  }, [isOpen, onOpenChange]);

  const toggleDropdown = () => setOpen(!open);

  const handleItemClick = useCallback((item: DropdownItem) => {
    if ("onClick" in item) {
      item.onClick();
      setOpen(false);
    } else {
      setSubmenu(item.submenu);
    }
  }, [setOpen]);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }, [setOpen]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  const dropdownClasses = clsx(
      "absolute mt-2 w-56 rounded-xl overflow-hidden shadow-lg bg-background border border-borders z-50 transition-all animate-fade-in",
      align === "right" ? "right-0" : "left-0"
  );

  return (
      <div className="relative inline-block" ref={ref}>
        <DropdownButton icon={icon} label={label} onClick={toggleDropdown} isOpen={open} />

        {open && (
            <div className={dropdownClasses}>
              {submenu ? (
                  <SubmenuView submenu={submenu} onBack={() => setSubmenu(null)} />
              ) : (
                  <ItemList items={items} onItemClick={handleItemClick} />
              )}
            </div>
        )}
      </div>
  );
};
