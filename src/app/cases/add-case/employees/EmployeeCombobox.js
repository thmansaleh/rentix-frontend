"use client";

import * as React from "react";
import { Check, ChevronsUpDown, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function EmployeeCombobox({
  employees = [],
  value,
  onValueChange,
  placeholder = "Select employee...",
  emptyText = "No employee found.",
  searchPlaceholder = "Search employees...",
  className,
  disabled = false,
  isLoading = false,
}) {
  const [open, setOpen] = React.useState(false);

  const selectedEmployee = employees.find((employee) => employee.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            !selectedEmployee && "text-muted-foreground",
            className
          )}
          disabled={disabled || isLoading}
        >
          {selectedEmployee ? (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{selectedEmployee.name}</span>
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {employees.map((employee) => (
                <CommandItem
                  key={employee.id}
                  value={employee.name}
                  onSelect={() => {
                    onValueChange(employee.id === value ? "" : employee.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === employee.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <User className="mr-2 h-4 w-4" />
                  <div>
                    <div className="font-medium">{employee.name}</div>
                    {employee.email && (
                      <div className="text-sm text-muted-foreground">
                        {employee.email}
                      </div>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default EmployeeCombobox;