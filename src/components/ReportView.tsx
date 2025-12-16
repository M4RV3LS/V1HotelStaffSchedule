import { useState, useMemo } from 'react';
import { Download, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { FilterCombobox, SelectedFilter } from './FilterCombobox';
import { DateRangePicker } from './DateRangePicker';
import {
  generateEmployeeReports,
  generateDepartmentReports,
  calculatePercentage,
  type EmployeeReport,
  type DepartmentReport,
} from '../utils/reportData';

interface ReportViewProps {
  selectedMonth: Date;
}

export function ReportView({ selectedMonth }: ReportViewProps) {
  // Default date range: First day of current month to today
  const getDefaultDateRange = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    return { start: firstDay, end: today };
  };

  const defaultRange = getDefaultDateRange();
  const [startDate, setStartDate] = useState<Date>(defaultRange.start);
  const [endDate, setEndDate] = useState<Date>(defaultRange.end);
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilter[]>([]);

  const handleDateChange = (newStartDate: Date, newEndDate: Date) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  // Extract unique departments, designations, and staff from mock data
  const allDepartments = ['Front Desk', 'Housekeeping', 'Kitchen', 'Maintenance'];
  const allDesignations = ['Manager', 'Supervisor', 'Receptionist', 'Staff', 'Head Chef', 'Sous Chef', 'Cook', 'Technician'];
  const allStaffNames = [
    { name: 'Sarah Johnson', department: 'Front Desk', designation: 'Manager' },
    { name: 'Michelle Owen', department: 'Front Desk', designation: 'Supervisor' },
    { name: 'Michael Clarke', department: 'Front Desk', designation: 'Receptionist' },
    { name: 'Ricky Ponting', department: 'Front Desk', designation: 'Receptionist' },
    { name: 'David Wilson', department: 'Housekeeping', designation: 'Supervisor' },
    { name: 'Emily Davis', department: 'Housekeeping', designation: 'Staff' },
    { name: 'Maria Garcia', department: 'Housekeeping', designation: 'Staff' },
    { name: 'Anna Rodriguez', department: 'Housekeeping', designation: 'Staff' },
    { name: 'Michelle Johns', department: 'Kitchen', designation: 'Head Chef' },
    { name: 'James Miller', department: 'Kitchen', designation: 'Sous Chef' },
    { name: 'Linda Martinez', department: 'Kitchen', designation: 'Cook' },
    { name: 'Robert Brown', department: 'Maintenance', designation: 'Technician' },
  ];

  // Parse filters
  const departmentFilters = selectedFilters
    .filter(f => f.type === 'department')
    .map(f => f.value);
  const staffFilters = selectedFilters
    .filter(f => f.type === 'name')
    .map(f => f.value);

  // Generate reports with filters
  const employeeReports = useMemo(
    () => generateEmployeeReports(startDate, endDate, departmentFilters, staffFilters),
    [startDate, endDate, departmentFilters.join(','), staffFilters.join(',')]
  );

  const departmentReports = useMemo(
    () => generateDepartmentReports(employeeReports),
    [employeeReports]
  );

  // Calculate employee totals
  const employeeTotals = useMemo(() => {
    if (employeeReports.length === 0) return null;
    
    const totals = {
      totalPresent: 0,
      totalAbsent: 0,
      morning: 0,
      afternoon: 0,
      middle: 0,
      night: 0,
      longShift: 0,
      resolvedNotExtended: 0,
      resolvedExtended: 0,
      partiallyResolved: 0,
      inProgress: 0,
      open: 0,
    };

    employeeReports.forEach(emp => {
      totals.totalPresent += emp.totalPresent;
      totals.totalAbsent += emp.totalAbsent;
      totals.morning += emp.shifts.morning;
      totals.afternoon += emp.shifts.afternoon;
      totals.middle += emp.shifts.middle;
      totals.night += emp.shifts.night;
      totals.longShift += emp.shifts.longShift;
      totals.resolvedNotExtended += emp.issueStats.resolvedNotExtended;
      totals.resolvedExtended += emp.issueStats.resolvedExtended;
      totals.partiallyResolved += emp.issueStats.partiallyResolved;
      totals.inProgress += emp.issueStats.inProgress;
      totals.open += emp.issueStats.open;
    });

    return totals;
  }, [employeeReports]);

  // Calculate department totals
  const departmentTotals = useMemo(() => {
    if (departmentReports.length === 0) return null;
    
    const totals = {
      totalPresent: 0,
      totalAbsent: 0,
      morning: 0,
      afternoon: 0,
      middle: 0,
      night: 0,
      longShift: 0,
      resolvedNotExtended: 0,
      resolvedExtended: 0,
      partiallyResolved: 0,
      inProgress: 0,
      open: 0,
    };

    departmentReports.forEach(dept => {
      totals.totalPresent += dept.totalPresent;
      totals.totalAbsent += dept.totalAbsent;
      totals.morning += dept.shifts.morning;
      totals.afternoon += dept.shifts.afternoon;
      totals.middle += dept.shifts.middle;
      totals.night += dept.shifts.night;
      totals.longShift += dept.shifts.longShift;
      totals.resolvedNotExtended += dept.issueStats.resolvedNotExtended;
      totals.resolvedExtended += dept.issueStats.resolvedExtended;
      totals.partiallyResolved += dept.issueStats.partiallyResolved;
      totals.inProgress += dept.issueStats.inProgress;
      totals.open += dept.issueStats.open;
    });

    return totals;
  }, [departmentReports]);

  const handleExport = () => {
    // Mock export functionality
    alert('Export functionality would generate CSV/Excel file with report data');
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col gap-4 bg-white p-4 rounded border border-gray-200">
        <div>
          <h2 className="text-gray-900">Staff Performance Report</h2>
          <p className="text-sm text-gray-500 mt-1">
            {startDate.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })} - {endDate.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {/* Date Range Picker */}
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onDateChange={handleDateChange}
            className="w-full"
          />

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Filter Combobox */}
            <div className="flex-1">
              <FilterCombobox
                departments={allDepartments}
                designations={allDesignations}
                staffNames={allStaffNames}
                selectedFilters={selectedFilters}
                onFilterChange={setSelectedFilters}
                className="w-full"
              />
            </div>

            {/* Export Button */}
            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#EA0029] text-white rounded hover:bg-[#c5001f] transition-colors w-full sm:w-auto"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Employee Reports - Desktop Table View */}
      <Card className="hidden lg:block">
        <CardHeader>
          <CardTitle>Employee Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <EmployeeDesktopTable 
            employeeReports={employeeReports}
            employeeTotals={employeeTotals}
          />
        </CardContent>
      </Card>

      {/* Employee Reports - Mobile Card View */}
      <div className="lg:hidden space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Employee Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <EmployeeMobileCards 
              employeeReports={employeeReports}
              employeeTotals={employeeTotals}
            />
          </CardContent>
        </Card>
      </div>

      {/* Department Reports - Desktop Table View */}
      <Card className="hidden lg:block">
        <CardHeader>
          <CardTitle>Department Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <DepartmentDesktopTable 
            departmentReports={departmentReports}
            departmentTotals={departmentTotals}
          />
        </CardContent>
      </Card>

      {/* Department Reports - Mobile Card View */}
      <div className="lg:hidden space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Department Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <DepartmentMobileCards 
              departmentReports={departmentReports}
              departmentTotals={departmentTotals}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Desktop Table Components
