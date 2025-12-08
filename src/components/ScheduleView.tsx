import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Download, Edit2, X, Save } from 'lucide-react';
import { ScheduleGrid } from './ScheduleGrid';
import { EmptyState } from './EmptyState';
import { Legend } from './Legend';
import { ShiftLegend } from './ShiftLegend';
import { MonthYearPicker } from './MonthYearPicker';
import { FilterCombobox, SelectedFilter } from './FilterCombobox';
import { generateMockScheduleData, hasScheduleForMonth } from '../utils/scheduleData';

interface ScheduleViewProps {
  selectedMonth: Date;
  setSelectedMonth: (date: Date) => void;
  currentWeekStart: number;
  setCurrentWeekStart: (week: number) => void;
  isEditMode: boolean;
  setIsEditMode: (mode: boolean) => void;
}

export function ScheduleView({
  selectedMonth,
  setSelectedMonth,
  currentWeekStart,
  setCurrentWeekStart,
  isEditMode,
  setIsEditMode,
}: ScheduleViewProps) {
  const [scheduleExists, setScheduleExists] = useState(() => 
    hasScheduleForMonth(selectedMonth)
  );
  const [scheduleData, setScheduleData] = useState(() =>
    scheduleExists ? generateMockScheduleData(selectedMonth) : []
  );
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilter[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  // Calculate week boundaries
  const weekDates = useMemo(() => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const dates: Date[] = [];
    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    
    return dates;
  }, [selectedMonth]);

  const currentWeekDates = useMemo(() => {
    const startIdx = currentWeekStart * 7;
    const weekSlice = weekDates.slice(startIdx, startIdx + 7);
    
    // Always ensure we have exactly 7 days (Mon-Sun)
    // Pad with dates from previous/next month if needed
    const paddedWeek: Date[] = [];
    
    if (weekSlice.length > 0) {
      const firstDate = weekSlice[0];
      const dayOfWeek = firstDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const mondayOffset = dayOfWeek === 0 ? -6 : -(dayOfWeek - 1); // Calculate days until Monday
      
      // Start from Monday
      for (let i = 0; i < 7; i++) {
        const date = new Date(firstDate);
        date.setDate(firstDate.getDate() + mondayOffset + i);
        paddedWeek.push(date);
      }
    }
    
    return paddedWeek.length > 0 ? paddedWeek : weekSlice;
  }, [weekDates, currentWeekStart]);

  const totalWeeks = Math.ceil(weekDates.length / 7);
  const canGoPrevious = currentWeekStart > 0;
  const canGoNext = currentWeekStart < totalWeeks - 1;

  const handleMonthChange = (newMonth: Date) => {
    // Check if there are unsaved changes in edit mode
    if (isEditMode) {
      const confirmSwitch = window.confirm(
        `You have unsaved changes. Do you want to save changes to ${monthYearDisplay} before switching months?`
      );
      
      if (confirmSwitch) {
        // Save changes before switching
        handleSaveChanges();
      }
    }
    
    setSelectedMonth(newMonth);
    setCurrentWeekStart(0);
    const exists = hasScheduleForMonth(newMonth);
    setScheduleExists(exists);
    if (exists) {
      setScheduleData(generateMockScheduleData(newMonth));
    }
    setIsEditMode(false);
  };
  
  const handleWeekNavigation = (direction: 'next' | 'prev') => {
    const newWeekStart = direction === 'next' ? currentWeekStart + 1 : currentWeekStart - 1;
    const newWeekDates = weekDates.slice(newWeekStart * 7, (newWeekStart * 7) + 7);
    
    // Check if the new week contains dates from a different month
    const hasOutOfMonthDates = newWeekDates.some(
      date => date.getMonth() !== selectedMonth.getMonth() || 
              date.getFullYear() !== selectedMonth.getFullYear()
    );
    
    // If navigating to a week that's mostly in another month, switch months
    if (hasOutOfMonthDates && newWeekDates.length > 0) {
      const targetDate = newWeekDates[direction === 'next' ? newWeekDates.length - 1 : 0];
      const targetMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
      
      if (isEditMode) {
        const confirmSwitch = window.confirm(
          `Save changes to ${monthYearDisplay} before moving to ${targetMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}?`
        );
        
        if (confirmSwitch) {
          handleSaveChanges();
        }
      }
      
      handleMonthChange(targetMonth);
    } else {
      setCurrentWeekStart(newWeekStart);
    }
  };

  const handleCreateSchedule = () => {
    setScheduleExists(true);
    setScheduleData(generateMockScheduleData(selectedMonth));
    setIsEditMode(true);
    setIsCreating(true);
  };

  const handleExport = () => {
    const monthName = selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    alert(`Exporting full schedule for ${monthName}`);
  };

  const handleSaveChanges = () => {
    setIsEditMode(false);
    alert('Changes saved successfully!');
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    // Reset data if needed
    setScheduleData(generateMockScheduleData(selectedMonth));
  };

  // Extract unique departments, designations, and staff names from schedule data
  const filterOptions = useMemo(() => {
    const departments = new Set<string>();
    const designations = new Set<string>();
    const staffNames: { name: string; department: string; designation: string }[] = [];

    scheduleData.forEach((staff) => {
      departments.add(staff.department);
      designations.add(staff.designation);
      staffNames.push({
        name: staff.staffName,
        department: staff.department,
        designation: staff.designation,
      });
    });

    return {
      departments: Array.from(departments).sort(),
      designations: Array.from(designations).sort(),
      staffNames: staffNames.sort((a, b) => a.name.localeCompare(b.name)),
    };
  }, [scheduleData]);

  // Filter schedule data based on selected filters
  const filteredScheduleData = useMemo(() => {
    if (selectedFilters.length === 0) {
      return scheduleData;
    }

    return scheduleData.filter((staff) => {
      // Check if staff matches any selected filter
      return selectedFilters.some((filter) => {
        if (filter.type === 'department') {
          return staff.department === filter.value;
        }
        if (filter.type === 'designation') {
          return staff.designation === filter.value;
        }
        if (filter.type === 'name') {
          return staff.staffName === filter.value;
        }
        return false;
      });
    });
  }, [scheduleData, selectedFilters]);

  const monthYearDisplay = selectedMonth.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  const weekDisplay = currentWeekDates.length > 0
    ? `Week ${currentWeekStart + 1} (${currentWeekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${currentWeekDates[currentWeekDates.length - 1].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`
    : '';

  return (
    <div className="flex flex-col h-full">
      {/* Header Section - Fixed */}
      <div className="bg-[#EA0029] text-white px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        <h1 className="text-lg">
          Staff Schedule - {monthYearDisplay}
          {isEditMode && ' - Edit Mode'}
        </h1>
        
        <div className="flex items-center gap-3">
          {scheduleExists && !isEditMode && (
            <>
              <button
                onClick={() => setIsEditMode(true)}
                className="px-4 py-2 bg-white text-[#EA0029] rounded hover:bg-gray-100 flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-white text-[#EA0029] rounded hover:bg-gray-100 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </>
          )}
          
          {isEditMode && (
            <>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 bg-white text-[#EA0029] rounded hover:bg-gray-100 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>

      {/* Controls Section - Sticky */}
      {scheduleExists && (
        <div className="bg-white border-x border-b border-gray-200 px-6 py-4 sticky top-[52px] z-30 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            {/* Week Navigation */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleWeekNavigation('prev')}
                  disabled={!canGoPrevious}
                  className={`p-2 rounded ${
                    canGoPrevious
                      ? 'hover:bg-gray-100 text-gray-700'
                      : 'text-gray-300 cursor-not-allowed'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <span className="text-sm min-w-[200px] text-center">
                  {weekDisplay}
                </span>
                
                <button
                  onClick={() => handleWeekNavigation('next')}
                  disabled={!canGoNext}
                  className={`p-2 rounded ${
                    canGoNext
                      ? 'hover:bg-gray-100 text-gray-700'
                      : 'text-gray-300 cursor-not-allowed'
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Legend - Fixed Position */}
            <ShiftLegend />
          </div>
          
          <div className="flex items-center justify-between">
            {/* Filter & Actions */}
            <div className="flex items-center gap-4 flex-1">
              {/* Advanced Filter Combobox */}
              <FilterCombobox
                departments={filterOptions.departments}
                designations={filterOptions.designations}
                staffNames={filterOptions.staffNames}
                selectedFilters={selectedFilters}
                onFilterChange={setSelectedFilters}
              />
            </div>
            
            <div className="h-6 w-px bg-gray-300" />
            
            <MonthYearPicker
              selectedMonth={selectedMonth}
              onChange={handleMonthChange}
            />
          </div>

          {isEditMode && <Legend />}
        </div>
      )}

      {/* Content */}
      <div className="bg-white border border-gray-200 border-t-0 rounded-b">
        {!scheduleExists ? (
          <EmptyState
            month={monthYearDisplay}
            onCreateSchedule={handleCreateSchedule}
            isCreating={isCreating}
          />
        ) : (
          <ScheduleGrid
            weekDates={currentWeekDates}
            scheduleData={filteredScheduleData}
            setScheduleData={setScheduleData}
            isEditMode={isEditMode}
            hasActiveFilters={selectedFilters.length > 0}
            selectedMonth={selectedMonth}
          />
        )}
      </div>

      {/* Bottom Legend (when not in edit mode) */}
      {scheduleExists && !isEditMode && (
        <div className="mt-4">
          <Legend />
        </div>
      )}
    </div>
  );
}