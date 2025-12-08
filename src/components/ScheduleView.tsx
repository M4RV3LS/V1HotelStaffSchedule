import { useState, useMemo } from "react";
import { Download, Edit2, X, Save, ChevronLeft, ChevronRight } from "lucide-react";
import { ScheduleGrid } from "./ScheduleGrid";
import { EmptyState } from "./EmptyState";
import { ShiftLegend } from "./ScheduleControls";
import { FilterCombobox, SelectedFilter } from "./FilterCombobox";
import { MonthYearPicker } from "./MonthYearPicker";
import { ExportPreviewDialog } from "./ExportPreviewDialog";
import {
  generateMockScheduleData,
  hasScheduleForMonth,
} from "../utils/scheduleData";

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
    hasScheduleForMonth(selectedMonth),
  );
  const [scheduleData, setScheduleData] = useState(() =>
    scheduleExists
      ? generateMockScheduleData(selectedMonth)
      : [],
  );
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

  // --- Handlers ---
  const monthYearDisplay = selectedMonth.toLocaleDateString(
    "en-US",
    { month: "long", year: "numeric" },
  );

  const handleMonthChange = (newMonth: Date) => {
    if (
      isEditMode &&
      window.confirm(`Save changes to ${monthYearDisplay}?`)
    ) {
      handleSaveChanges();
    }
    setSelectedMonth(newMonth);
    setCurrentWeekStart(0);
    const exists = hasScheduleForMonth(newMonth);
    setScheduleExists(exists);
    if (exists)
      setScheduleData(generateMockScheduleData(newMonth));
    setIsEditMode(false);
  };

  const handleWeekNavigation = (direction: "next" | "prev") => {
    const newWeekStart =
      direction === "next"
        ? currentWeekStart + 1
        : currentWeekStart - 1;
    const newWeekDates = weekDates.slice(
      newWeekStart * 7,
      newWeekStart * 7 + 7,
    );
    const hasOutOfMonthDates = newWeekDates.some(
      (date) => date.getMonth() !== selectedMonth.getMonth(),
    );

    if (hasOutOfMonthDates && newWeekDates.length > 0) {
      const targetDate =
        newWeekDates[
          direction === "next" ? newWeekDates.length - 1 : 0
        ];
      const targetMonth = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        1,
      );
      handleMonthChange(targetMonth);
    } else {
      setCurrentWeekStart(newWeekStart);
    }
  };

  const handleCreateSchedule = () => {
    setIsCreating(true);
    setTimeout(() => {
      setScheduleExists(true);
      setScheduleData(generateMockScheduleData(selectedMonth));
      setIsEditMode(true);
      setIsCreating(false);
    }, 1000);
  };

  const handleExportClick = () => {
    setIsExportDialogOpen(true);
  };

  const handleConfirmExport = () => {
    setIsExportDialogOpen(false);
    alert(
      `Downloading PDF schedule for ${monthYearDisplay}...`,
    );
  };

  const handleSaveChanges = () => {
    setIsEditMode(false);
    alert("Changes saved successfully!");
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setScheduleData(generateMockScheduleData(selectedMonth));
  };

  // --- Filters ---
  const filterOptions = useMemo(() => {
    const departments = new Set<string>();
    const designations = new Set<string>();
    const staffNames: {
      name: string;
      department: string;
      designation: string;
    }[] = [];
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
      staffNames: staffNames.sort((a, b) =>
        a.name.localeCompare(b.name),
      ),
    };
  }, [scheduleData]);

  const filteredScheduleData = useMemo(() => {
    if (selectedFilters.length === 0) return scheduleData;
    return scheduleData.filter((staff) => {
      return selectedFilters.some((filter) => {
        if (filter.type === "department")
          return staff.department === filter.value;
        if (filter.type === "designation")
          return staff.designation === filter.value;
        if (filter.type === "name")
          return staff.staffName === filter.value;
        return false;
      });
    });
  }, [scheduleData, selectedFilters]);

  const weekDisplay =
    currentWeekDates.length > 0
      ? `Week ${currentWeekStart + 1} (${currentWeekDates[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${currentWeekDates[currentWeekDates.length - 1].toLocaleDateString("en-US", { month: "short", day: "numeric" })})`
      : "";

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden">
      {/* 1. Header Section */}
      <div className="bg-[#EA0029] text-white px-6 py-3 flex items-center justify-between shrink-0 shadow-md z-40">
        <h1 className="text-lg font-medium tracking-wide">
          Staff Schedule - {monthYearDisplay}
          {isEditMode && (
            <span className="opacity-80 font-normal">
              {" "}
              (Editing)
            </span>
          )}
        </h1>

        <div className="flex items-center gap-3">
          {scheduleExists && !isEditMode && (
            <>
              <button
                onClick={() => setIsEditMode(true)}
                className="px-3 py-1.5 bg-white/10 text-white border border-white/20 rounded hover:bg-white/20 transition-colors flex items-center gap-2 text-sm"
              >
                <Edit2 className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={handleExportClick}
                className="px-3 py-1.5 bg-white text-[#EA0029] font-medium rounded hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm shadow-sm"
              >
                <Download className="w-4 h-4" /> Export PDF
              </button>
            </>
          )}

          {isEditMode && (
            <>
              <button
                onClick={handleCancelEdit}
                className="px-3 py-1.5 bg-black/20 text-white rounded hover:bg-black/30 transition-colors flex items-center gap-2 text-sm"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-3 py-1.5 bg-white text-[#EA0029] font-bold rounded hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm shadow-sm"
              >
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </>
          )}
        </div>
      </div>

      {/* 2. Controls Section */}
      {scheduleExists && (
        <div className="bg-white border-b border-gray-200 px-6 py-4 shrink-0 shadow-sm z-30">
          <div className="flex items-center justify-between gap-4 mb-3">
            {/* Week Navigation */}
            <div className="flex items-center gap-3">
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
              
              <span className="text-sm min-w-[280px] text-center font-medium">
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

              {/* Month Selector */}
              <MonthYearPicker
                selectedMonth={selectedMonth}
                onChange={handleMonthChange}
              />
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-4">
            <FilterCombobox
              departments={filterOptions.departments}
              designations={filterOptions.designations}
              staffNames={filterOptions.staffNames}
              selectedFilters={selectedFilters}
              onFilterChange={setSelectedFilters}
            />
          </div>
        </div>
      )}

      {/* 3. Content */}
      <div className="flex-1 overflow-hidden relative flex flex-col">
        {!scheduleExists ? (
          <div className="h-full overflow-auto">
            <EmptyState
              month={monthYearDisplay}
              onCreateSchedule={handleCreateSchedule}
              isCreating={isCreating}
            />
          </div>
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

      {/* 4. Footer Legend */}
      {scheduleExists && <ShiftLegend />}

      {/* 5. Modals */}
      <ExportPreviewDialog
        open={isExportDialogOpen}
        onOpenChange={setIsExportDialogOpen}
        data={filteredScheduleData}
        month={selectedMonth}
        onConfirm={handleConfirmExport}
      />
    </div>
  );
}
