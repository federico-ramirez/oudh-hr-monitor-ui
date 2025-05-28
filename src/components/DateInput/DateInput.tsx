import React from "react";

type DateInputProps = {
    value: string;
    min?: string;
    max?: string;
    onChange: (date: string) => void;
    className?: string;
};

export const DateInput: React.FC<DateInputProps> = ({
    value,
    min,
    max,
    onChange,
    className = '',
}) => {
    return (
        <input
            type="date"
            value={value}
            min={min}
            max={max}
            onChange={(e) => onChange(e.target.value)}
            className={`h-10 px-4 bg-white rounded-sm focus:outline-indigo-900 ${className}`}
        />
    )
}