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
  employeeName: string;
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

export const getShiftStyle = (shift: string) => {
  switch (shift) {
    case "Morning":
      return {
        bg: "bg-yellow-50",
        text: "text-yellow-800",
        border: "border-yellow-300",
      };
    case "Middle":
      return {
        bg: "bg-teal-50",
        text: "text-teal-800",
        border: "border-teal-300",
      };
    case "Afternoon":
      return {
        bg: "bg-orange-50",
        text: "text-orange-800",
        border: "border-orange-300",
      };
    case "Night":
      return {
        bg: "bg-indigo-50",
        text: "text-indigo-800",
        border: "border-indigo-300",
      };
    case "All Day":
      return {
        bg: "bg-purple-50",
        text: "text-purple-800",
        border: "border-purple-300",
      };
    default:
      return {
        bg: "bg-gray-50",
        text: "text-gray-700",
        border: "border-gray-300",
      };
  }
};

export function CellContent({
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
          "flex items-center justify-center w-full h-full rounded-sm transition-all",
          "bg-red-50/50 border border-red-100 text-red-500 font-bold",
          "text-xs sm:text-sm",
          isEditMode &&
            "cursor-pointer hover:ring-2 hover:ring-[#EA0029] hover:z-10",
        )}
      >
        OFF
      </div>
    );
  }
  return (
    <div
      className={cn(
        "w-full h-full flex flex-col gap-1 transition-all relative",
        isEditMode &&
          "cursor-pointer hover:ring-2 hover:ring-[#EA0029] hover:z-10 rounded bg-white shadow-sm p-1",
      )}
    >
      {!isEditMode && (
        <div className="absolute inset-0 p-1 pointer-events-none" />
      )}
      {shifts.slice(0, 4).map((shift, idx) => {
        const style = getShiftStyle(shift);
        return (
          <div
            key={idx}
            className={cn(
              "w-full flex-1 flex items-center justify-center rounded-sm font-semibold border truncate px-1 py-0.5 z-10",
              "text-xs",
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

const availableShifts = [
  "Morning",
  "Middle",
  "Afternoon",
  "Night",
  "All Day",
];

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

  const getDefaultShift = (
    employeeId: string,
    dateKey: string,
  ): string => {
    const employeeIndex =
      parseInt(employeeId.split("-")[1]) || 0;
    const date = new Date(dateKey);
    const day = date.getDate();
    const shiftIndex =
      (employeeIndex + day) % availableShifts.length;
    return availableShifts[shiftIndex];
  };

  const updateAttendance = (
    employeeId: string,
    dateKey: string,
    val: string,
  ) => {
    setScheduleData(
      scheduleData.map((employee) => {
        if (employee.id !== employeeId) return employee;
        let updatedShifts = employee.schedule[dateKey].shifts;
        if (
          val === "Present" &&
          (!updatedShifts || updatedShifts.length === 0)
        ) {
          updatedShifts = [
            getDefaultShift(employeeId, dateKey),
          ];
        }
        if (val === "Absent") updatedShifts = [];
        return {
          ...employee,
          schedule: {
            ...employee.schedule,
            [dateKey]: {
              attendance: val as any,
              shifts: updatedShifts,
            },
          },
        };
      }),
    );
  };

  const updateShift = (
    employeeId: string,
    dateKey: string,
    index: number,
    val: string,
  ) => {
    setScheduleData(
      scheduleData.map((employee) => {
        if (employee.id !== employeeId) return employee;
        const currentShifts = [
          ...employee.schedule[dateKey].shifts,
        ];
        if (val === "All Day") {
          return {
            ...employee,
            schedule: {
              ...employee.schedule,
              [dateKey]: {
                ...employee.schedule[dateKey],
                shifts: ["All Day"],
              },
            },
          };
        }
        currentShifts[index] = val;
        return {
          ...employee,
          schedule: {
            ...employee.schedule,
            [dateKey]: {
              ...employee.schedule[dateKey],
              shifts: currentShifts,
            },
          },
        };
      }),
    );
  };

  const addShift = (employeeId: string, dateKey: string) => {
    setScheduleData(
      scheduleData.map((employee) => {
        if (employee.id !== employeeId) return employee;
        const currentShifts = [
          ...employee.schedule[dateKey].shifts,
        ];
        if (currentShifts.includes("All Day")) return employee;
        if (currentShifts.length < 4) {
          const firstUnused = availableShifts.find(
            (s) => !currentShifts.includes(s),
          );
          if (firstUnused) {
            if (firstUnused === "All Day") {
              currentShifts.length = 0;
              currentShifts.push("All Day");
            } else {
              currentShifts.push(firstUnused);
            }
          } else {
            const regularShift = availableShifts.find(
              (s) => s !== "All Day",
            );
            if (regularShift) currentShifts.push(regularShift);
          }
        }
        return {
          ...employee,
          schedule: {
            ...employee.schedule,
            [dateKey]: {
              ...employee.schedule[dateKey],
              shifts: currentShifts,
            },
          },
        };
      }),
    );
  };

  const removeShift = (
    employeeId: string,
    dateKey: string,
    index: number,
  ) => {
    setScheduleData(
      scheduleData.map((employee) => {
        if (employee.id !== employeeId) return employee;
        const currentShifts = employee.schedule[
          dateKey
        ].shifts.filter((_, i) => i !== index);
        const updatedAttendance =
          currentShifts.length === 0
            ? "Absent"
            : employee.schedule[dateKey].attendance;
        return {
          ...employee,
          schedule: {
            ...employee.schedule,
            [dateKey]: {
              attendance: updatedAttendance,
              shifts: currentShifts,
            },
          },
        };
      }),
    );
  };

  const groupedEmployees = scheduleData.reduce(
    (acc, employee) => {
      if (!acc[employee.department])
        acc[employee.department] = [];
      acc[employee.department].push(employee);
      return acc;
    },
    {} as { [key: string]: ScheduleEntry[] },
  );

  const departments = Object.keys(groupedEmployees).sort();

  return (
    <div className="w-full h-full overflow-auto bg-white scrollbar-thin relative">
      {scheduleData.length === 0 && hasActiveFilters ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 py-12">
          <p className="text-xl font-medium">
            No employees found matching filters
          </p>
        </div>
      ) : (
        <table
          className="w-full border-collapse"
          style={{ tableLayout: "fixed" }}
        >
          {/* Header */}
          <thead className="sticky top-0 z-[11] bg-white shadow-sm ring-1 ring-gray-100">
            <tr className="bg-white border-b border-gray-200 h-16 sm:h-24">
              {/* Employee Details Column - Sticky - SUPER SLIM ON MOBILE (w-16) */}
              <th className="sticky left-0 z-[12] top-0 bg-gray-50/95 backdrop-blur px-2 sm:px-6 py-2 sm:py-4 text-left w-16 sm:w-60 border-r border-gray-200 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.05)]">
                <div className="text-[10px] sm:text-base font-bold text-gray-500 uppercase tracking-wider truncate">
                  <span className="hidden sm:inline">
                    Employee
                  </span>
                  <span className="sm:hidden">Emp</span>
                </div>
              </th>
              {/* Date Columns */}
              {weekDates.map((date) => {
                const isToday = isSameDay(date, today);
                const isInMonth = isDateInMonth(date);
                return (
                  <th
                    key={date.toISOString()}
                    className={cn(
                      "px-1 sm:px-4 py-2 sm:py-4 text-center border-b border-r border-gray-100 min-w-[100px] sm:min-w-[160px]",
                      isToday
                        ? "border-t-2 border-l-2 border-r-2 border-[#EA0029] bg-red-50/10"
                        : !isInMonth && "bg-gray-50/50",
                    )}
                  >
                    <div className="flex flex-col items-center justify-center gap-1 sm:gap-2">
                      <div
                        className={cn(
                          "w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-xs sm:text-base font-bold transition-colors",
                          isToday
                            ? "bg-[#EA0029] text-white shadow-sm"
                            : isInMonth
                              ? "text-gray-900"
                              : "text-gray-400",
                        )}
                      >
                        {date.getDate()}
                      </div>
                      <div
                        className={cn(
                          "text-[10px] sm:text-base uppercase font-semibold tracking-wider",
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
            {departments.map((department, deptIdx) => (
              <Fragment key={department}>
                {groupedEmployees[department].map(
                  (employee, idx) => {
                    const isFirstInGroup = idx === 0;
                    const isLastRow =
                      deptIdx === departments.length - 1 &&
                      idx ===
                        groupedEmployees[department].length - 1;

                    return (
                      <tr
                        key={employee.id}
                        className={cn(
                          "group hover:bg-gray-50/80 transition-colors",
                          isFirstInGroup
                            ? "border-t border-gray-200"
                            : "border-t border-gray-100",
                        )}
                      >
                        {/* Employee Details Cell - Sticky - Adjusted for Mobile */}
                        <td className="sticky left-0 z-[10] bg-white group-hover:bg-gray-50/80 px-1 sm:px-6 py-2 sm:py-6 border-r border-gray-200 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.05)] align-top h-32 sm:h-40">
                          <div className="h-full flex flex-col justify-start gap-0.5 sm:gap-1">
                            {isFirstInGroup && (
                              <div className="text-[8px] sm:text-sm font-extrabold text-gray-400 uppercase tracking-widest mb-1 sm:mb-2 break-words sm:truncate">
                                {department}
                              </div>
                            )}
                            {/* Mobile: Name wraps, smaller font. Desktop: Normal size. */}
                            <div className="font-bold text-[10px] sm:text-base text-gray-900 leading-tight sm:leading-snug break-words">
                              {employee.employeeName}
                            </div>
                            {/* Hide designation on mobile to save space and keep sticky column slim */}
                            <div className="hidden sm:block text-base text-gray-500 font-medium truncate">
                              {employee.designation}
                            </div>
                          </div>
                        </td>

                        {/* Schedule Cells */}
                        {weekDates.map((date) => {
                          const dateKey = date
                            .toISOString()
                            .split("T")[0];
                          const entry =
                            employee.schedule[dateKey];
                          const isToday = isSameDay(
                            date,
                            today,
                          );
                          const isInMonth = isDateInMonth(date);
                          const cellContainerClass =
                            "w-full h-32 sm:h-40";
                          const todayBorderClasses = isToday
                            ? cn(
                                "border-l-2 border-r-2 border-[#EA0029] bg-red-50/5",
                                isLastRow && "border-b-2",
                              )
                            : "";

                          if (!isInMonth) {
                            return (
                              <td
                                key={dateKey}
                                className={cn(
                                  "bg-gray-50/30 border-r border-gray-100 p-0 h-32 sm:h-40",
                                  todayBorderClasses,
                                )}
                              >
                                <div
                                  className={cellContainerClass}
                                />
                              </td>
                            );
                          }
                          if (!entry)
                            return (
                              <td
                                key={dateKey}
                                className={cn(
                                  "border-r border-gray-100 p-0 h-32 sm:h-40",
                                  todayBorderClasses,
                                )}
                              >
                                <div
                                  className={cellContainerClass}
                                />
                              </td>
                            );

                          return (
                            <td
                              key={dateKey}
                              className={cn(
                                "p-1 sm:p-2 align-top border-r p-2 sm:p-4 border-gray-100 h-32 sm:h-40",
                                todayBorderClasses,
                              )}
                            >
                              <div className="h-full w-full">
                                {isEditMode ? (
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <div
                                        role="button"
                                        tabIndex={0}
                                        className="w-full h-full rounded hover:ring-1 hover:ring-gray-200 outline-none"
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
                                    <PopoverContent className="w-72 sm:w-80 p-4 sm:p-5 z-50 shadow-xl border-gray-200">
                                      <div className="space-y-4">
                                        <div className="font-bold text-base text-gray-900 pb-2 border-b flex justify-between items-center">
                                          <span>
                                            Edit Schedule
                                          </span>
                                          <span className="text-base font-normal text-gray-500">
                                            {date.toLocaleDateString()}
                                          </span>
                                        </div>
                                        <div className="space-y-2">
                                          <Label className="text-xs font-bold text-gray-600 uppercase">
                                            Status
                                          </Label>
                                          <Select
                                            defaultValue={
                                              entry.attendance
                                            }
                                            onValueChange={(
                                              val,
                                            ) =>
                                              updateAttendance(
                                                employee.id,
                                                dateKey,
                                                val,
                                              )
                                            }
                                          >
                                            <SelectTrigger className="h-10 text-base">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="Present">
                                                On Duty
                                                (Present)
                                              </SelectItem>
                                              <SelectItem value="Absent">
                                                Off Duty
                                                (Absent)
                                              </SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
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
                                                className="h-8 text-sm text-[#EA0029] hover:text-[#c40023] hover:bg-red-50 px-2 font-medium"
                                                onClick={() =>
                                                  addShift(
                                                    employee.id,
                                                    dateKey,
                                                  )
                                                }
                                                disabled={
                                                  entry.shifts
                                                    .length >=
                                                    4 ||
                                                  entry.shifts.includes(
                                                    "All Day",
                                                  )
                                                }
                                              >
                                                <Plus className="w-4 h-4 mr-1" />{" "}
                                                Add
                                              </Button>
                                            </div>
                                            <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
                                              {entry.shifts.map(
                                                (shift, i) => (
                                                  <div
                                                    key={i}
                                                    className="flex gap-2 items-center"
                                                  >
                                                    <div className="w-6 text-sm text-gray-400 font-bold">
                                                      #{i + 1}
                                                    </div>
                                                    <Select
                                                      value={
                                                        shift
                                                      }
                                                      onValueChange={(
                                                        val,
                                                      ) =>
                                                        updateShift(
                                                          employee.id,
                                                          dateKey,
                                                          i,
                                                          val,
                                                        )
                                                      }
                                                    >
                                                      <SelectTrigger className="h-10 flex-1 text-base">
                                                        <SelectValue />
                                                      </SelectTrigger>
                                                      <SelectContent>
                                                        {availableShifts.map(
                                                          (
                                                            s,
                                                          ) => (
                                                            <SelectItem
                                                              key={
                                                                s
                                                              }
                                                              value={
                                                                s
                                                              }
                                                              disabled={
                                                                entry.shifts.includes(
                                                                  s,
                                                                ) &&
                                                                s !==
                                                                  shift
                                                              }
                                                            >
                                                              {
                                                                s
                                                              }
                                                            </SelectItem>
                                                          ),
                                                        )}
                                                      </SelectContent>
                                                    </Select>
                                                    <Button
                                                      variant="ghost"
                                                      size="icon"
                                                      className="h-10 w-10 text-gray-400 hover:text-red-500 hover:bg-red-50"
                                                      onClick={() =>
                                                        removeShift(
                                                          employee.id,
                                                          dateKey,
                                                          i,
                                                        )
                                                      }
                                                    >
                                                      <X className="w-5 h-5" />
                                                    </Button>
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
                                  <div className="w-full h-full">
                                    <CellContent
                                      attendance={
                                        entry.attendance
                                      }
                                      shifts={entry.shifts}
                                      isEditMode={false}
                                    />
                                  </div>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  },
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}