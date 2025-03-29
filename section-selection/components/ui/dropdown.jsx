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
  const dropdownRef = React.useRef(null); // Ref to detect outside clicks

  const handleSelect = (newValue) => {
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
    setOpen(false);
  };

  // Close dropdown if clicked outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center justify-end mr-5">
        <div
          className="flex items-center justify-center rounded-md border border-gray-300 h-12 w-12 bg-white px-2 shadow-sm transition-all focus:outline-none justify-self-end mr-5"
        >
          <span className={cn("text-6xl pb-2", colorMap[value])}>●</span>
        </div>

        <button
          className='bg-[url("/dropDown.png")] hover:bg-[url("/dropDownHover.png")] bg-contain bg-no-repeat w-6 h-6'
          onClick={() => setOpen(!open)}
        >
        </button>
      </div>

      {open && (
        <div className="absolute left-[48%] bg-white border border-gray-300 rounded-md shadow-lg z-50">
          {["1", "2", "3"].map((item) => (
            <div
              key={item}
              onClick={() => handleSelect(item)}
              className={cn(
                "p-1 cursor-pointer text-6xl hover:bg-gray-100 flex h-15 w-12 justify-center",
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
