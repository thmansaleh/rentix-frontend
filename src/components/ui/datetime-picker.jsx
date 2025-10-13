"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

export function DateTimePicker({ date, setDate, placeholder = "Pick a date and time" }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedDateTime, setSelectedDateTime] = React.useState(date);
  const [timeValue, setTimeValue] = React.useState(
    date ? format(date, "HH:mm") : "09:00"
  );

  React.useEffect(() => {
    if (date) {
      setSelectedDateTime(date);
      setTimeValue(format(date, "HH:mm"));
    }
  }, [date]);

  const handleDateSelect = (selectedDate) => {
    if (selectedDate) {
      const [hours, minutes] = timeValue.split(":");
      const newDateTime = new Date(selectedDate);
      newDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      setSelectedDateTime(newDateTime);
      setDate(newDateTime);
    }
  };

  const handleTimeChange = (e) => {
    const time = e.target.value;
    setTimeValue(time);

    if (selectedDateTime) {
      const [hours, minutes] = time.split(":");
      const newDateTime = new Date(selectedDateTime);
      newDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      setSelectedDateTime(newDateTime);
      setDate(newDateTime);
    }
  };

  const handleOpenChange = (open) => {
    setIsOpen(open);
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP HH:mm") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 border-b">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 opacity-50" />
            <Input
              type="time"
              value={timeValue}
              onChange={handleTimeChange}
              className="w-full"
            />
          </div>
        </div>
        <Calendar
          mode="single"
          selected={selectedDateTime}
          onSelect={handleDateSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
