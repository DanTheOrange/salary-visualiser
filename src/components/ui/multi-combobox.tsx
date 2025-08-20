"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandCurrencyInput,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { NumericFormat } from "react-number-format";

type Option = {
  value: string;
  label: string;
};

type MultiComboboxProps = {
  options: Option[];
  className?: string;
  values: string[];
  onChange: (value: string[]) => void;
};

// Always fully controlled becasue that's all I need
export function MultiCombobox({
  options,
  className,
  values,
  onChange,
}: MultiComboboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between", className)}
        >
          {values.length > 0
            ? options.find((option) => option.value === values[0])?.label
            : "Select option..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
        <Command>
          <CommandCurrencyInput
            placeholder="Search framework..."
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    const newValues = values.includes(currentValue)
                      ? values.filter((v) => v !== currentValue)
                      : [...values, currentValue];
                    onChange(newValues);
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      values.includes(option.value)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
