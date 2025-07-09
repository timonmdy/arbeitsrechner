import React, {useEffect, useState} from "react";
import {getStorageValue, setStorageValue, StorageKey} from "../../../storage/StorageProvider";

type LimitedNumberInputProps = {
    value: number;
    onChange: (newValue: number) => void;
    min: number;
    max: number;
    className?: string;
    storageKey?: StorageKey;
    placeholder?: string;
};

export const LimitedNumberInput: React.FC<LimitedNumberInputProps> = ({
                                                                          value,
                                                                          onChange,
                                                                          min,
                                                                          max,
                                                                          className,
                                                                          storageKey,
                                                                          placeholder,
                                                                      }) => {
    const [inputValue, setInputValue] = useState<string>(value.toString());

    // Sync from storageKey (if provided) on mount
    useEffect(() => {
        if (!storageKey) return;
        const stored = getStorageValue(storageKey);
        if (
            typeof stored === "number" &&
            stored >= min &&
            stored <= max &&
            stored !== value
        ) {
            onChange(stored);
        }
        // eslint-disable-next-line
    }, [storageKey, min, max]);

    // Sync storage when value changes
    useEffect(() => {
        if (storageKey) {
            setStorageValue(storageKey, value);
        }
    }, [storageKey, value]);

    // Sync inputValue when value prop changes (external state)
    useEffect(() => {
        setInputValue(value.toString());
    }, [value]);

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const raw = e.target.value;

        // Allow empty input for editing
        if (raw === "") {
            setInputValue("");
            return;
        }

        // Only allow digits
        const digitsOnly = raw.replace(/[^0-9]/g, "");
        if (digitsOnly === "") {
            setInputValue("");
            return;
        }

        // Convert to number to check range
        const num = Number(digitsOnly);

        // Only allow input if within range
        if (num >= min && num <= max) {
            setInputValue(digitsOnly);
            onChange(num);
        } else {
            // Block input: revert to last valid value (do not update inputValue)
            // Optionally, you can provide feedback here
        }
    }

    function handleBlur() {
        if (inputValue === "") {
            setInputValue(min.toString());
            onChange(min);
        }
    }

    return (
        <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            min={min}
            max={max}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder={placeholder ?? `${min}-${max}`}
            className={className}
            autoComplete="off"
        />
    );
};
