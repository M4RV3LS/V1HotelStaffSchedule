import { UserCheck, Clock, Users } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { cn } from "./ui/utils";
import { isSameDay } from "../utils/dateHelpers";

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

interface TodayOnDutyProps {
  scheduleData: ScheduleEntry[];
  today?: Date;
}

export function TodayOnDuty({
  scheduleData,
  today = new Date(),
}: TodayOnDutyProps) {
  // Format today's date key to match schedule data structure
  const dateKey = today.toISOString().split("T")[0];

  // Filter employees present today
  const onDutyEmployees = scheduleData.filter((emp) => {
    const dailySchedule = emp.schedule[dateKey];
    return (
      dailySchedule && dailySchedule.attendance === "Present"
    );
  });

  // Calculate stats
  const totalStaff = scheduleData.length;
  const presentCount = onDutyEmployees.length;
  const absentCount = totalStaff - presentCount;

  // Group by Shift (Morning, Afternoon, etc.) for better visualization
  // Since an employee can have multiple shifts, we'll categorize based on their "first" shift for the summary,
  // or put them in all applicable buckets. Let's list them under their departments instead for cleanliness.
  const groupedByDept = onDutyEmployees.reduce(
    (acc, emp) => {
      if (!acc[emp.department]) acc[emp.department] = [];
      acc[emp.department].push(emp);
      return acc;
    },
    {} as { [key: string]: typeof onDutyEmployees },
  );

  // Get current time greeting
  const hour = today.getHours();
  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 18
        ? "Good Afternoon"
        : "Good Evening";

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (scheduleData.length === 0) return null;

  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#EA0029]" />
            Who's On Duty Today
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {formattedDate} • {greeting}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Metric Cards */}
        <Card className="bg-[#EA0029] text-white border-none shadow-md">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-white/80 text-xs font-medium uppercase tracking-wider">
                On Duty
              </p>
              <p className="text-3xl font-bold mt-1">
                {presentCount}
              </p>
            </div>
            <div className="bg-white/20 p-2.5 rounded-full">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">
                Total Staff
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {totalStaff}
              </p>
            </div>
            <div className="bg-gray-100 p-2.5 rounded-full">
              <Users className="w-6 h-6 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff List Grouped by Department */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.keys(groupedByDept).length > 0 ? (
          Object.entries(groupedByDept).map(
            ([dept, employees]) => (
              <div
                key={dept}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"
              >
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                  <span className="font-semibold text-gray-700 text-sm">
                    {dept}
                  </span>
                  <span className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-500">
                    {employees.length}
                  </span>
                </div>
                <div className="divide-y divide-gray-100 max-h-[200px] overflow-y-auto">
                  {employees.map((emp) => (
                    <div
                      key={emp.id}
                      className="p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                    >
                      <Avatar className="h-8 w-8 border border-gray-200">
                        <AvatarFallback className="bg-[#EA0029]/10 text-[#EA0029] text-xs font-bold">
                          {getInitials(emp.employeeName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {emp.employeeName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {emp.designation}
                        </p>
                      </div>
                      {/* Display first shift as a badge */}
                      {emp.schedule[dateKey].shifts[0] && (
                        <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                          {emp.schedule[dateKey].shifts[0]}
                          {emp.schedule[dateKey].shifts.length >
                            1 &&
                            ` +${emp.schedule[dateKey].shifts.length - 1}`}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ),
          )
        ) : (
          <div className="col-span-full p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">
              No employees scheduled for today.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}