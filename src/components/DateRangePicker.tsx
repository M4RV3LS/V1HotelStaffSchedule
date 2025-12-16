import { useState, useRef, useEffect } from "react";
import { Calendar, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "./ui/utils";
import { hasScheduleForMonth } from "../utils/scheduleData";

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onDateChange: (startDate: Date, endDate: Date) => void;
  className?: string;
}

export function DateRangePicker({
  startDate,
  endDate,
  onDateChange,
  className,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);
  const [selectingStart, setSelectingStart] = useState(true);
  const [viewingMonth, setViewingMonth] = useState(new Date(startDate.getFullYear(), startDate.getMonth(), 1));
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        // Reset to current values if closed without applying
        setTempStartDate(startDate);
        setTempEndDate(endDate);
        setSelectingStart(true);
        setViewingMonth(new Date(startDate.getFullYear(), startDate.getMonth(), 1));
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, startDate, endDate]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleApply = () => {
    onDateChange(tempStartDate, tempEndDate);
    setIsOpen(false);
    setSelectingStart(true);
  };

  const handleReset = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = today; // Default to today
    setTempStartDate(firstDay);
    setTempEndDate(lastDay);
    setViewingMonth(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  const handlePreviousMonth = () => {
    setViewingMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewingMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const isDateDisabled = (date: Date): boolean => {
    const month = new Date(date.getFullYear(), date.getMonth(), 1);
    return !hasScheduleForMonth(month);
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;

    if (selectingStart) {
      setTempStartDate(date);
      // If start date is after end date, reset end date
      if (date > tempEndDate) {
        setTempEndDate(date);
      }
      setSelectingStart(false);
    } else {
      // Selecting end date
      if (date < tempStartDate) {
        // If end date is before start, swap them
        setTempEndDate(tempStartDate);
        setTempStartDate(date);
      } else {
        setTempEndDate(date);
      }
      setSelectingStart(true);
    }
  };

  // Generate calendar months to show (show 2 months)
  const renderCalendar = () => {
    const currentMonth = viewingMonth;
    const nextMonth = new Date(viewingMonth.getFullYear(), viewingMonth.getMonth() + 1, 1);

    return (
      <>
        {/* Month Navigation */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50">
          <button
            onClick={handlePreviousMonth}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            title="Previous month"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex gap-8">
            <span className="text-sm font-medium text-gray-700">
              {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {nextMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
          </div>
          <button
            onClick={handleNextMonth}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            title="Next month"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 p-2">
          {[currentMonth, nextMonth].map((monthStart, monthIdx) => {
            const year = monthStart.getFullYear();
            const month = monthStart.getMonth();
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const daysInMonth = lastDay.getDate();
            const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday

            const days = [];
            // Add empty cells for days before the 1st
            for (let i = 0; i < startingDayOfWeek; i++) {
              days.push(<div key={`empty-${i}`} className="h-8" />);
            }

            // Add days of the month
            for (let day = 1; day <= daysInMonth; day++) {
              const date = new Date(year, month, day);
              const disabled = isDateDisabled(date);
              const isStart = tempStartDate.toDateString() === date.toDateString();
              const isEnd = tempEndDate.toDateString() === date.toDateString();
              const isInRange = date >= tempStartDate && date <= tempEndDate;
              const isToday = date.toDateString() === new Date().toDateString();

              days.push(
                <button
                  key={day}
                  onClick={() => handleDateClick(date)}
                  disabled={disabled}
                  className={cn(
                    "h-8 w-8 rounded text-sm transition-all",
                    disabled && "text-gray-300 cursor-not-allowed",
                    !disabled && "hover:bg-gray-100 cursor-pointer",
                    isInRange && !disabled && "bg-red-50",
                    (isStart || isEnd) && !disabled && "bg-[#EA0029] text-white hover:bg-[#EA0029]/90",
                    isToday && !isStart && !isEnd && "border border-[#EA0029]",
                  )}
                >
                  {day}
                </button>
              );
            }

            return (
              <div key={monthIdx} className="p-2">
                <div className="grid grid-cols-7 gap-1 text-center">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <div key={day} className="text-xs text-gray-500 font-medium h-6 flex items-center justify-center">
                      {day}
                    </div>
                  ))}
                  {days}
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 border rounded cursor-pointer transition-colors min-w-[280px]",
          isOpen
            ? "border-[#EA0029] bg-white ring-1 ring-[#EA0029]/20"
            : "border-gray-300 bg-white hover:border-gray-400"
        )}
      >
        <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
        <span className="text-sm text-gray-700">
          {formatDate(startDate)} - {formatDate(endDate)}
        </span>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-700">
              Select Date Range
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {selectingStart ? "Click to select start date" : "Click to select end date"}
            </p>
          </div>

          <div className="p-2">
            <div className="flex items-center gap-2 mb-2 text-xs">
              <div className="flex items-center gap-1">
                <div className={cn(
                  "w-3 h-3 rounded border-2",
                  selectingStart ? "border-[#EA0029] bg-[#EA0029]" : "border-gray-300"
                )} />
                <span className="text-gray-600">Start: {formatDate(tempStartDate)}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className={cn(
                  "w-3 h-3 rounded border-2",
                  !selectingStart ? "border-[#EA0029] bg-[#EA0029]" : "border-gray-300"
                )} />
                <span className="text-gray-600">End: {formatDate(tempEndDate)}</span>
              </div>
            </div>
          </div>

          {renderCalendar()}

          <div className="p-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between gap-2">
            <button
              onClick={handleReset}
              className="text-xs font-medium text-gray-600 hover:text-gray-800"
            >
              Reset to Current Month
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setTempStartDate(startDate);
                  setTempEndDate(endDate);
                  setSelectingStart(true);
                }}
                className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="px-3 py-1.5 text-xs font-medium text-white bg-[#EA0029] hover:bg-[#EA0029]/90 rounded transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}