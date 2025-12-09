import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { FileText, Printer, Check } from "lucide-react";
import { ScheduleEntry } from "../utils/scheduleData";
import { CellContent } from "./ScheduleGrid";
import { Fragment, useMemo } from "react";
import { cn } from "./ui/utils";

interface ExportPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: ScheduleEntry[];
  month: Date;
  onConfirm: () => void;
}

export function ExportPreviewDialog({
  open,
  onOpenChange,
  data,
  month,
  onConfirm,
}: ExportPreviewDialogProps) {
  const monthName = month.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Requirement 1: Generate all dates for the entire month
  const monthDates = useMemo(() => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const daysInMonth = new Date(
      year,
      monthIndex + 1,
      0,
    ).getDate();
    return Array.from(
      { length: daysInMonth },
      (_, i) => new Date(year, monthIndex, i + 1),
    );
  }, [month]);

  const groupedStaff = data.reduce(
    (acc, staff) => {
      if (!acc[staff.department]) acc[staff.department] = [];
      acc[staff.department].push(staff);
      return acc;
    },
    {} as { [key: string]: ScheduleEntry[] },
  );

  const departments = Object.keys(groupedStaff).sort();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-full max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#EA0029]" />
            Export to PDF
          </DialogTitle>
          <DialogDescription>
            Previewing the printable document for{" "}
            <span className="font-semibold text-foreground">
              {monthName} (Full Month)
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        {/* PDF Document Preview Area */}
        <div className="flex-1 bg-gray-100 p-8 rounded-lg overflow-hidden border border-gray-200 flex flex-col">
          <div className="bg-white shadow-lg mx-auto w-full h-full flex flex-col text-gray-900 origin-top overflow-hidden">
            <div className="p-8 pb-4 shrink-0">
              {/* Document Header */}
              <div className="flex items-center justify-between border-b-2 border-[#EA0029] pb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Staff Schedule
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Generated on{" "}
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-[#EA0029]">
                    RedPartners
                  </div>
                  <div className="text-sm text-gray-500">
                    {monthName}
                  </div>
                </div>
              </div>

              {/* Document Stats */}
              <div className="grid grid-cols-3 gap-4 text-sm bg-gray-50 p-4 rounded border border-gray-100 mt-6">
                <div>
                  <span className="block text-gray-500 text-xs uppercase">
                    Departments
                  </span>
                  <span className="font-semibold">
                    {departments.length} Active
                  </span>
                </div>
                <div>
                  <span className="block text-gray-500 text-xs uppercase">
                    Total Staff
                  </span>
                  <span className="font-semibold">
                    {data.length} Employees
                  </span>
                </div>
                <div>
                  <span className="block text-gray-500 text-xs uppercase">
                    Status
                  </span>
                  <span className="font-semibold text-green-600 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Finalized
                  </span>
                </div>
              </div>
            </div>

            {/* REAL TABLE VISUAL - Scrollable for Full Month */}
            <div className="flex-1 overflow-auto px-8 pb-8">
              <div className="border border-gray-200 rounded min-w-max">
                <table className="w-full border-collapse text-xs table-fixed">
                  <thead className="bg-gray-100 border-b border-gray-200 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-2 text-left w-48 font-bold text-gray-600 border-r border-gray-200 bg-gray-100 sticky left-0 z-20">
                        Staff
                      </th>
                      {monthDates.map((date) => (
                        <th
                          key={date.toISOString()}
                          className="px-1 py-2 text-center border-r border-gray-200 font-semibold text-gray-600 w-20 min-w-[80px]"
                        >
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-gray-400">
                              {date.toLocaleDateString(
                                "en-US",
                                { weekday: "short" },
                              )}
                            </span>
                            <span>{date.getDate()}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map((department) => (
                      <Fragment key={department}>
                        {groupedStaff[department].map(
                          (staff, idx) => (
                            <tr
                              key={staff.id}
                              className="border-b border-gray-100 last:border-0"
                            >
                              <td className="px-4 py-2 border-r border-gray-200 align-top bg-white sticky left-0 z-10">
                                {idx === 0 && (
                                  <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                                    {department}
                                  </div>
                                )}
                                <div className="font-bold whitespace-nowrap">
                                  {staff.staffName}
                                </div>
                                <div className="text-[10px] text-gray-500">
                                  {staff.designation}
                                </div>
                              </td>
                              {monthDates.map((date) => {
                                const dateKey = date
                                  .toISOString()
                                  .split("T")[0];
                                const entry =
                                  staff.schedule[dateKey];

                                return (
                                  <td
                                    key={dateKey}
                                    className="p-1 border-r border-gray-200 align-top h-16 bg-white"
                                  >
                                    {entry ? (
                                      <CellContent
                                        attendance={
                                          entry.attendance
                                        }
                                        shifts={entry.shifts}
                                        isEditMode={false}
                                      />
                                    ) : null}
                                  </td>
                                );
                              })}
                            </tr>
                          ),
                        )}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-auto px-8 py-4 border-t border-gray-200 flex justify-between text-xs text-gray-400 shrink-0">
              <span>Confidential Document</span>
              <span>Page 1 of 1</span>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-[#EA0029] hover:bg-[#c40023] text-white gap-2"
          >
            <Printer className="w-4 h-4" />
            Print / Save PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}