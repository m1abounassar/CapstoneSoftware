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
        <option value="">Select a Team</option>
        <option value="t1">Team 1</option>
        <option value="t2">Team 2</option>
        <option value="t3">Team 3</option>
        <option value="cus">Custom</option>
      </select>
    </div>
  );
};

export { Dropdown };
