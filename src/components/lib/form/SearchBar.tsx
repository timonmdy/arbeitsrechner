import React from "react";
import { FaSearch } from "react-icons/fa";

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ value, onChange, placeholder = "Search...", className = "", ...props }, ref) => {
    return (
      <div className={`relative w-full ${className}`}>
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full pl-10 pr-3 py-2 rounded-md
            bg-cards border border-borders
            text-text-primary placeholder-text-secondary
            shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent
            transition duration-200 ease-in-out
          `}
          {...props}
        />
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";

export default SearchBar;
