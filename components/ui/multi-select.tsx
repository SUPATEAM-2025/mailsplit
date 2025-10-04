"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface MultiSelectProps {
  options: Array<{ value: string; label: string }>;
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
  className,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    onChange(newSelected);
  };

  const handleRemove = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter((item) => item !== value));
  };

  const selectedLabels = selected
    .map((value) => options.find((opt) => opt.value === value)?.label)
    .filter(Boolean);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div
        className={cn(
          "flex min-h-10 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer",
          "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          isOpen && "ring-2 ring-ring ring-offset-2"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-1 flex-1">
          {selected.length === 0 ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : (
            selectedLabels.map((label, index) => (
              <Badge
                key={selected[index]}
                variant="secondary"
                className="gap-1 pr-1"
              >
                <span>{label}</span>
                <X
                  className="h-3 w-3 hover:text-destructive cursor-pointer"
                  onClick={(e) => handleRemove(selected[index], e)}
                />
              </Badge>
            ))
          )}
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full rounded-lg border bg-popover text-popover-foreground shadow-md">
          <div className="max-h-60 overflow-auto p-1">
            {options.map((option) => {
              const isSelected = selected.includes(option.value);
              return (
                <div
                  key={option.value}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center rounded-md px-2 py-1.5 text-sm outline-none",
                    "hover:bg-accent hover:text-accent-foreground",
                    isSelected && "bg-accent/50"
                  )}
                  onClick={() => handleToggle(option.value)}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "h-4 w-4 rounded border flex items-center justify-center",
                        isSelected && "bg-primary border-primary"
                      )}
                    >
                      {isSelected && (
                        <div className="h-2 w-2 rounded-sm bg-primary-foreground" />
                      )}
                    </div>
                    <span>{option.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
