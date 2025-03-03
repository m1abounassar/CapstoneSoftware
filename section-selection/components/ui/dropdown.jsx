import * as React from "react";
import { cn } from "@/lib/utils";

const Dropdown = ({ value, onChange, className }) => {
  const handleChange = (event) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <div>
      <select
        value={value}
        onChange={handleChange}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
      >
        <option value="1">8:25 - 9:15</option>
        <option value="2">9:30 - 10:20</option>
        <option value="3">11:00 - 11:50</option>
        <option value="4">12:30 - 1:20</option>
        <option value="4">2:00 - 2:50</option>
        <option value="4">3:30 - 4:20</option>
        <option value="4">5:00 - 5:50</option>
        <option value="4">6:30 - 7:20</option>



      </select>
    </div>
  );
};

export { Dropdown };