function EmployeeDesktopTable({ 
  employeeReports, 
  employeeTotals 
}: { 
  employeeReports: EmployeeReport[];
  employeeTotals: any;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-gray-300">
            {/* Fixed Employee Info Columns */}
            <th rowSpan={2} className="sticky left-0 z-10 bg-white text-left py-2 px-3 text-xs text-gray-600 border-r border-gray-200 min-w-[120px]">
              Employee Name
            </th>
            <th rowSpan={2} className="text-left py-2 px-3 text-xs text-gray-600 border-r border-gray-200 min-w-[100px]">
              Role
            </th>
            <th rowSpan={2} className="text-left py-2 px-3 text-xs text-gray-600 border-r border-gray-200 min-w-[110px]">
              Department
            </th>
            
            {/* Attendance Columns */}
            <th colSpan={4} className="text-center py-2 px-2 text-xs text-gray-600 border-r-2 border-gray-300 border-b border-gray-200 bg-green-50">
              Attendance
            </th>
            
            {/* Shift Columns */}
            <th colSpan={10} className="text-center py-2 px-2 text-xs text-gray-600 border-b border-gray-200 bg-blue-50">
              Shift
            </th>
          </tr>
          <tr className="border-b border-gray-200">
            {/* Attendance Sub-headers */}
            <th className="text-center py-2 px-2 text-xs text-gray-600 bg-green-50 min-w-[60px]">Present</th>
            <th className="text-center py-2 px-2 text-xs text-gray-600 bg-green-50 min-w-[60px]">Present %</th>
            <th className="text-center py-2 px-2 text-xs text-gray-600 bg-red-50 min-w-[60px]">Absent</th>
            <th className="text-center py-2 px-2 text-xs text-gray-600 bg-red-50 border-r-2 border-gray-300 min-w-[60px]">Absent %</th>
            
            {/* Shift Sub-headers */}
            <th className="text-center py-2 px-2 text-xs text-gray-600 bg-blue-50 min-w-[60px]">Morning</th>
            <th className="text-center py-2 px-2 text-xs text-gray-600 bg-blue-50 min-w-[70px]">Morning %</th>
            <th className="text-center py-2 px-2 text-xs text-gray-600 bg-blue-50 min-w-[70px]">Afternoon</th>
            <th className="text-center py-2 px-2 text-xs text-gray-600 bg-blue-50 min-w-[75px]">Afternoon %</th>
            <th className="text-center py-2 px-2 text-xs text-gray-600 bg-blue-50 min-w-[60px]">Middle</th>
            <th className="text-center py-2 px-2 text-xs text-gray-600 bg-blue-50 min-w-[65px]">Middle %</th>
            <th className="text-center py-2 px-2 text-xs text-gray-600 bg-blue-50 min-w-[55px]">Night</th>
            <th className="text-center py-2 px-2 text-xs text-gray-600 bg-blue-50 min-w-[60px]">Night %</th>
            <th className="text-center py-2 px-2 text-xs text-gray-600 bg-blue-50 min-w-[75px]">Long Shift</th>
            <th className="text-center py-2 px-2 text-xs text-gray-600 bg-blue-50 min-w-[80px]">Long Shift %</th>
          </tr>
        </thead>
        <tbody>
          {employeeReports.map((emp, idx) => {
            const totalAttendance = emp.totalPresent + emp.totalAbsent;
            const totalShifts = emp.shifts.morning + emp.shifts.afternoon + emp.shifts.middle + emp.shifts.night + emp.shifts.longShift;
            
            return (
              <tr
                key={emp.staffName}
                className={`border-b border-gray-100 ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                {/* Employee Info */}
                <td className="sticky left-0 z-10 bg-inherit py-2 px-3 text-xs text-gray-900 border-r border-gray-100">{emp.staffName}</td>
                <td className="py-2 px-3 text-xs text-gray-600 border-r border-gray-100">{emp.designation}</td>
                <td className="py-2 px-3 text-xs text-gray-600 border-r border-gray-100">{emp.department}</td>
                
                {/* Attendance */}
                <td className="py-2 px-2 text-xs text-center text-green-600">{emp.totalPresent}</td>
                <td className="py-2 px-2 text-xs text-center text-green-600">{calculatePercentage(emp.totalPresent, totalAttendance)}%</td>
                <td className="py-2 px-2 text-xs text-center text-red-600">{emp.totalAbsent}</td>
                <td className="py-2 px-2 text-xs text-center text-red-600 border-r-2 border-gray-200">{calculatePercentage(emp.totalAbsent, totalAttendance)}%</td>
                
                {/* Shifts */}
                <td className="py-2 px-2 text-xs text-center text-gray-700">{emp.shifts.morning}</td>
                <td className="py-2 px-2 text-xs text-center text-gray-600">{calculatePercentage(emp.shifts.morning, totalShifts)}%</td>
                <td className="py-2 px-2 text-xs text-center text-gray-700">{emp.shifts.afternoon}</td>
                <td className="py-2 px-2 text-xs text-center text-gray-600">{calculatePercentage(emp.shifts.afternoon, totalShifts)}%</td>
                <td className="py-2 px-2 text-xs text-center text-gray-700">{emp.shifts.middle}</td>
                <td className="py-2 px-2 text-xs text-center text-gray-600">{calculatePercentage(emp.shifts.middle, totalShifts)}%</td>
                <td className="py-2 px-2 text-xs text-center text-gray-700">{emp.shifts.night}</td>
                <td className="py-2 px-2 text-xs text-center text-gray-600">{calculatePercentage(emp.shifts.night, totalShifts)}%</td>
                <td className="py-2 px-2 text-xs text-center text-gray-700">{emp.shifts.longShift}</td>
                <td className="py-2 px-2 text-xs text-center text-gray-600">{calculatePercentage(emp.shifts.longShift, totalShifts)}%</td>
              </tr>
            );
          })}
          
          {/* Totals Row */}
          {employeeTotals && (() => {
            const totalAttendance = employeeTotals.totalPresent + employeeTotals.totalAbsent;
            const totalShifts = employeeTotals.morning + employeeTotals.afternoon + employeeTotals.middle + employeeTotals.night + employeeTotals.longShift;
            
            return (
              <tr className="bg-gray-100 border-t-2 border-[#EA0029]">
                <td colSpan={3} className="sticky left-0 z-10 bg-gray-100 py-2 px-3 text-xs text-gray-900 border-r border-gray-200">
                  <strong>TOTAL</strong>
                </td>
                
                {/* Attendance Totals */}
                <td className="py-2 px-2 text-xs text-center text-green-700"><strong>{employeeTotals.totalPresent}</strong></td>
                <td className="py-2 px-2 text-xs text-center text-green-700"><strong>{calculatePercentage(employeeTotals.totalPresent, totalAttendance)}%</strong></td>
                <td className="py-2 px-2 text-xs text-center text-red-700"><strong>{employeeTotals.totalAbsent}</strong></td>
                <td className="py-2 px-2 text-xs text-center text-red-700 border-r-2 border-gray-200"><strong>{calculatePercentage(employeeTotals.totalAbsent, totalAttendance)}%</strong></td>
                
                {/* Shift Totals */}
                <td className="py-2 px-2 text-xs text-center text-gray-900"><strong>{employeeTotals.morning}</strong></td>
                <td className="py-2 px-2 text-xs text-center text-gray-700"><strong>{calculatePercentage(employeeTotals.morning, totalShifts)}%</strong></td>
                <td className="py-2 px-2 text-xs text-center text-gray-900"><strong>{employeeTotals.afternoon}</strong></td>
                <td className="py-2 px-2 text-xs text-center text-gray-700"><strong>{calculatePercentage(employeeTotals.afternoon, totalShifts)}%</strong></td>
                <td className="py-2 px-2 text-xs text-center text-gray-900"><strong>{employeeTotals.middle}</strong></td>
                <td className="py-2 px-2 text-xs text-center text-gray-700"><strong>{calculatePercentage(employeeTotals.middle, totalShifts)}%</strong></td>
                <td className="py-2 px-2 text-xs text-center text-gray-900"><strong>{employeeTotals.night}</strong></td>
                <td className="py-2 px-2 text-xs text-center text-gray-700"><strong>{calculatePercentage(employeeTotals.night, totalShifts)}%</strong></td>
                <td className="py-2 px-2 text-xs text-center text-gray-900"><strong>{employeeTotals.longShift}</strong></td>
                <td className="py-2 px-2 text-xs text-center text-gray-700"><strong>{calculatePercentage(employeeTotals.longShift, totalShifts)}%</strong></td>
              </tr>
            );
          })()}

          {employeeReports.length === 0 && (
            <tr>
              <td colSpan={17} className="py-12 text-center text-gray-500 text-sm">
                No data available for selected filters
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function DepartmentDesktopTable({ 
  departmentReports, 
  departmentTotals 
}: { 
  departmentReports: DepartmentReport[];
  departmentTotals: any;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-gray-300">
            {/* Department Column */}
            <th rowSpan={2} className="sticky left-0 z-10 bg-white text-left py-2 px-3 text-xs text-gray-600 border-r border-gray-200 min-w-[140px]">
              Department
            </th>
            
            {/* Attendance Columns */}
            <th colSpan={4} className="text-center py-2 px-2 text-xs text-gray-600 border-r-2 border-gray-300 border-b border-gray-200 bg-green-50">
              Attendance
            </th>
            
            {/* Shift Columns */}
            <th colSpan={10} className="text-center py-2 px-2 text-xs text-gray-600 border-b border-gray-200 bg-blue-50">
              Shift
            </th>
          </tr>
          <tr className="border-b border-gray-200">
            {/* Attendance Sub-headers */}
            <th className="text-center py-2 px-2 text-xs text-gray-600 bg-green-50 min-w-[60px]">Present</th>
            <th className="text-center py-2 px-2 text-xs text-gray-600 bg-green-50 min-w-[60px]">Present %</th>
            <th className="text-center py-2 px-2 text-xs text-gray-600 bg-red-50 min-w-[60px]">Absent</th>
            <th className="text-center py-2 px-2 text-xs text-gray-600 bg-red-50 border-r-2 border-gray-300 min-w-[60px]">Absent %</th>
            
            {/* Shift Sub-headers */}
            <th className="text-center py-2 px-2 text-xs text-gray-600 bg-blue-50 min-w-[60px]">Morning</th>
            <th className="text-center py-2 px-2 text-xs text-gray-600 bg-blue-50 min-w-[70px]">Morning %</th>
            <th className="text-center py-2 px-2 text-xs text-gray-600 bg-blue-50 min-w-[70px]">Afternoon</th>
            <th className="text-center py-2 px-2 text-xs text-gray-600 bg-blue-50 min-w-[75px]">Afternoon %</th>
            <th className="text-center py-2 px-2 text-xs text-gray-600 bg-blue-50 min-w-[60px]">Middle</th>
            <th className="text-center py-2 px-2 text-xs text-gray-600 bg-blue-50 min-w-[65px]">Middle %</th>
            <th className="text-center py-2 px-2 text-xs text-gray-600 bg-blue-50 min-w-[55px]">Night</th>
            <th className="text-center py-2 px-2 text-xs text-gray-600 bg-blue-50 min-w-[60px]">Night %</th>
            <th className="text-center py-2 px-2 text-xs text-gray-600 bg-blue-50 min-w-[75px]">Long Shift</th>
            <th className="text-center py-2 px-2 text-xs text-gray-600 bg-blue-50 min-w-[80px]">Long Shift %</th>
          </tr>
        </thead>
        <tbody>
          {departmentReports.map((dept, idx) => {
            const totalAttendance = dept.totalPresent + dept.totalAbsent;
            const totalShifts = dept.shifts.morning + dept.shifts.afternoon + dept.shifts.middle + dept.shifts.night + dept.shifts.longShift;
            
            return (
              <tr
                key={dept.department}
                className={`border-b border-gray-100 ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                {/* Department */}
                <td className="sticky left-0 z-10 bg-inherit py-2 px-3 text-xs text-gray-900 border-r border-gray-100">{dept.department}</td>
                
                {/* Attendance */}
                <td className="py-2 px-2 text-xs text-center text-green-600">{dept.totalPresent}</td>
                <td className="py-2 px-2 text-xs text-center text-green-600">{calculatePercentage(dept.totalPresent, totalAttendance)}%</td>
                <td className="py-2 px-2 text-xs text-center text-red-600">{dept.totalAbsent}</td>
                <td className="py-2 px-2 text-xs text-center text-red-600 border-r-2 border-gray-200">{calculatePercentage(dept.totalAbsent, totalAttendance)}%</td>
                
                {/* Shifts */}
                <td className="py-2 px-2 text-xs text-center text-gray-700">{dept.shifts.morning}</td>
                <td className="py-2 px-2 text-xs text-center text-gray-600">{calculatePercentage(dept.shifts.morning, totalShifts)}%</td>
                <td className="py-2 px-2 text-xs text-center text-gray-700">{dept.shifts.afternoon}</td>
                <td className="py-2 px-2 text-xs text-center text-gray-600">{calculatePercentage(dept.shifts.afternoon, totalShifts)}%</td>
                <td className="py-2 px-2 text-xs text-center text-gray-700">{dept.shifts.middle}</td>
                <td className="py-2 px-2 text-xs text-center text-gray-600">{calculatePercentage(dept.shifts.middle, totalShifts)}%</td>
                <td className="py-2 px-2 text-xs text-center text-gray-700">{dept.shifts.night}</td>
                <td className="py-2 px-2 text-xs text-center text-gray-600">{calculatePercentage(dept.shifts.night, totalShifts)}%</td>
                <td className="py-2 px-2 text-xs text-center text-gray-700">{dept.shifts.longShift}</td>
                <td className="py-2 px-2 text-xs text-center text-gray-600">{calculatePercentage(dept.shifts.longShift, totalShifts)}%</td>
              </tr>
            );
          })}
          
          {/* Totals Row */}
          {departmentTotals && (() => {
            const totalAttendance = departmentTotals.totalPresent + departmentTotals.totalAbsent;
            const totalShifts = departmentTotals.morning + departmentTotals.afternoon + departmentTotals.middle + departmentTotals.night + departmentTotals.longShift;
            
            return (
              <tr className="bg-gray-100 border-t-2 border-[#EA0029]">
                <td className="sticky left-0 z-10 bg-gray-100 py-2 px-3 text-xs text-gray-900 border-r border-gray-200">
                  <strong>TOTAL</strong>
                </td>
                
                {/* Attendance Totals */}
                <td className="py-2 px-2 text-xs text-center text-green-700"><strong>{departmentTotals.totalPresent}</strong></td>
                <td className="py-2 px-2 text-xs text-center text-green-700"><strong>{calculatePercentage(departmentTotals.totalPresent, totalAttendance)}%</strong></td>
                <td className="py-2 px-2 text-xs text-center text-red-700"><strong>{departmentTotals.totalAbsent}</strong></td>
                <td className="py-2 px-2 text-xs text-center text-red-700 border-r-2 border-gray-200"><strong>{calculatePercentage(departmentTotals.totalAbsent, totalAttendance)}%</strong></td>
                
                {/* Shift Totals */}
                <td className="py-2 px-2 text-xs text-center text-gray-900"><strong>{departmentTotals.morning}</strong></td>
                <td className="py-2 px-2 text-xs text-center text-gray-700"><strong>{calculatePercentage(departmentTotals.morning, totalShifts)}%</strong></td>
                <td className="py-2 px-2 text-xs text-center text-gray-900"><strong>{departmentTotals.afternoon}</strong></td>
                <td className="py-2 px-2 text-xs text-center text-gray-700"><strong>{calculatePercentage(departmentTotals.afternoon, totalShifts)}%</strong></td>
                <td className="py-2 px-2 text-xs text-center text-gray-900"><strong>{departmentTotals.middle}</strong></td>
                <td className="py-2 px-2 text-xs text-center text-gray-700"><strong>{calculatePercentage(departmentTotals.middle, totalShifts)}%</strong></td>
                <td className="py-2 px-2 text-xs text-center text-gray-900"><strong>{departmentTotals.night}</strong></td>
                <td className="py-2 px-2 text-xs text-center text-gray-700"><strong>{calculatePercentage(departmentTotals.night, totalShifts)}%</strong></td>
                <td className="py-2 px-2 text-xs text-center text-gray-900"><strong>{departmentTotals.longShift}</strong></td>
                <td className="py-2 px-2 text-xs text-center text-gray-700"><strong>{calculatePercentage(departmentTotals.longShift, totalShifts)}%</strong></td>
              </tr>
            );
          })()}

          {departmentReports.length === 0 && (
            <tr>
              <td colSpan={15} className="py-12 text-center text-gray-500 text-sm">
                No data available for selected filters
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// Mobile Card Components
function EmployeeMobileCards({ 
  employeeReports, 
  employeeTotals 
}: { 
  employeeReports: EmployeeReport[];
  employeeTotals: any;
}) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (employeeReports.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500 text-sm">
        No data available for selected filters
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {employeeReports.map((emp, idx) => {
        const totalAttendance = emp.totalPresent + emp.totalAbsent;
        const totalShifts = emp.shifts.morning + emp.shifts.afternoon + emp.shifts.middle + emp.shifts.night + emp.shifts.longShift;
        const isExpanded = expandedIndex === idx;

        return (
          <div key={emp.staffName} className="border border-gray-200 rounded-lg bg-white">
            {/* Card Header */}
            <div 
              className="p-3 cursor-pointer"
              onClick={() => setExpandedIndex(isExpanded ? null : idx)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm text-gray-900 truncate">{emp.staffName}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{emp.designation} • {emp.department}</p>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                )}
              </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
              <div className="px-3 pb-3 space-y-3 border-t border-gray-100">
                {/* Attendance */}
                <div className="pt-3">
                  <h5 className="text-xs text-gray-500 mb-2">Attendance</h5>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-green-50 border border-green-200 rounded p-2">
                      <div className="text-xs text-gray-600">Present</div>
                      <div className="text-sm text-green-700 mt-1">
                        <strong>{emp.totalPresent}</strong>
                        <span className="text-xs ml-1">({calculatePercentage(emp.totalPresent, totalAttendance)}%)</span>
                      </div>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded p-2">
                      <div className="text-xs text-gray-600">Absent</div>
                      <div className="text-sm text-red-700 mt-1">
                        <strong>{emp.totalAbsent}</strong>
                        <span className="text-xs ml-1">({calculatePercentage(emp.totalAbsent, totalAttendance)}%)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shifts */}
                <div>
                  <h5 className="text-xs text-gray-500 mb-2">Shifts</h5>
                  <div className="grid grid-cols-2 gap-2">
                    <MobileShiftBox 
                      label="Morning" 
                      value={emp.shifts.morning} 
                      percentage={calculatePercentage(emp.shifts.morning, totalShifts)} 
                    />
                    <MobileShiftBox 
                      label="Afternoon" 
                      value={emp.shifts.afternoon} 
                      percentage={calculatePercentage(emp.shifts.afternoon, totalShifts)} 
                    />
                    <MobileShiftBox 
                      label="Middle" 
                      value={emp.shifts.middle} 
                      percentage={calculatePercentage(emp.shifts.middle, totalShifts)} 
                    />
                    <MobileShiftBox 
                      label="Night" 
                      value={emp.shifts.night} 
                      percentage={calculatePercentage(emp.shifts.night, totalShifts)} 
                    />
                    <MobileShiftBox 
                      label="Long Shift" 
                      value={emp.shifts.longShift} 
                      percentage={calculatePercentage(emp.shifts.longShift, totalShifts)} 
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Totals Card */}
      {employeeTotals && (
        <div className="border-2 border-[#EA0029] rounded-lg bg-gray-50 p-4">
          <h4 className="text-sm text-gray-900 mb-3">
            <strong>TOTAL - All Employees</strong>
          </h4>
          
          {/* Attendance */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-600">Attendance</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-green-50 border border-green-200 rounded p-2">
                <div className="text-xs text-gray-600">Present</div>
                <div className="text-sm text-green-700">
                  <strong>{employeeTotals.totalPresent}</strong>
                  <span className="text-xs ml-1">
                    ({calculatePercentage(
                      employeeTotals.totalPresent,
                      employeeTotals.totalPresent + employeeTotals.totalAbsent
                    )}%)
                  </span>
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded p-2">
                <div className="text-xs text-gray-600">Absent</div>
                <div className="text-sm text-red-700">
                  <strong>{employeeTotals.totalAbsent}</strong>
                  <span className="text-xs ml-1">
                    ({calculatePercentage(
                      employeeTotals.totalAbsent,
                      employeeTotals.totalPresent + employeeTotals.totalAbsent
                    )}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Shifts */}
          <div className="mb-3">
            <div className="text-xs text-gray-600 mb-1">Shifts</div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white border border-gray-200 rounded p-2">
                <div className="text-xs text-gray-600">Morning</div>
                <div className="text-sm text-gray-900">
                  <strong>{employeeTotals.morning}</strong>
                  <div className="text-xs text-gray-600">
                    ({calculatePercentage(
                      employeeTotals.morning,
                      employeeTotals.morning + employeeTotals.afternoon + employeeTotals.night
                    )}%)
                  </div>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded p-2">
                <div className="text-xs text-gray-600">Afternoon</div>
                <div className="text-sm text-gray-900">
                  <strong>{employeeTotals.afternoon}</strong>
                  <div className="text-xs text-gray-600">
                    ({calculatePercentage(
                      employeeTotals.afternoon,
                      employeeTotals.morning + employeeTotals.afternoon + employeeTotals.night
                    )}%)
                  </div>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded p-2">
                <div className="text-xs text-gray-600">Night</div>
                <div className="text-sm text-gray-900">
                  <strong>{employeeTotals.night}</strong>
                  <div className="text-xs text-gray-600">
                    ({calculatePercentage(
                      employeeTotals.night,
                      employeeTotals.morning + employeeTotals.afternoon + employeeTotals.night
                    )}%)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DepartmentMobileCards({ 
  departmentReports, 
  departmentTotals 
}: { 
  departmentReports: DepartmentReport[];
  departmentTotals: any;
}) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (departmentReports.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500 text-sm">
        No data available for selected filters
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {departmentReports.map((dept, idx) => {
        const totalIssues = dept.issueStats.resolvedNotExtended + dept.issueStats.resolvedExtended + 
          dept.issueStats.partiallyResolved + dept.issueStats.inProgress + dept.issueStats.open;
        const isExpanded = expandedIndex === idx;

        return (
          <div key={dept.department} className="border border-gray-200 rounded-lg bg-white">
            {/* Card Header */}
            <div 
              className="p-4 cursor-pointer"
              onClick={() => setExpandedIndex(isExpanded ? null : idx)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-sm text-gray-900">{dept.department}</h4>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs text-gray-500">Present/Absent</span>
                    <div className="flex gap-2 mt-0.5">
                      <span className="text-sm text-green-600">{dept.totalPresent}</span>
                      <span className="text-gray-300">/</span>
                      <span className="text-sm text-red-600">{dept.totalAbsent}</span>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
              <div className="px-4 pb-4 space-y-4 border-t border-gray-100">
                {/* Shifts */}
                <div>
                  <h5 className="text-xs text-gray-500 mb-2 mt-3">Shifts</h5>
                  <div className="grid grid-cols-3 gap-2">
                    <MetricBox label="Morning" value={dept.shifts.morning} color="gray" />
                    <MetricBox label="Afternoon" value={dept.shifts.afternoon} color="gray" />
                    <MetricBox label="Night" value={dept.shifts.night} color="gray" />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Totals Card */}
      {departmentTotals && (
        <div className="border-2 border-[#EA0029] rounded-lg bg-gray-50 p-4">
          <h4 className="text-sm text-gray-900 mb-3">
            <strong>TOTAL - All Departments</strong>
          </h4>
          
          {/* Attendance */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-600">Attendance</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-green-50 border border-green-200 rounded p-2">
                <div className="text-xs text-gray-600">Present</div>
                <div className="text-sm text-green-700">
                  <strong>{departmentTotals.totalPresent}</strong>
                  <span className="text-xs ml-1">
                    ({calculatePercentage(
                      departmentTotals.totalPresent,
                      departmentTotals.totalPresent + departmentTotals.totalAbsent
                    )}%)
                  </span>
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded p-2">
                <div className="text-xs text-gray-600">Absent</div>
                <div className="text-sm text-red-700">
                  <strong>{departmentTotals.totalAbsent}</strong>
                  <span className="text-xs ml-1">
                    ({calculatePercentage(
                      departmentTotals.totalAbsent,
                      departmentTotals.totalPresent + departmentTotals.totalAbsent
                    )}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Shifts */}
          <div className="mb-3">
            <div className="text-xs text-gray-600 mb-1">Shifts</div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white border border-gray-200 rounded p-2">
                <div className="text-xs text-gray-600">Morning</div>
                <div className="text-sm text-gray-900">
                  <strong>{departmentTotals.morning}</strong>
                  <div className="text-xs text-gray-600">
                    ({calculatePercentage(
                      departmentTotals.morning,
                      departmentTotals.morning + departmentTotals.afternoon + departmentTotals.night
                    )}%)
                  </div>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded p-2">
                <div className="text-xs text-gray-600">Afternoon</div>
                <div className="text-sm text-gray-900">
                  <strong>{departmentTotals.afternoon}</strong>
                  <div className="text-xs text-gray-600">
                    ({calculatePercentage(
                      departmentTotals.afternoon,
                      departmentTotals.morning + departmentTotals.afternoon + departmentTotals.night
                    )}%)
                  </div>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded p-2">
                <div className="text-xs text-gray-600">Night</div>
                <div className="text-sm text-gray-900">
                  <strong>{departmentTotals.night}</strong>
                  <div className="text-xs text-gray-600">
                    ({calculatePercentage(
                      departmentTotals.night,
                      departmentTotals.morning + departmentTotals.afternoon + departmentTotals.night
                    )}%)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Components for Mobile Cards
function MetricBox({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded p-2 text-center">
      <div className="text-xs text-gray-600 mb-1">{label}</div>
      <div className="text-sm text-gray-900">{value}</div>
    </div>
  );
}

function MobileShiftBox({ label, value, percentage }: { label: string; value: number; percentage: number }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded p-2 text-center">
      <div className="text-xs text-gray-600 mb-1">{label}</div>
      <div className="text-sm text-gray-900">{value}</div>
      <div className="text-xs text-gray-600 mt-1">({percentage.toFixed(2)}%)</div>
    </div>
  );
}