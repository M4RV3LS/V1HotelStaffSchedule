// Mock data utilities for reports

export interface IssueStats {
  resolvedNotExtended: number;
  resolvedExtended: number;
  partiallyResolved: number;
  inProgress: number;
  open: number;
}

export interface EmployeeReport {
  staffName: string;
  department: string;
  designation: string;
  totalPresent: number;
  totalAbsent: number;
  issueStats: IssueStats;
  shifts: {
    morning: number;
    afternoon: number;
    middle: number;
    night: number;
    longShift: number;
  };
}

export interface DepartmentReport {
  department: string;
  totalPresent: number;
  totalAbsent: number;
  issueStats: IssueStats;
  shifts: {
    morning: number;
    afternoon: number;
    middle: number;
    night: number;
    longShift: number;
  };
}

export interface ReportFilters {
  startDate: Date | null;
  endDate: Date | null;
  departments: string[];
  staffNames: string[];
}

// Helper function to calculate percentage
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

// Generate mock employee report data
export function generateEmployeeReports(
  startDate: Date,
  endDate: Date,
  departmentFilter: string[] = [],
  staffFilter: string[] = []
): EmployeeReport[] {
  const staffList = [
    { department: "Front Desk", designation: "Manager", name: "Sarah Johnson" },
    { department: "Front Desk", designation: "Supervisor", name: "Michelle Owen" },
    { department: "Front Desk", designation: "Receptionist", name: "Michael Clarke" },
    { department: "Front Desk", designation: "Receptionist", name: "Ricky Ponting" },
    { department: "Housekeeping", designation: "Supervisor", name: "David Wilson" },
    { department: "Housekeeping", designation: "Staff", name: "Emily Davis" },
    { department: "Housekeeping", designation: "Staff", name: "Maria Garcia" },
    { department: "Housekeeping", designation: "Staff", name: "Anna Rodriguez" },
    { department: "Kitchen", designation: "Head Chef", name: "Michelle Johns" },
    { department: "Kitchen", designation: "Sous Chef", name: "James Miller" },
    { department: "Kitchen", designation: "Cook", name: "Linda Martinez" },
    { department: "Maintenance", designation: "Technician", name: "Robert Brown" },
  ];

  // Calculate days in range
  const daysInRange = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  let filteredStaff = staffList;

  // Apply department filter
  if (departmentFilter.length > 0) {
    filteredStaff = filteredStaff.filter(staff => 
      departmentFilter.includes(staff.department)
    );
  }

  // Apply staff name filter
  if (staffFilter.length > 0) {
    filteredStaff = filteredStaff.filter(staff => 
      staffFilter.includes(staff.name)
    );
  }

  return filteredStaff.map((staff, idx) => {
    // Generate realistic attendance (85-95% present)
    const presentRate = 0.85 + Math.random() * 0.10;
    const totalPresent = Math.floor(daysInRange * presentRate);
    const totalAbsent = daysInRange - totalPresent;

    // Generate issue statistics (total issues between 5-15)
    const totalIssues = 5 + Math.floor(Math.random() * 10);
    const resolvedNotExtended = Math.floor(totalIssues * (0.4 + Math.random() * 0.2));
    const resolvedExtended = Math.floor(totalIssues * (0.2 + Math.random() * 0.15));
    const partiallyResolved = Math.floor(totalIssues * (0.1 + Math.random() * 0.1));
    const inProgress = Math.floor(totalIssues * (0.1 + Math.random() * 0.1));
    const open = totalIssues - resolvedNotExtended - resolvedExtended - partiallyResolved - inProgress;

    // Generate shift distribution
    const totalShifts = totalPresent; // Each present day has one shift
    const morning = Math.floor(totalShifts * (0.3 + Math.random() * 0.2));
    const afternoon = Math.floor(totalShifts * (0.3 + Math.random() * 0.2));
    const middle = Math.floor(totalShifts * (0.1 + Math.random() * 0.1));
    const night = Math.floor(totalShifts * (0.1 + Math.random() * 0.1));
    const longShift = totalShifts - morning - afternoon - middle - night;

    return {
      staffName: staff.name,
      department: staff.department,
      designation: staff.designation,
      totalPresent,
      totalAbsent,
      issueStats: {
        resolvedNotExtended,
        resolvedExtended,
        partiallyResolved,
        inProgress,
        open,
      },
      shifts: {
        morning,
        afternoon,
        middle,
        night,
        longShift,
      },
    };
  });
}

// Generate department aggregated reports
export function generateDepartmentReports(
  employeeReports: EmployeeReport[]
): DepartmentReport[] {
  const departmentMap = new Map<string, DepartmentReport>();

  employeeReports.forEach(emp => {
    const existing = departmentMap.get(emp.department);
    
    if (existing) {
      existing.totalPresent += emp.totalPresent;
      existing.totalAbsent += emp.totalAbsent;
      existing.issueStats.resolvedNotExtended += emp.issueStats.resolvedNotExtended;
      existing.issueStats.resolvedExtended += emp.issueStats.resolvedExtended;
      existing.issueStats.partiallyResolved += emp.issueStats.partiallyResolved;
      existing.issueStats.inProgress += emp.issueStats.inProgress;
      existing.issueStats.open += emp.issueStats.open;
      existing.shifts.morning += emp.shifts.morning;
      existing.shifts.afternoon += emp.shifts.afternoon;
      existing.shifts.middle += emp.shifts.middle;
      existing.shifts.night += emp.shifts.night;
      existing.shifts.longShift += emp.shifts.longShift;
    } else {
      departmentMap.set(emp.department, {
        department: emp.department,
        totalPresent: emp.totalPresent,
        totalAbsent: emp.totalAbsent,
        issueStats: { ...emp.issueStats },
        shifts: { ...emp.shifts },
      });
    }
  });

  return Array.from(departmentMap.values()).sort((a, b) => 
    a.department.localeCompare(b.department)
  );
}