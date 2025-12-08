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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#EA0029]" />
            Export to PDF
          </DialogTitle>
          <DialogDescription>
            Previewing the printable document for{" "}
            <span className="font-semibold text-foreground">
              {monthName}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        {/* PDF Document Preview Mock */}
        <div className="flex-1 bg-gray-100 p-8 rounded-lg overflow-auto border border-gray-200">
          <div className="bg-white shadow-lg mx-auto max-w-[800px] min-h-[600px] p-10 flex flex-col gap-6 text-gray-900 origin-top">
            {/* Document Header */}
            <div className="flex items-center justify-between border-b-2 border-[#EA0029] pb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Staff Schedule
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Generated on {new Date().toLocaleDateString()}
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
            <div className="grid grid-cols-3 gap-4 text-sm bg-gray-50 p-4 rounded border border-gray-100">
              <div>
                <span className="block text-gray-500 text-xs uppercase">
                  Departments
                </span>
                <span className="font-semibold">
                  All Departments
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

            {/* Mock Table Visual */}
            <div className="mt-4">
              <div className="w-full h-8 bg-gray-200 mb-2 rounded-sm" />
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <div className="w-1/4 h-6 bg-gray-100 rounded-sm" />
                  <div className="w-3/4 h-6 bg-gray-50 border border-dashed border-gray-200 rounded-sm" />
                </div>
              ))}
              <div className="text-center text-xs text-gray-400 mt-4 italic">
                ... {data.length - 8} more rows ...
              </div>
            </div>

            {/* Footer */}
            <div className="mt-auto pt-8 border-t border-gray-200 flex justify-between text-xs text-gray-400">
              <span>Confidential Document</span>
              <span>Page 1 of 3</span>
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