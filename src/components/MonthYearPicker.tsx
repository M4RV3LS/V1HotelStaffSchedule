import { ChevronDown, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { hasScheduleForMonth, isMonthAllowed } from '../utils/scheduleData';

interface MonthYearPickerProps {
  selectedMonth: Date;
  value?: Date;
  onChange: (date: Date) => void;
}

export function MonthYearPicker({ selectedMonth, value, onChange }: MonthYearPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Support both selectedMonth and value props
  const currentDate = value || selectedMonth;
  
  // Temporary selection state (Requirement 2)
  const [tempYear, setTempYear] = useState(currentDate.getFullYear());
  const [tempMonth, setTempMonth] = useState(currentDate.getMonth());
  
  // Reset temp selection when picker opens or currentDate changes
  useEffect(() => {
    setTempYear(currentDate.getFullYear());
    setTempMonth(currentDate.getMonth());
  }, [currentDate, isOpen]);
  
  if (!currentDate) {
    return null;
  }

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 1 + i);

  const handleTempMonthChange = (monthIndex: number) => {
    setTempMonth(monthIndex);
  };

  const handleTempYearChange = (year: number) => {
    setTempYear(year);
  };

  // Requirement 2: Confirm selection before applying
  const handleConfirmSelection = () => {
    const newDate = new Date(tempYear, tempMonth, 1);
    onChange(newDate);
    setIsOpen(false);
  };

  const handleCancel = () => {
    // Reset to current selection
    setTempYear(currentDate.getFullYear());
    setTempMonth(currentDate.getMonth());
    setIsOpen(false);
  };

  const displayText = currentDate.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  // Check if the temp selection has changed
  const hasChanges = tempYear !== currentDate.getFullYear() || tempMonth !== currentDate.getMonth();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm"
      >
        {displayText}
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={handleCancel}
          />
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg p-4 z-20 min-w-[280px]">
            <div className="mb-3">
              <label className="text-xs text-gray-600 mb-1 block">Year</label>
              <select
                value={tempYear}
                onChange={(e) => handleTempYearChange(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="text-xs text-gray-600 mb-1 block">Month</label>
              <div className="grid grid-cols-3 gap-2">
                {months.map((month, index) => {
                  const testDate = new Date(tempYear, index, 1);
                  const allowed = isMonthAllowed(testDate);
                  const isSelected = tempMonth === index;
                  
                  return (
                    <button
                      key={month}
                      onClick={() => allowed ? handleTempMonthChange(index) : null}
                      disabled={!allowed}
                      className={`px-3 py-2 text-xs rounded transition-colors relative ${
                        isSelected
                          ? 'bg-[#EA0029] text-white font-bold'
                          : allowed
                            ? 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                      }`}
                      title={!allowed ? 'Not available - Schedules auto-generate monthly' : ''}
                    >
                      {month.substring(0, 3)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSelection}
                disabled={!hasChanges}
                className={`flex-1 px-3 py-2 text-sm rounded transition-colors flex items-center justify-center gap-1 ${
                  hasChanges
                    ? 'bg-[#EA0029] text-white hover:bg-[#C50024]'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Check className="w-4 h-4" />
                Confirm
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}