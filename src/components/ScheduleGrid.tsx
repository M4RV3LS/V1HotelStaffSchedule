import { Fragment } from "react";
import { isSameDay } from "../utils/dateHelpers";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { X, Plus } from "lucide-react";
import { cn } from "./ui/utils";

interface ScheduleEntry {
  id: string;
  department: string;
  designation: string;
  staffName: string;
  schedule: {
    [date: string]: {
      attendance: "Present" | "Absent";
      shifts: string[];
    };
  };
}

interface ScheduleGridProps {
  weekDates: Date[];
  scheduleData: ScheduleEntry[];
  setScheduleData: (data: ScheduleEntry[]) => void;
  isEditMode: boolean;
  hasActiveFilters: boolean;
  selectedMonth: Date;
}

const getShiftStyle = (shift: string) => {
  switch (shift) {
    case "Morning":
      return {
        bg: "bg-yellow-50",
        text: "text-yellow-700",
        border: "border-yellow-200",
      };
    case "Middle":
      return {
        bg: "bg-teal-50",
        text: "text-teal-700",
        border: "border-teal-200",
      };
    case "Afternoon":
      return {
        bg: "bg-orange-50",
        text: "text-orange-700",
        border: "border-orange-200",
      };
    case "Night":
      return {
        bg: "bg-indigo-50",
        text: "text-indigo-700",
        border: "border-indigo-200",
      };
    case "All Day":
      return {
        bg: "bg-slate-100",
        text: "text-slate-700",
        border: "border-slate-200",
      };
    default:
      return {
        bg: "bg-gray-50",
        text: "text-gray-600",
        border: "border-gray-200",
      };
  }
};

/**
 * Renders the content of a schedule cell.
 * Requirement 1: Vertical alignment (flex-col) and consistent height (h-6 per shift).
 */
function CellContent({
  attendance,
  shifts,
  isEditMode,
}: {
  attendance: string;
  shifts: string[];
  isEditMode: boolean;
}) {
  const isAbsent = attendance === "Absent";

  if (isAbsent) {
    return (
      <div
        className={cn(
          "flex items-center justify-center w-full h-full min-h-[60px] rounded-sm transition-all",
          "bg-red-50/50 border border-red-100 text-red-400 text-xs font-medium",
          isEditMode &&
            "cursor-pointer hover:ring-2 hover:ring-[#EA0029] hover:z-10",
        )}
      >
        OFF
      </div>
    );
  }

  // Present with Shifts
  return (
    <div
      className={cn(
        "w-full h-full min-h-[60px] p-1 flex flex-col gap-1 transition-all relative",
        isEditMode &&
          "cursor-pointer hover:ring-2 hover:ring-[#EA0029] hover:z-10 rounded bg-white shadow-sm",
      )}
    >
      {shifts.map((shift, idx) => {
        const style = getShiftStyle(shift);
        return (
          <div
            key={idx}
            className={cn(
              "w-full h-6 flex items-center justify-center rounded-[3px] text-[11px] font-medium border truncate px-1",
              style.bg,
              style.text,
              style.border,
            )}
            title={shift}
          >
            {shift}
          </div>
        );
      })}
    </div>
  );
}

