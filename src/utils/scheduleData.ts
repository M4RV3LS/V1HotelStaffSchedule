// Mock data utilities for schedule

export interface ScheduleEntry {
  id: string;
  department: string;
  designation: string;
  staffName: string;
  schedule: {
    [date: string]: {
      attendance: 'Present' | 'Absent';
      shift: 'Morning' | 'Afternoon' | 'Night' | 'Evening' | 'All Day';
    };
  };
}

const staffList = [
  // Front Desk Department
  { department: 'Front Desk', designation: 'Manager', name: 'Sarah Johnson' },
  { department: 'Front Desk', designation: 'Supervisor', name: 'Michelle Owen' },
  { department: 'Front Desk', designation: 'Receptionist', name: 'Michael Clarke' },
  { department: 'Front Desk', designation: 'Receptionist', name: 'Ricky Ponting' },
  
  // Housekeeping Department
  { department: 'Housekeeping', designation: 'Supervisor', name: 'David Wilson' },
  { department: 'Housekeeping', designation: 'Staff', name: 'Emily Davis' },
  { department: 'Housekeeping', designation: 'Staff', name: 'Maria Garcia' },
  { department: 'Housekeeping', designation: 'Staff', name: 'Anna Rodriguez' },
  
  // Kitchen Department
  { department: 'Kitchen', designation: 'Head Chef', name: 'Michelle Johns' },
  { department: 'Kitchen', designation: 'Sous Chef', name: 'James Miller' },
  { department: 'Kitchen', designation: 'Cook', name: 'Linda Martinez' },
  
  // Maintenance Department
  { department: 'Maintenance', designation: 'Technician', name: 'Robert Brown' },
  { department: 'Maintenance', designation: 'Assistant', name: 'William Lee' },
];

// Designation hierarchy for sorting
const designationOrder: { [key: string]: number } = {
  'Manager': 1,
  'Head Chef': 2,
  'Supervisor': 3,
  'Sous Chef': 4,
  'Technician': 5,
  'Receptionist': 6,
  'Cook': 7,
  'Staff': 8,
  'Assistant': 9,
};

const attendanceOptions: Array<'Present' | 'Absent'> = [
  'Present', 'Absent'
];

const shiftOptions: Array<'Morning' | 'Afternoon' | 'Night' | 'Evening' | 'All Day'> = [
  'Morning', 'Afternoon', 'Night', 'Evening', 'All Day'
];

export function generateMockScheduleData(month: Date): ScheduleEntry[] {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  // Sort staff by department first, then by designation
  const sortedStaff = [...staffList].sort((a, b) => {
    // First sort by department
    if (a.department !== b.department) {
      return a.department.localeCompare(b.department);
    }
    // Then sort by designation hierarchy
    const orderA = designationOrder[a.designation] || 999;
    const orderB = designationOrder[b.designation] || 999;
    return orderA - orderB;
  });

  return sortedStaff.map((staff, idx) => {
    const schedule: ScheduleEntry['schedule'] = {};

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, monthIndex, day);
      const dateKey = date.toISOString().split('T')[0];
      
      // Create predictable but varied patterns
      const attendanceIndex = (idx + day) % attendanceOptions.length;
      const shiftIndex = (idx * 2 + day) % shiftOptions.length;

      schedule[dateKey] = {
        attendance: attendanceOptions[attendanceIndex],
        shift: shiftOptions[shiftIndex],
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

// Determine if schedule exists for a given month
export function hasScheduleForMonth(month: Date): boolean {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  
  const selectedYear = month.getFullYear();
  const selectedMonth = month.getMonth();

  // Has schedule for current month and previous months in current year
  if (selectedYear === currentYear && selectedMonth <= currentMonth) {
    return true;
  }
  
  // Has schedule for all months in previous years
  if (selectedYear < currentYear) {
    return true;
  }

  // No schedule for future months
  return false;
}
