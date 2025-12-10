import { useState, useMemo } from 'react';
import { Calendar, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { FilterCombobox, SelectedFilter } from './FilterCombobox';
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
  const [startDate, setStartDate] = useState<Date>(
    new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1)
  );
  const [endDate, setEndDate] = useState<Date>(
    new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0)
  );
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilter[]>([]);

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
      night: 0,
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
      totals.night += emp.shifts.night;
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
      night: 0,
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
      totals.night += dept.shifts.night;
      totals.resolvedNotExtended += dept.issueStats.resolvedNotExtended;
      totals.resolvedExtended += dept.issueStats.resolvedExtended;
      totals.partiallyResolved += dept.issueStats.partiallyResolved;
      totals.inProgress += dept.issueStats.inProgress;
      totals.open += dept.issueStats.open;
    });

    return totals;
  }, [departmentReports]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

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
            {formatDate(startDate)} - {formatDate(endDate)}
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {/* Date Range Picker */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded bg-white w-full sm:w-auto">
              <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="date"
                value={startDate.toISOString().split('T')[0]}
                onChange={(e) => setStartDate(new Date(e.target.value))}
                className="text-sm border-none outline-none bg-transparent w-full"
              />
            </div>
            <span className="text-gray-400 text-center sm:text-left">to</span>
            <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded bg-white w-full sm:w-auto">
              <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="date"
                value={endDate.toISOString().split('T')[0]}
                onChange={(e) => setEndDate(new Date(e.target.value))}
                className="text-sm border-none outline-none bg-transparent w-full"
              />
            </div>
          </div>

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
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-gray-300">
            <th rowSpan={2} className="text-left py-2 px-4 text-sm text-gray-600 border-r border-gray-200">
              Employee Name
            </th>
            <th rowSpan={2} className="text-left py-2 px-4 text-sm text-gray-600 border-r border-gray-200">
              Department
            </th>
            <th colSpan={2} className="text-center py-2 px-4 text-sm text-gray-600 border-r border-gray-200 border-b border-gray-200">
              Attendance
            </th>
            <th colSpan={3} className="text-center py-2 px-4 text-sm text-gray-600 border-b border-gray-200">
              Shifts
            </th>
          </tr>
          <tr className="border-b border-gray-200">
            <th className="text-center py-2 px-3 text-xs text-gray-600 bg-green-50">Present</th>
            <th className="text-center py-2 px-3 text-xs text-gray-600 bg-red-50 border-r border-gray-200">Absent</th>
            <th className="text-center py-2 px-3 text-xs text-gray-600 bg-gray-50">Morning</th>
            <th className="text-center py-2 px-3 text-xs text-gray-600 bg-gray-50">Afternoon</th>
            <th className="text-center py-2 px-3 text-xs text-gray-600 bg-gray-50">Night</th>
          </tr>
        </thead>
        <tbody>
          {employeeReports.map((emp, idx) => {
            const totalIssues = emp.issueStats.resolvedNotExtended + emp.issueStats.resolvedExtended + 
              emp.issueStats.partiallyResolved + emp.issueStats.inProgress + emp.issueStats.open;
            
            return (
              <tr
                key={emp.staffName}
                className={`border-b border-gray-100 ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <td className="py-3 px-4 text-sm text-gray-900 border-r border-gray-100">{emp.staffName}</td>
                <td className="py-3 px-4 text-sm text-gray-600 border-r border-gray-100">{emp.department}</td>
                <td className="py-3 px-3 text-sm text-center text-green-600">{emp.totalPresent}</td>
                <td className="py-3 px-3 text-sm text-center text-red-600 border-r border-gray-100">{emp.totalAbsent}</td>
                <td className="py-3 px-3 text-sm text-center text-gray-700">{emp.shifts.morning}</td>
                <td className="py-3 px-3 text-sm text-center text-gray-700">{emp.shifts.afternoon}</td>
                <td className="py-3 px-3 text-sm text-center text-gray-700">{emp.shifts.night}</td>
              </tr>
            );
          })}
          
          {/* Totals Row */}
          {employeeTotals && (
            <tr className="bg-gray-100 border-t-2 border-[#EA0029]">
              <td colSpan={2} className="py-3 px-4 text-sm text-gray-900 border-r border-gray-200">
                <strong>TOTAL</strong>
              </td>
              <td className="py-3 px-3 text-sm text-center text-green-700">
                <strong>{employeeTotals.totalPresent}</strong>
                <span className="text-xs text-gray-600 ml-1">
                  ({calculatePercentage(
                    employeeTotals.totalPresent,
                    employeeTotals.totalPresent + employeeTotals.totalAbsent
                  )}%)
                </span>
              </td>
              <td className="py-3 px-3 text-sm text-center text-red-700 border-r border-gray-200">
                <strong>{employeeTotals.totalAbsent}</strong>
                <span className="text-xs text-gray-600 ml-1">
                  ({calculatePercentage(
                    employeeTotals.totalAbsent,
                    employeeTotals.totalPresent + employeeTotals.totalAbsent
                  )}%)
                </span>
              </td>
              <td className="py-3 px-3 text-sm text-center text-gray-900">
                <strong>{employeeTotals.morning}</strong>
                <span className="text-xs text-gray-600 ml-1">
                  ({calculatePercentage(
                    employeeTotals.morning,
                    employeeTotals.morning + employeeTotals.afternoon + employeeTotals.night
                  )}%)
                </span>
              </td>
              <td className="py-3 px-3 text-sm text-center text-gray-900">
                <strong>{employeeTotals.afternoon}</strong>
                <span className="text-xs text-gray-600 ml-1">
                  ({calculatePercentage(
                    employeeTotals.afternoon,
                    employeeTotals.morning + employeeTotals.afternoon + employeeTotals.night
                  )}%)
                </span>
              </td>
              <td className="py-3 px-3 text-sm text-center text-gray-900">
                <strong>{employeeTotals.night}</strong>
                <span className="text-xs text-gray-600 ml-1">
                  ({calculatePercentage(
                    employeeTotals.night,
                    employeeTotals.morning + employeeTotals.afternoon + employeeTotals.night
                  )}%)
                </span>
              </td>
            </tr>
          )}

          {employeeReports.length === 0 && (
            <tr>
              <td colSpan={12} className="py-12 text-center text-gray-500 text-sm">
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
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-gray-300">
            <th rowSpan={2} className="text-left py-3 px-4 text-sm text-gray-600 border-r border-gray-200">
              Department
            </th>
            <th colSpan={2} className="text-center py-2 px-4 text-sm text-gray-600 border-r border-gray-200 border-b border-gray-200">
              Attendance
            </th>
            <th colSpan={3} className="text-center py-2 px-4 text-sm text-gray-600 border-b border-gray-200">
              Shifts
            </th>
          </tr>
          <tr className="border-b border-gray-200">
            <th className="text-center py-2 px-3 text-xs text-gray-600 bg-green-50">Present</th>
            <th className="text-center py-2 px-3 text-xs text-gray-600 bg-red-50 border-r border-gray-200">Absent</th>
            <th className="text-center py-2 px-3 text-xs text-gray-600 bg-gray-50">Morning</th>
            <th className="text-center py-2 px-3 text-xs text-gray-600 bg-gray-50">Afternoon</th>
            <th className="text-center py-2 px-3 text-xs text-gray-600 bg-gray-50">Night</th>
          </tr>
        </thead>
        <tbody>
          {departmentReports.map((dept, idx) => {
            const totalIssues = dept.issueStats.resolvedNotExtended + dept.issueStats.resolvedExtended + 
              dept.issueStats.partiallyResolved + dept.issueStats.inProgress + dept.issueStats.open;
            
            return (
              <tr
                key={dept.department}
                className={`border-b border-gray-100 ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <td className="py-3 px-4 text-sm text-gray-900 border-r border-gray-100">{dept.department}</td>
                <td className="py-3 px-3 text-sm text-center text-green-600">{dept.totalPresent}</td>
                <td className="py-3 px-3 text-sm text-center text-red-600 border-r border-gray-100">{dept.totalAbsent}</td>
                <td className="py-3 px-3 text-sm text-center text-gray-700">{dept.shifts.morning}</td>
                <td className="py-3 px-3 text-sm text-center text-gray-700">{dept.shifts.afternoon}</td>
                <td className="py-3 px-3 text-sm text-center text-gray-700">{dept.shifts.night}</td>
              </tr>
            );
          })}
          
          {/* Totals Row */}
          {departmentTotals && (
            <tr className="bg-gray-100 border-t-2 border-[#EA0029]">
              <td className="py-3 px-4 text-sm text-gray-900 border-r border-gray-200">
                <strong>TOTAL</strong>
              </td>
              <td className="py-3 px-3 text-sm text-center text-green-700">
                <strong>{departmentTotals.totalPresent}</strong>
                <span className="text-xs text-gray-600 ml-1">
                  ({calculatePercentage(
                    departmentTotals.totalPresent,
                    departmentTotals.totalPresent + departmentTotals.totalAbsent
                  )}%)
                </span>
              </td>
              <td className="py-3 px-3 text-sm text-center text-red-700 border-r border-gray-200">
                <strong>{departmentTotals.totalAbsent}</strong>
                <span className="text-xs text-gray-600 ml-1">
                  ({calculatePercentage(
                    departmentTotals.totalAbsent,
                    departmentTotals.totalPresent + departmentTotals.totalAbsent
                  )}%)
                </span>
              </td>
              <td className="py-3 px-3 text-sm text-center text-gray-900">
                <strong>{departmentTotals.morning}</strong>
                <span className="text-xs text-gray-600 ml-1">
                  ({calculatePercentage(
                    departmentTotals.morning,
                    departmentTotals.morning + departmentTotals.afternoon + departmentTotals.night
                  )}%)
                </span>
              </td>
              <td className="py-3 px-3 text-sm text-center text-gray-900">
                <strong>{departmentTotals.afternoon}</strong>
                <span className="text-xs text-gray-600 ml-1">
                  ({calculatePercentage(
                    departmentTotals.afternoon,
                    departmentTotals.morning + departmentTotals.afternoon + departmentTotals.night
                  )}%)
                </span>
              </td>
              <td className="py-3 px-3 text-sm text-center text-gray-900">
                <strong>{departmentTotals.night}</strong>
                <span className="text-xs text-gray-600 ml-1">
                  ({calculatePercentage(
                    departmentTotals.night,
                    departmentTotals.morning + departmentTotals.afternoon + departmentTotals.night
                  )}%)
                </span>
              </td>
            </tr>
          )}

          {departmentReports.length === 0 && (
            <tr>
              <td colSpan={11} className="py-12 text-center text-gray-500 text-sm">
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
        const totalIssues = emp.issueStats.resolvedNotExtended + emp.issueStats.resolvedExtended + 
          emp.issueStats.partiallyResolved + emp.issueStats.inProgress + emp.issueStats.open;
        const isExpanded = expandedIndex === idx;

        return (
          <div key={emp.staffName} className="border border-gray-200 rounded-lg bg-white">
            {/* Card Header */}
            <div 
              className="p-4 cursor-pointer"
              onClick={() => setExpandedIndex(isExpanded ? null : idx)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-sm text-gray-900">{emp.staffName}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{emp.department}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs text-gray-500">Present/Absent</span>
                    <div className="flex gap-2 mt-0.5">
                      <span className="text-sm text-green-600">{emp.totalPresent}</span>
                      <span className="text-gray-300">/</span>
                      <span className="text-sm text-red-600">{emp.totalAbsent}</span>
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
                    <MetricBox label="Morning" value={emp.shifts.morning} color="gray" />
                    <MetricBox label="Afternoon" value={emp.shifts.afternoon} color="gray" />
                    <MetricBox label="Night" value={emp.shifts.night} color="gray" />
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