export function ScheduleGrid({
  weekDates,
  scheduleData,
  setScheduleData,
  isEditMode,
  hasActiveFilters,
  selectedMonth,
}: ScheduleGridProps) {
  const today = new Date();

  const isDateInMonth = (date: Date) => {
    return (
      date.getMonth() === selectedMonth.getMonth() &&
      date.getFullYear() === selectedMonth.getFullYear()
    );
  };

  // --- Handlers ---
  const updateAttendance = (
    staffId: string,
    dateKey: string,
    val: string,
  ) => {
    setScheduleData(
      scheduleData.map((staff) =>
        staff.id === staffId
          ? {
              ...staff,
              schedule: {
                ...staff.schedule,
                [dateKey]: {
                  ...staff.schedule[dateKey],
                  attendance: val as any,
                },
              },
            }
          : staff,
      ),
    );
  };

  const updateShift = (
    staffId: string,
    dateKey: string,
    index: number,
    val: string,
  ) => {
    setScheduleData(
      scheduleData.map((staff) => {
        if (staff.id !== staffId) return staff;
        const currentShifts = [
          ...staff.schedule[dateKey].shifts,
        ];
        currentShifts[index] = val;
        return {
          ...staff,
          schedule: {
            ...staff.schedule,
            [dateKey]: {
              ...staff.schedule[dateKey],
              shifts: currentShifts,
            },
          },
        };
      }),
    );
  };

  const addShift = (staffId: string, dateKey: string) => {
    setScheduleData(
      scheduleData.map((staff) => {
        if (staff.id !== staffId) return staff;
        const currentShifts = [
          ...staff.schedule[dateKey].shifts,
        ];
        currentShifts.push("Morning");
        return {
          ...staff,
          schedule: {
            ...staff.schedule,
            [dateKey]: {
              ...staff.schedule[dateKey],
              shifts: currentShifts,
            },
          },
        };
      }),
    );
  };

  const removeShift = (
    staffId: string,
    dateKey: string,
    index: number,
  ) => {
    setScheduleData(
      scheduleData.map((staff) => {
        if (staff.id !== staffId) return staff;
        const currentShifts = staff.schedule[
          dateKey
        ].shifts.filter((_, i) => i !== index);
        return {
          ...staff,
          schedule: {
            ...staff.schedule,
            [dateKey]: {
              ...staff.schedule[dateKey],
              shifts: currentShifts,
            },
          },
        };
      }),
    );
  };

  const groupedStaff = scheduleData.reduce(
    (acc, staff) => {
      if (!acc[staff.department]) acc[staff.department] = [];
      acc[staff.department].push(staff);
      return acc;
    },
    {} as { [key: string]: ScheduleEntry[] },
  );

  const departments = Object.keys(groupedStaff).sort();

  return (
    <div className="w-full h-full overflow-auto bg-white">
      {scheduleData.length === 0 && hasActiveFilters ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 py-12">
          <p className="text-xl font-medium">
            No staff found matching filters
          </p>
        </div>
      ) : (
        <table
          className="w-full border-collapse"
          style={{ tableLayout: "fixed" }}
        >
          <thead className="sticky top-0 z-20 bg-white shadow-sm ring-1 ring-gray-100">
            <tr className="bg-white border-b border-gray-200 h-16">
              <th className="sticky left-0 z-30 top-0 bg-gray-50/80 backdrop-blur px-6 py-4 text-left w-72 border-r border-gray-200 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.05)]">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Staff Details
                </div>
              </th>
              {weekDates.map((date) => {
                const isToday = isSameDay(date, today);
                const isInMonth = isDateInMonth(date);

                return (
                  <th
                    key={date.toISOString()}
                    // Requirement 2: Subtle Highlight (No heavy background/borders)
                    className={cn(
                      "px-2 py-3 text-center border-b border-r border-gray-100 min-w-[110px]",
                      !isInMonth && "bg-gray-50/50",
                    )}
                  >
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <div
                        className={cn(
                          "w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold transition-colors",
                          isToday
                            ? "bg-[#EA0029] text-white shadow-sm" // Requirement 2: Clean Circle Highlight
                            : isInMonth
                              ? "text-gray-900"
                              : "text-gray-400",
                        )}
                      >
                        {date.getDate()}
                      </div>
                      <div
                        className={cn(
                          "text-[10px] uppercase font-semibold tracking-wider",
                          isToday
                            ? "text-[#EA0029]"
                            : isInMonth
                              ? "text-gray-500"
                              : "text-gray-300",
                        )}
                      >
                        {date.toLocaleDateString("en-US", {
                          weekday: "short",
                        })}
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="bg-white">
            {departments.map((department) => (
              <Fragment key={department}>
                {groupedStaff[department].map((staff, idx) => {
                  const isFirstInGroup = idx === 0;
                  return (
                    <tr
                      key={staff.id}
                      className={cn(
                        "group hover:bg-gray-50/80 transition-colors",
                        isFirstInGroup
                          ? "border-t border-gray-200"
                          : "border-t border-gray-100",
                      )}
                    >
                      {/* Name Column - Sticky */}
                      <td className="sticky left-0 z-10 bg-white group-hover:bg-gray-50/80 px-6 py-4 border-r border-gray-200 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.05)] align-top">
                        {isFirstInGroup && (
                          <div className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2.5">
                            {department}
                          </div>
                        )}
                        <div className="font-semibold text-sm text-gray-900 leading-tight">
                          {staff.staffName}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 font-medium">
                          {staff.designation}
                        </div>
                      </td>

                      {/* Schedule Cells */}
                      {weekDates.map((date) => {
                        const dateKey = date
                          .toISOString()
                          .split("T")[0];
                        const entry = staff.schedule[dateKey];
                        const isToday = isSameDay(date, today);
                        const isInMonth = isDateInMonth(date);

                        // Ghost cell
                        if (!isInMonth) {
                          return (
                            <td
                              key={dateKey}
                              className="bg-gray-50/30 border-r border-gray-100"
                            >
                              <div className="w-full h-full min-h-[80px]" />
                            </td>
                          );
                        }

                        if (!entry)
                          return (
                            <td
                              key={dateKey}
                              className="border-r border-gray-100"
                            />
                          );

                        return (
                          <td
                            key={dateKey}
                            // Requirement 2: Subtle Body Highlight (Just border, no bg)
                            className={cn(
                              "p-1 align-top border-r border-gray-100",
                              isToday
                                ? "border-l border-l-red-100 border-r-red-100"
                                : "",
                            )}
                          >
                            {isEditMode ? (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <div
                                    role="button"
                                    tabIndex={0}
                                    className="w-full h-full min-h-[80px] rounded hover:ring-1 hover:ring-gray-200"
                                  >
                                    <CellContent
                                      attendance={
                                        entry.attendance
                                      }
                                      shifts={entry.shifts}
                                      isEditMode={true}
                                    />
                                  </div>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 p-5 z-50 shadow-xl border-gray-200">
                                  <div className="space-y-4">
                                    <div className="font-bold text-base text-gray-900 pb-2 border-b flex justify-between items-center">
                                      <span>Edit Schedule</span>
                                      <span className="text-sm font-normal text-gray-500">
                                        {date.toLocaleDateString()}
                                      </span>
                                    </div>

                                    {/* Availability */}
                                    <div className="space-y-2">
                                      <Label className="text-xs font-bold text-gray-600 uppercase">
                                        Status
                                      </Label>
                                      <Select
                                        defaultValue={
                                          entry.attendance
                                        }
                                        onValueChange={(val) =>
                                          updateAttendance(
                                            staff.id,
                                            dateKey,
                                            val,
                                          )
                                        }
                                      >
                                        <SelectTrigger className="h-9 text-sm">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Present">
                                            On Duty (Present)
                                          </SelectItem>
                                          <SelectItem value="Absent">
                                            Off Duty (Absent)
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    {/* Shift Configuration */}
                                    {entry.attendance ===
                                      "Present" && (
                                      <div className="space-y-3 pt-2">
                                        <div className="flex items-center justify-between">
                                          <Label className="text-xs font-bold text-gray-600 uppercase">
                                            Shifts
                                          </Label>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 text-xs text-[#EA0029] hover:text-[#c40023] hover:bg-red-50 px-2 font-medium"
                                            onClick={() =>
                                              addShift(
                                                staff.id,
                                                dateKey,
                                              )
                                            }
                                          >
                                            <Plus className="w-3 h-3 mr-1" />{" "}
                                            Add Shift
                                          </Button>
                                        </div>

                                        <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
                                          {entry.shifts.map(
                                            (shift, i) => (
                                              <div
                                                key={i}
                                                className="flex gap-2 items-center"
                                              >
                                                <div className="w-6 text-xs text-gray-400 font-bold">
                                                  #{i + 1}
                                                </div>
                                                <Select
                                                  value={shift}
                                                  onValueChange={(
                                                    val,
                                                  ) =>
                                                    updateShift(
                                                      staff.id,
                                                      dateKey,
                                                      i,
                                                      val,
                                                    )
                                                  }
                                                >
                                                  <SelectTrigger className="h-9 flex-1 text-sm">
                                                    <SelectValue />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    <SelectItem value="Morning">
                                                      Morning
                                                    </SelectItem>
                                                    <SelectItem value="Middle">
                                                      Middle
                                                    </SelectItem>
                                                    <SelectItem value="Afternoon">
                                                      Afternoon
                                                    </SelectItem>
                                                    <SelectItem value="Night">
                                                      Night
                                                    </SelectItem>
                                                    <SelectItem value="All Day">
                                                      All Day
                                                    </SelectItem>
                                                  </SelectContent>
                                                </Select>

                                                {entry.shifts
                                                  .length >
                                                  1 && (
                                                  <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-9 w-9 text-gray-400 hover:text-red-500 hover:bg-red-50"
                                                    onClick={() =>
                                                      removeShift(
                                                        staff.id,
                                                        dateKey,
                                                        i,
                                                      )
                                                    }
                                                  >
                                                    <X className="w-4 h-4" />
                                                  </Button>
                                                )}
                                              </div>
                                            ),
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </PopoverContent>
                              </Popover>
                            ) : (
                              <div className="w-full h-full min-h-[80px]">
                                <CellContent
                                  attendance={entry.attendance}
                                  shifts={entry.shifts}
                                  isEditMode={false}
                                />
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}