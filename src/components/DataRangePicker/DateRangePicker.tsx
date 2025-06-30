import React, { useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { type DateRange } from "react-day-picker";

interface DateRangePickerProps {
  defaultMonth?: Date | null;
  selected?: DateRange | undefined;
  onSelect?: (dateRange: DateRange | undefined) => void;
  className?: string;
  placeholder?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  defaultMonth = null,
  selected = undefined,
  onSelect = () => {},
  className = "",
  placeholder = "Select date range",
}) => {
  // Handle null defaultMonth by using current date as fallback
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    if (
      defaultMonth &&
      defaultMonth instanceof Date &&
      !isNaN(defaultMonth.getTime())
    ) {
      return defaultMonth;
    }
    return new Date();
  });

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectingStart, setSelectingStart] = useState<boolean>(true);

  // Safely extract start and end dates with undefined checks
  const startDate: Date | null = selected?.from || null;
  const endDate: Date | null = selected?.to || null;

  const months: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysOfWeek: string[] = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

  const getDaysInMonth = (date: Date | null): (Date | null)[] => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return [];
    }

    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const formatDate = (date: Date | null): string => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return "";
    }

    try {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      console.warn("Error formatting date:", error);
      return "";
    }
  };

  const isDateInRange = (date: Date | null): boolean => {
    if (!startDate || !endDate || !date) return false;

    if (
      !(startDate instanceof Date) ||
      !(endDate instanceof Date) ||
      !(date instanceof Date)
    ) {
      return false;
    }

    if (
      isNaN(startDate.getTime()) ||
      isNaN(endDate.getTime()) ||
      isNaN(date.getTime())
    ) {
      return false;
    }

    return date >= startDate && date <= endDate;
  };

  const isDateSelected = (date: Date | null): boolean => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return false;
    }

    const isStartSelected =
      startDate &&
      startDate instanceof Date &&
      !isNaN(startDate.getTime()) &&
      date.getTime() === startDate.getTime();

    const isEndSelected =
      endDate &&
      endDate instanceof Date &&
      !isNaN(endDate.getTime()) &&
      date.getTime() === endDate.getTime();

    return isStartSelected || isEndSelected || false;
  };

  const handleDateClick = (date: Date | null): void => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return;
    }

    if (selectingStart || !startDate) {
      onSelect?.({ from: date, to: date });
      setSelectingStart(false);
    } else {
      if (
        startDate &&
        startDate instanceof Date &&
        !isNaN(startDate.getTime())
      ) {
        if (date < startDate) {
          onSelect?.({ from: date, to: startDate });
        } else {
          onSelect?.({ from: startDate, to: date });
        }
        setSelectingStart(true);
      }
    }
  };

  const navigateMonth = (direction: number): void => {
    try {
      const newMonth = new Date(currentMonth);
      newMonth.setMonth(currentMonth.getMonth() + direction);

      if (!isNaN(newMonth.getTime())) {
        setCurrentMonth(newMonth);
      }
    } catch (error) {
      console.warn("Error navigating month:", error);
    }
  };

  const clearSelection = (): void => {
    onSelect?.(undefined);
    setSelectingStart(true);
  };

  const applySelection = (): void => {
    setIsOpen(false);
  };

  const days = getDaysInMonth(currentMonth);

  const calculateDaysSelected = (): number => {
    if (
      !startDate ||
      !endDate ||
      !(startDate instanceof Date) ||
      !(endDate instanceof Date) ||
      isNaN(startDate.getTime()) ||
      isNaN(endDate.getTime())
    ) {
      return 0;
    }

    try {
      return (
        Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1
      );
    } catch (error) {
      console.warn("Error calculating days:", error);
      return 0;
    }
  };

  const daysSelected = calculateDaysSelected();

  const formatDisplayText = () => {
    if (startDate && endDate && startDate.getTime() !== endDate.getTime()) {
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    } else if (startDate) {
      return `${formatDate(startDate)} - Select end date`;
    }
    return placeholder;
  };

  return (
    <div className={cn("w-full max-w-md", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !startDate && "text-muted-foreground"
            )}
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            {formatDisplayText()}
            {startDate && (
              <span
                className="ml-auto flex h-4 w-4 items-center justify-center rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  clearSelection();
                }}
              >
                <X className="h-3 w-3" />
              </span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-80 p-0" align="start">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth(-1)}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="text-sm font-medium">
                {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth(1)}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {daysOfWeek.map((day: string) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-muted-foreground py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {days.map((date: Date | null, index: number) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => date && handleDateClick(date)}
                  disabled={!date}
                  className={cn(
                    "h-8 w-8 p-0 font-normal",
                    !date && "invisible",
                    isDateSelected(date) &&
                      "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                    isDateInRange(date) &&
                      !isDateSelected(date) &&
                      "bg-accent text-accent-foreground",
                    "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {date && date.getDate()}
                </Button>
              ))}
            </div>

            {/* Status and Info */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-muted-foreground">
                {selectingStart && !startDate && "Select start date"}
                {!selectingStart &&
                  startDate &&
                  startDate.getTime() === endDate?.getTime() &&
                  "Select end date"}
                {startDate &&
                  endDate &&
                  startDate.getTime() !== endDate.getTime() &&
                  daysSelected > 0 && (
                    <Badge variant="secondary">
                      {daysSelected} day{daysSelected !== 1 ? "s" : ""} selected
                    </Badge>
                  )}
              </div>
              {startDate &&
                endDate &&
                startDate.getTime() !== endDate.getTime() && (
                  <Badge variant="outline" className="text-xs">
                    Ready to apply
                  </Badge>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearSelection}
                className="flex-1"
              >
                Clear
              </Button>
              <Button
                size="sm"
                onClick={applySelection}
                disabled={
                  !startDate ||
                  !endDate ||
                  startDate.getTime() === endDate.getTime()
                }
                className="flex-1"
              >
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export { DateRangePicker };
