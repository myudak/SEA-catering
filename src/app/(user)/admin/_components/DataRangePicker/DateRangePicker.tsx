import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

import { type DateRange } from "react-day-picker";

interface DateRangePickerProps {
  defaultMonth?: Date | null;
  selected?: DateRange | undefined;
  onSelect?: (dateRange: DateRange | undefined) => void;
  className?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  defaultMonth = null,
  selected = undefined,
  onSelect = () => {},
  className = "",
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
  const containerRef = useRef<HTMLDivElement>(null);

  // Safely extract start and end dates with undefined checks
  const startDate: Date | null = selected?.from || null;
  const endDate: Date | null = selected?.to || null;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        event.target &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

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
    // Handle null date input
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

    // Additional validation for valid Date objects
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
    // Validate input date
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return;
    }

    if (selectingStart || !startDate) {
      // Set start date - create temporary range with same date for both from/to
      onSelect?.({ from: date, to: date });
      setSelectingStart(false);
    } else {
      // Set end date - create proper range
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

      // Validate the new date
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

  // Calculate days with null safety
  const days = getDaysInMonth(currentMonth);

  // Calculate days selected with null safety
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

  return (
    <div
      className={`relative w-full max-w-md mx-auto ${className}`}
      ref={containerRef}
    >
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors cursor-pointer"
      >
        <div className="flex items-center space-x-2">
          <CalendarDays className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <span className="text-gray-700 dark:text-gray-200">
            {startDate && endDate && startDate.getTime() !== endDate.getTime()
              ? `${formatDate(startDate)} - ${formatDate(endDate)}`
              : startDate
              ? `${formatDate(startDate)} - Select end date`
              : "Select date range"}
          </span>
        </div>
        <ChevronRight
          className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${
            isOpen ? "rotate-90" : ""
          }`}
        />
      </button>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <button
              onClick={() => navigateMonth(1)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map((day: string) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {days.map((date: Date | null, index: number) => (
              <button
                key={index}
                onClick={() => date && handleDateClick(date)}
                disabled={!date}
                className={`
                  h-10 w-10 rounded-lg text-sm font-medium transition-all duration-200
                  ${
                    !date
                      ? "invisible"
                      : isDateSelected(date)
                      ? "bg-blue-600 dark:bg-blue-500 text-white shadow-md"
                      : isDateInRange(date)
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105"
                  }
                `}
              >
                {date && date.getDate()}
              </button>
            ))}
          </div>

          {/* Status */}
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
            {selectingStart && !startDate && "Select start date"}
            {!selectingStart &&
              startDate &&
              startDate.getTime() === endDate?.getTime() &&
              "Select end date"}
            {startDate &&
              endDate &&
              startDate.getTime() !== endDate.getTime() &&
              daysSelected > 0 &&
              `${daysSelected} days selected`}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={clearSelection}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Clear
            </button>
            <Button
              onClick={applySelection}
              disabled={
                !startDate ||
                !endDate ||
                startDate.getTime() === endDate.getTime()
              }
              className="flex-1 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export { DateRangePicker };
