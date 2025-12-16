import { useState, useMemo, useEffect } from "react";
import {
  Download,
  Edit2,
  X,
  Save,
  ChevronLeft,
  ChevronRight,
  CalendarCheck,
} from "lucide-react";
import { ScheduleGrid } from "./ScheduleGrid";
import { EmptyState } from "./EmptyState";
import { ShiftLegend } from "./ScheduleControls";
import {
  FilterCombobox,
  SelectedFilter,
} from "./FilterCombobox";
import { MonthYearPicker } from "./MonthYearPicker";
import { ExportPreviewDialog } from "./ExportPreviewDialog";
import {
  generateMockScheduleData,
  hasScheduleForMonth,
  isMonthAllowed,
} from "../utils/scheduleData";
import { getWeekIndexForDate } from "../utils/dateHelpers";
import { useIsMobile } from "./ui/use-mobile";

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
  const isMobile = useIsMobile();

  // We generate data for the ACTUAL current month once on mount.
  // This ensures that even if the user navigates away and back,
  // the current month's data remains consistent (doesn't regenerate random mock data).
  const [staticCurrentMonthData] = useState(() => {
    const today = new Date();
    const currentMonthStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      1,
    );
    return generateMockScheduleData(currentMonthStart);
  });

  // Initialize state based on the selected month
  const [scheduleExists, setScheduleExists] = useState(() =>
    hasScheduleForMonth(selectedMonth),
  );

  // Load data if schedule exists, otherwise empty
  const [scheduleData, setScheduleData] = useState<any[]>([]);

  // Sync state when selectedMonth changes
  useEffect(() => {
    const exists = hasScheduleForMonth(selectedMonth);
    setScheduleExists(exists);
    if (exists) {
      // If the selected month is the same as the current real month,
      // use our static data to ensure consistency.
      const today = new Date();
      const isCurrentMonth =
        selectedMonth.getMonth() === today.getMonth() &&
        selectedMonth.getFullYear() === today.getFullYear();

      if (isCurrentMonth) {
        setScheduleData(staticCurrentMonthData);
      } else {
        setScheduleData(
          generateMockScheduleData(selectedMonth),
        );
      }
    } else {
      setScheduleData([]);
    }
    setIsEditMode(false);
    setCurrentWeekStart(0);
  }, [
    selectedMonth,
    setIsEditMode,
    setCurrentWeekStart,
    staticCurrentMonthData,
  ]);

  const [selectedFilters, setSelectedFilters] = useState<
    SelectedFilter[]
  >([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] =
    useState(false);

  // --- Logic for Dates & Weeks ---
  const weekDates = useMemo(() => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const dates: Date[] = [];
    for (
      let d = new Date(firstDay);
      d <= lastDay;
      d.setDate(d.getDate() + 1)
    ) {
      dates.push(new Date(d));
    }
    return dates;
  }, [selectedMonth]);

  const currentWeekDates = useMemo(() => {
    const startIdx = currentWeekStart * 7;
    const weekSlice = weekDates.slice(startIdx, startIdx + 7);
    const paddedWeek: Date[] = [];
    if (weekSlice.length > 0) {
      const firstDate = weekSlice[0];
      const dayOfWeek = firstDate.getDay();
      const mondayOffset =
        dayOfWeek === 0 ? -6 : -(dayOfWeek - 1);
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

  // Check if current month is allowed
  const currentMonthAllowed = isMonthAllowed(selectedMonth);

  // --- Handlers ---
  const monthYearDisplay = selectedMonth.toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    },
  );

  const handleMonthChange = (newMonth: Date) => {
    if (
      isEditMode &&
      window.confirm(`Save changes to ${monthYearDisplay}?`)
    ) {
      handleSaveChanges();
    }
    setSelectedMonth(newMonth);
  };

  const handleWeekNavigation = (direction: "next" | "prev") => {
    const newWeekStart =
      direction === "next"
        ? currentWeekStart + 1
        : currentWeekStart - 1;
    setCurrentWeekStart(newWeekStart);
  };

  // Requirement: "Today" shortcut button handler
  const handleJumpToToday = () => {
    const today = new Date();
    // Normalize to the first of the month
    const todayMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1,
    );

    // Switch month
    handleMonthChange(todayMonth);

    // Calculate which week contains today
    const currentWeekIndex = getWeekIndexForDate(today);
    setCurrentWeekStart(currentWeekIndex);
  };

  const handleCreateSchedule = () => {
    setIsCreating(true);
    // Simulate API call to create schedule
    setTimeout(() => {
      setScheduleExists(true);
      setScheduleData(generateMockScheduleData(selectedMonth));
      setIsEditMode(true); // Automatically enter edit mode after creation
      setIsCreating(false);
    }, 1000);
  };

  const handleConfirmExport = () => {
    setIsExportDialogOpen(false);
    alert(
      `Downloading PDF schedule for ${monthYearDisplay} (Full Month)...`,
    );
  };

  const handleSaveChanges = () => {
    // Validation: Auto-mark employees as "Absent" if they have no shifts
    const validatedScheduleData = scheduleData.map(
      (employee) => {
        const updatedSchedule = { ...employee.schedule };

        // Check each date in the employee's schedule
        Object.keys(updatedSchedule).forEach((dateKey) => {
          const daySchedule = updatedSchedule[dateKey];

          // If employee is marked as Present but has no shifts, change to Absent
          if (
            daySchedule.attendance === "Present" &&
            (!daySchedule.shifts ||
              daySchedule.shifts.length === 0)
          ) {
            updatedSchedule[dateKey] = {
              attendance: "Absent",
              shifts: [],
            };
          }
        });

        return {
          ...employee,
          schedule: updatedSchedule,
        };
      },
    );

    // Update the schedule data with validated data
    setScheduleData(validatedScheduleData);

    setIsEditMode(false);
    alert("Changes saved successfully!");
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    // Revert to original generated data (simulate fetching saved state)
    // If it's current month, revert to static data to keep consistency
    const today = new Date();
    const isCurrentMonth =
      selectedMonth.getMonth() === today.getMonth() &&
      selectedMonth.getFullYear() === today.getFullYear();

    setScheduleData(
      isCurrentMonth
        ? staticCurrentMonthData
        : generateMockScheduleData(selectedMonth),
    );
  };

  // --- Filters ---
  const filterOptions = useMemo(() => {
    const departments = new Set<string>();
    const designations = new Set<string>();
    const employeeNames: {
      name: string;
      department: string;
      designation: string;
    }[] = [];
    scheduleData.forEach((employee) => {
      departments.add(employee.department);
      designations.add(employee.designation);
      employeeNames.push({
        name: employee.employeeName,
        department: employee.department,
        designation: employee.designation,
      });
    });
    return {
      departments: Array.from(departments).sort(),
      designations: Array.from(designations).sort(),
      employeeNames: employeeNames.sort((a, b) =>
        a.name.localeCompare(b.name),
      ),
    };
  }, [scheduleData]);

  const filteredScheduleData = useMemo(() => {
    if (selectedFilters.length === 0) return scheduleData;
    return scheduleData.filter((employee) => {
      return selectedFilters.some((filter) => {
        if (filter.type === "department")
          return employee.department === filter.value;
        if (filter.type === "designation")
          return employee.designation === filter.value;
        if (filter.type === "name")
          return employee.employeeName === filter.value;
        return false;
      });
    });
  }, [scheduleData, selectedFilters]);

  const weekDisplay =
    currentWeekDates.length > 0
      ? `Week ${currentWeekStart + 1} (${currentWeekDates[0].toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
          },
        )} - ${currentWeekDates[
          currentWeekDates.length - 1
        ].toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })})`
      : "";

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden font-sans">
      {/* 1. Header Section */}
      <div className="bg-[#EA0029] text-white px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between shrink-0 shadow-md z-20 gap-3">
        <h1 className="text-lg sm:text-xl font-semibold tracking-wide flex items-center">
          <span className="truncate">
            Schedule - {monthYearDisplay}
          </span>
          {isEditMode && (
            <span className="ml-2 opacity-80 font-normal text-sm bg-white/20 px-2 py-0.5 rounded">
              Editing
            </span>
          )}
        </h1>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {scheduleExists && !isEditMode && (
            <>
              <button
                onClick={() => setIsEditMode(true)}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-white/10 text-white border border-white/20 rounded hover:bg-white/20 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" /> Edit
              </button>
              <button
                onClick={() => setIsExportDialogOpen(true)}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-white text-[#EA0029] font-medium rounded hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base shadow-sm"
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />{" "}
                <span className="hidden sm:inline">
                  Export PDF
                </span>
                <span className="sm:hidden">PDF</span>
              </button>
            </>
          )}

          {isEditMode && (
            <>
              <button
                onClick={handleCancelEdit}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-black/20 text-white rounded hover:bg-black/30 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" /> Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-white text-[#EA0029] font-bold rounded hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base shadow-sm"
              >
                <Save className="w-4 h-4 sm:w-5 sm:h-5" /> Save
              </button>
            </>
          )}
        </div>
      </div>

      {/* 2. Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 flex flex-col">
        <div className="flex flex-col gap-6">
          {/* Controls Section - Responsive Wrapper */}
          <div className="bg-white border border-gray-200 px-4 py-4 rounded-lg shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
            {/* Date Nav */}
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <div className="flex-1 lg:flex-none">
                <MonthYearPicker
                  selectedMonth={selectedMonth}
                  onChange={handleMonthChange}
                />
              </div>
              <button
                onClick={handleJumpToToday}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors shrink-0"
                title="Jump to current week"
              >
                <CalendarCheck className="w-4 h-4 text-[#EA0029]" />
                <span className="hidden sm:inline">Today</span>
              </button>
            </div>

            {scheduleExists && (
              <>
                <div className="flex-1 w-full lg:w-auto min-w-0">
                  <FilterCombobox
                    departments={filterOptions.departments}
                    designations={filterOptions.designations}
                    staffNames={filterOptions.employeeNames}
                    selectedFilters={selectedFilters}
                    onFilterChange={setSelectedFilters}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between gap-2 lg:ml-auto shrink-0 bg-gray-50 p-1.5 rounded-md border border-gray-200 w-full lg:w-auto">
                  <button
                    onClick={() => handleWeekNavigation("prev")}
                    disabled={!canGoPrevious}
                    className={`p-2 rounded hover:bg-white hover:shadow-sm transition-all ${!canGoPrevious ? "opacity-30 cursor-not-allowed" : "text-gray-600"}`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm sm:text-base font-medium text-gray-700 w-full text-center select-none truncate px-2">
                    {weekDisplay}
                  </span>
                  <button
                    onClick={() => handleWeekNavigation("next")}
                    disabled={!canGoNext}
                    className={`p-2 rounded hover:bg-white hover:shadow-sm transition-all ${!canGoNext ? "opacity-30 cursor-not-allowed" : "text-gray-600"}`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </div>

          {!scheduleExists ? (
            <EmptyState
              month={monthYearDisplay}
              onCreateSchedule={handleCreateSchedule}
              isCreating={isCreating}
              isAllowed={currentMonthAllowed}
            />
          ) : (
            <>
              {/* Main Grid */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex-1 min-h-[400px]">
                <ScheduleGrid
                  weekDates={currentWeekDates}
                  scheduleData={filteredScheduleData}
                  setScheduleData={setScheduleData}
                  isEditMode={isEditMode}
                  hasActiveFilters={selectedFilters.length > 0}
                  selectedMonth={selectedMonth}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* 4. Footer Legend */}
      {scheduleExists && <ShiftLegend />}

      {/* 5. Modals */}
      <ExportPreviewDialog
        open={isExportDialogOpen}
        onOpenChange={setIsExportDialogOpen}
        data={filteredScheduleData}
        weekDates={currentWeekDates}
        month={selectedMonth}
        onConfirm={handleConfirmExport}
      />
    </div>
  );
}