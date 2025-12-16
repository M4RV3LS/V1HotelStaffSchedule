import { generateMockHistoryData } from "../utils/historyData";
import { Card, CardContent } from "./ui/card";
import {
  CalendarClock,
  Mail,
  MessageSquare,
} from "lucide-react";

interface HistoryViewProps {
  selectedMonth: Date;
}

export function HistoryView({
  selectedMonth,
}: HistoryViewProps) {
  const historyData = generateMockHistoryData(selectedMonth);
  const monthYearDisplay = selectedMonth.toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    },
  );

  return (
    <div className="pb-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 px-1">
        {monthYearDisplay} Activity Log
      </h2>

      {historyData.length === 0 ? (
        <div className="bg-white rounded border border-gray-200 p-8 text-center text-gray-500">
          No activity logged for this month yet.
        </div>
      ) : (
        <>
          {/* Mobile View: Stacked Cards (Neat & Vertical) */}
          <div className="block sm:hidden space-y-3">
            {historyData.map((entry, index) => (
              <Card
                key={index}
                className="overflow-hidden border border-gray-200 shadow-sm"
              >
                <CardContent className="p-4 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <CalendarClock className="w-3.5 h-3.5" />
                      <span>{entry.updateDate}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="text-xs font-medium text-gray-700 break-all">
                        {entry.email}
                      </span>
                    </div>

                    <div className="flex items-start gap-2 mt-1">
                      <MessageSquare className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-800 leading-snug">
                        {entry.message}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop View: Traditional Table */}
          <div className="hidden sm:block bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-1/4">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-1/5">
                    Update Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {historyData.map((entry, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                      {entry.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {entry.updateDate}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 leading-relaxed">
                      {entry.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}