import * as React from "react";
import { cn } from "@/lib/utils";

const colorMap = {
  "1": "text-green-500",
  "2": "text-yellow-500",
  "3": "text-red-500",
};

const Dropdown = ({ value: propValue = "3", onChange, className }) => {
  const [value, setValue] = React.useState(propValue); // Local state for color change
  const [open, setOpen] = React.useState(false);

  const handleSelect = (newValue) => {
    setValue(newValue); // Update local state
    if (onChange) {
      onChange(newValue);
    }
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-2 shadow-sm transition-all focus:outline-none justify-self-end mr-5"
      >
        <span className={cn("text-3xl", colorMap[value])}>●</span>
      </button>

      {open && (
        <div className="absolute left-3/4 px-1 bg-white border border-gray-300 rounded-md shadow-lg z-50">
          {["1", "2", "3"].map((item) => (
            <div
              key={item}
              onClick={() => handleSelect(item)}
              className={cn(
                "p-1 cursor-pointer text-3xl hover:bg-gray-100 flex justify-center",
                colorMap[item]
              )}
            >
              ●
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { Dropdown };
