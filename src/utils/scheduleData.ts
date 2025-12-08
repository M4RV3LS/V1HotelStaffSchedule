// Mock data utilities for schedule

export interface ScheduleEntry {
  id: string;
  department: string;
  designation: string;
  staffName: string;
  schedule: {
    [date: string]: {
      attendance: "Present" | "Absent";
      shifts: string[]; // Array of shifts
    };
  };
}

const staffList = [
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
    designation: "Staff",
    name: "Emily Davis",
  },
  {
    department: "Housekeeping",
    designation: "Staff",
    name: "Maria Garcia",
  },
  {
    department: "Housekeeping",
    designation: "Staff",
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
  Staff: 8,
  Assistant: 9,
};

// Requirement 4: Predefined shifts
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

  const sortedStaff = [...staffList].sort((a, b) => {
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
        // Base shift
        const shiftIndex = (idx + day) % shiftOptions.length;
        shifts.push(shiftOptions[shiftIndex]);

        // Requirement 1: Support > 2 shifts (Randomly add 2nd and 3rd shift)
        if (Math.random() > 0.85 && shifts[0] !== "All Day") {
          const secondShiftIndex =
            (shiftIndex + 1) % (shiftOptions.length - 1);
          shifts.push(shiftOptions[secondShiftIndex]);

          // Occasional 3rd shift
          if (Math.random() > 0.8) {
            const thirdShiftIndex =
              (shiftIndex + 2) % (shiftOptions.length - 1);
            shifts.push(shiftOptions[thirdShiftIndex]);
          }
        }
      }

      schedule[dateKey] = {
        attendance,
        shifts: shifts.sort(), // Sort for consistency
      };
    }

    return {
      id: `staff-${idx}`,
      department: staff.department,
      designation: staff.designation,
      staffName: staff.name,
      schedule,
    };
  });
}

export function hasScheduleForMonth(month: Date): boolean {
  return true;
}