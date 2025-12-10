// Mock data utilities for schedule

export interface ScheduleEntry {
  id: string;
  department: string;
  designation: string;
  employeeName: string;
  schedule: {
    [date: string]: {
      attendance: "Present" | "Absent";
      shifts: string[]; // Array of shifts
    };
  };
}

const employeeList = [
  {
    department: "Front Desk",
    designation: "Manager",
    name: "Sarah Johnson",
  },
  {
    department: "Front Desk",
    designation: "Supervisor",
    name: "Michelle Owen",
  },
  {
    department: "Front Desk",
    designation: "Receptionist",
    name: "Michael Clarke",
  },
  {
    department: "Front Desk",
    designation: "Receptionist",
    name: "Ricky Ponting",
  },
  {
    department: "Housekeeping",
    designation: "Supervisor",
    name: "David Wilson",
  },
  {
    department: "Housekeeping",
    designation: "Employee",
    name: "Emily Davis",
  },
  {
    department: "Housekeeping",
    designation: "Employee",
    name: "Maria Garcia",
  },
  {
    department: "Housekeeping",
    designation: "Employee",
    name: "Anna Rodriguez",
  },
  {
    department: "Kitchen",
    designation: "Head Chef",
    name: "Michelle Johns",
  },
  {
    department: "Kitchen",
    designation: "Sous Chef",
    name: "James Miller",
  },
  {
    department: "Kitchen",
    designation: "Cook",
    name: "Linda Martinez",
  },
  {
    department: "Maintenance",
    designation: "Technician",
    name: "Robert Brown",
  },
];

const designationOrder: { [key: string]: number } = {
  Manager: 1,
  "Head Chef": 2,
  Supervisor: 3,
  "Sous Chef": 4,
  Technician: 5,
  Receptionist: 6,
  Cook: 7,
  Employee: 8,
  Assistant: 9,
};

const shiftOptions = [
  "Morning",
  "Middle",
  "Afternoon",
  "Night",
  "All Day",
];

export function generateMockScheduleData(
  month: Date,
): ScheduleEntry[] {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const daysInMonth = new Date(
    year,
    monthIndex + 1,
    0,
  ).getDate();

  const sortedStaff = [...employeeList].sort((a, b) => {
    if (a.department !== b.department)
      return a.department.localeCompare(b.department);
    return (
      (designationOrder[a.designation] || 999) -
      (designationOrder[b.designation] || 999)
    );
  });

  return sortedStaff.map((staff, idx) => {
    const schedule: ScheduleEntry["schedule"] = {};

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, monthIndex, day);
      const dateKey = date.toISOString().split("T")[0];

      const attendance =
        Math.random() > 0.15 ? "Present" : "Absent";
      const shifts: string[] = [];

      if (attendance === "Present") {
        // Requirement 1: Default data is 1 shift only
        // We assign a single shift based on a simple rotation or random selection
        const shiftIndex = (idx + day) % shiftOptions.length;
        shifts.push(shiftOptions[shiftIndex]);
      }

      schedule[dateKey] = {
        attendance,
        shifts: shifts,
      };
    }

    return {
      id: `staff-${idx}`,
      department: staff.department,
      designation: staff.designation,
      employeeName: staff.name,
      schedule,
    };
  });
}

export function hasScheduleForMonth(month: Date): boolean {
  // Requirement 1: Start from January 2026, schedule needs to be created manually
  // This means hasScheduleForMonth returns false for >= Jan 2026
  const cutoffDate = new Date(2026, 0, 1); // January 1, 2026

  // We compare the first day of the selected month with the cutoff
  const checkDate = new Date(
    month.getFullYear(),
    month.getMonth(),
    1,
  );

  if (checkDate >= cutoffDate) {
    return false;
  }

  return true;
}

// Helper function to check if a month is within the allowed range (current month + 1)
export function isMonthAllowed(month: Date): boolean {
  const today = new Date();
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const checkMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  
  // Allow all past months, current month, and next month
  // Block any months after next month (current month + 2 and beyond)
  return checkMonth <= nextMonth;
}