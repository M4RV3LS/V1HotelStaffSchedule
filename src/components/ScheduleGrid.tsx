import { ChevronDown } from 'lucide-react';
import { Fragment } from 'react';
import { isSameDay } from '../utils/dateHelpers';

interface ScheduleEntry {
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

interface ScheduleGridProps {
  weekDates: Date[];
  scheduleData: ScheduleEntry[];
  setScheduleData: (data: ScheduleEntry[]) => void;
  isEditMode: boolean;
  hasActiveFilters: boolean;
  selectedMonth: Date;
}

export function ScheduleGrid({ weekDates, scheduleData, setScheduleData, isEditMode, hasActiveFilters, selectedMonth }: ScheduleGridProps) {
  const today = new Date();
  
  // Check if a date is in the current selected month
  const isDateInMonth = (date: Date) => {
    return date.getMonth() === selectedMonth.getMonth() && 
           date.getFullYear() === selectedMonth.getFullYear();
  };
  
  const attendanceColors = {
    'Present': 'border-green-500 text-green-700 bg-green-50',
    'Absent': 'border-red-500 text-red-700 bg-red-50',
  };

  const shiftColors = {
    'Morning': 'border-yellow-500 text-yellow-700 bg-yellow-50',
    'Afternoon': 'border-orange-500 text-orange-700 bg-orange-50',
    'Night': 'border-purple-500 text-purple-700 bg-purple-50',
    'Evening': 'border-orange-500 text-orange-700 bg-orange-50',
    'All Day': 'border-gray-500 text-gray-700 bg-gray-50',
  };

  const handleAttendanceChange = (staffId: string, date: string, value: string) => {
    setScheduleData(
      scheduleData.map((staff) =>
        staff.id === staffId
          ? {
              ...staff,
              schedule: {
                ...staff.schedule,
                [date]: {
                  ...staff.schedule[date],
                  attendance: value as any,
                },
              },
            }
          : staff
      )
    );
  };

  const handleShiftChange = (staffId: string, date: string, value: string) => {
    setScheduleData(
      scheduleData.map((staff) =>
        staff.id === staffId
          ? {
              ...staff,
              schedule: {
                ...staff.schedule,
                [date]: {
                  ...staff.schedule[date],
                  shift: value as any,
                },
              },
            }
          : staff
      )
    );
  };

  // Group staff by department
  const groupedStaff = scheduleData.reduce((acc, staff) => {
    if (!acc[staff.department]) {
      acc[staff.department] = [];
    }
    acc[staff.department].push(staff);
    return acc;
  }, {} as { [key: string]: ScheduleEntry[] });

  const departments = Object.keys(groupedStaff).sort();

  return (
    <div className="overflow-x-auto">
      {scheduleData.length === 0 && hasActiveFilters ? (
        <div className="py-12 text-center text-gray-500">
          <p>No staff found matching the selected filters</p>
          <p className="text-sm mt-2">Try selecting different departments, designations, or staff names</p>
        </div>
      ) : (
        <>
          {/* Filter summary */}
          {hasActiveFilters && (
            <div className="bg-blue-50 border-b border-blue-200 px-4 py-2 text-sm text-blue-700">
              Showing {scheduleData.length} staff member{scheduleData.length !== 1 ? 's' : ''} matching selected filters
            </div>
          )}
          
          <table className="w-full relative" style={{ tableLayout: 'fixed' }}>
            <thead className="sticky top-[160px] z-20 bg-white shadow-sm">
              <tr className="bg-white border-b border-gray-200">
                <th className="sticky left-0 z-30 bg-white px-4 py-3 text-left text-xs text-gray-600 w-64 border-r-2 border-gray-300">
                  <div>Staff Information</div>
                </th>
                {weekDates.map((date) => {
                  const isToday = isSameDay(date, today);
                  const isInMonth = isDateInMonth(date);
                  
                  return (
                    <th 
                      key={date.toISOString()} 
                      className={`px-2 py-3 text-center text-xs bg-white border-b ${
                        isToday && isInMonth
                          ? 'border-b-[3px] border-b-[#EA0029]'
                          : 'border-b-gray-200'
                      }`}
                      colSpan={2}
                    >
                      <div className={`text-xs ${
                        !isInMonth 
                          ? 'text-gray-400' 
                          : isToday 
                            ? 'text-[#EA0029]'
                            : 'text-gray-900'
                      }`}>
                        <div className={isToday && isInMonth ? 'flex items-center justify-center gap-1' : ''}>
                          {isToday && isInMonth && <span className="w-1.5 h-1.5 rounded-full bg-[#EA0029]"></span>}
                          <span className={isToday && isInMonth ? 'font-bold' : ''}>{date.getDate()}</span>
                        </div>
                      </div>
                      <div className={`text-xs ${
                        !isInMonth 
                          ? 'text-gray-400' 
                          : isToday 
                            ? 'text-[#EA0029] font-bold'
                            : 'text-gray-600'
                      }`}>
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                    </th>
                  );
                })}
              </tr>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="sticky left-0 z-30 bg-gray-50 px-4 py-2 text-left text-xs text-gray-600 border-r-2 border-gray-300">
                  <div className="text-xs">Department / Designation / Name</div>
                </th>
                {weekDates.map((date) => {
                  const isToday = isSameDay(date, today);
                  const isInMonth = isDateInMonth(date);
                  
                  return (
                    <Fragment key={date.toISOString()}>
                      <th className={`px-2 py-2 text-center text-xs min-w-[70px] transition-colors ${
                        !isInMonth
                          ? 'bg-[#F5F5F5] text-gray-400'
                          : isToday 
                            ? 'bg-red-50 text-[#EA0029]' 
                            : 'text-gray-600'
                      }`}>
                        Attendance
                      </th>
                      <th className={`px-2 py-2 text-center text-xs min-w-[70px] transition-colors ${
                        !isInMonth
                          ? 'bg-[#F5F5F5] text-gray-400'
                          : isToday 
                            ? 'bg-red-50 text-[#EA0029]' 
                            : 'text-gray-600'
                      }`}>
                        Shift
                      </th>
                    </Fragment>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {departments.map((department) => (
                <Fragment key={department}>
                  {groupedStaff[department].map((staff, idx) => {
                    const isFirstInGroup = idx === 0;
                    
                    return (
                      <tr 
                        key={staff.id} 
                        className={`border-b border-gray-200 ${
                          isFirstInGroup ? 'border-t-2 border-t-gray-400' : ''
                        } ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                      >
                        <td className={`sticky left-0 z-10 bg-inherit px-4 py-3 text-sm border-r-2 border-gray-300 ${
                          isFirstInGroup ? 'border-t-2 border-t-gray-400' : ''
                        }`}>
                          {isFirstInGroup && (
                            <div className="text-xs text-[#EA0029] mb-2 uppercase tracking-wide">
                              {department}
                            </div>
                          )}
                          <div className="text-gray-900">{staff.staffName}</div>
                          <div className="text-xs text-gray-500">{staff.designation}</div>
                        </td>
                        {weekDates.map((date) => {
                          const dateKey = date.toISOString().split('T')[0];
                          const entry = staff.schedule[dateKey];
                          const isToday = isSameDay(date, today);
                          const isInMonth = isDateInMonth(date);
                          
                          // Ghost cells for dates outside the selected month
                          if (!isInMonth) {
                            return (
                              <Fragment key={dateKey}>
                                <td 
                                  className="px-2 py-3 bg-[#F5F5F5] cursor-default"
                                  style={{
                                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,.03) 10px, rgba(0,0,0,.03) 20px)',
                                  }}
                                >
                                  {/* Completely empty - no content */}
                                </td>
                                <td 
                                  className="px-2 py-3 bg-[#F5F5F5] cursor-default"
                                  style={{
                                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,.03) 10px, rgba(0,0,0,.03) 20px)',
                                  }}
                                >
                                  {/* Completely empty - no content */}
                                </td>
                              </Fragment>
                            );
                          }
                          
                          if (!entry) {
                            return (
                              <Fragment key={dateKey}>
                                <td className={`px-2 py-3 transition-colors ${
                                  isToday ? 'bg-red-50/50' : ''
                                }`} />
                                <td className={`px-2 py-3 transition-colors ${
                                  isToday ? 'bg-red-50/50' : ''
                                }`} />
                              </Fragment>
                            );
                          }

                          return (
                            <Fragment key={dateKey}>
                              <td className={`px-2 py-3 transition-colors ${
                                isToday ? 'bg-red-50/50' : ''
                              }`}>
                                {isEditMode ? (
                                  <div className="relative">
                                    <select
                                      value={entry.attendance}
                                      onChange={(e) => handleAttendanceChange(staff.id, dateKey, e.target.value)}
                                      className={`w-full px-3 py-1.5 pr-8 text-xs rounded border appearance-none cursor-pointer ${attendanceColors[entry.attendance]}`}
                                    >
                                      <option value="Present">Present</option>
                                      <option value="Absent">Absent</option>
                                    </select>
                                    <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                                  </div>
                                ) : (
                                  <div className={`px-3 py-1.5 text-xs rounded border text-center ${attendanceColors[entry.attendance]}`}>
                                    {entry.attendance}
                                  </div>
                                )}
                              </td>
                              <td className={`px-2 py-3 transition-colors ${
                                isToday ? 'bg-red-50/50' : ''
                              }`}>
                                {isEditMode ? (
                                  <div className="relative">
                                    <select
                                      value={entry.shift}
                                      onChange={(e) => handleShiftChange(staff.id, dateKey, e.target.value)}
                                      className={`w-full px-3 py-1.5 pr-8 text-xs rounded border appearance-none cursor-pointer ${shiftColors[entry.shift]}`}
                                    >
                                      <option value="Morning">Morning</option>
                                      <option value="Afternoon">Afternoon</option>
                                      <option value="Evening">Evening</option>
                                      <option value="Night">Night</option>
                                      <option value="All Day">All Day</option>
                                    </select>
                                    <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                                  </div>
                                ) : (
                                  <div className={`px-3 py-1.5 text-xs rounded border text-center ${shiftColors[entry.shift]}`}>
                                    {entry.shift}
                                  </div>
                                )}
                              </td>
                            </Fragment>
                          );
                        })}
                      </tr>
                    );
                  })}
                </Fragment>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}