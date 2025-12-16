import { cn } from "./ui/utils";

export function ShiftLegend() {
  const items = [
    {
      color: "bg-yellow-400 border-yellow-500",
      label: "Morning",
      time: "06:00 - 14:00",
    },
    {
      color: "bg-teal-400 border-teal-500",
      label: "Middle",
      time: "10:00 - 18:00",
    },
    {
      color: "bg-orange-400 border-orange-500",
      label: "Afternoon",
      time: "14:00 - 22:00",
    },
    {
      color: "bg-indigo-400 border-indigo-500",
      label: "Night",
      time: "22:00 - 06:00",
    },
    {
      color: "bg-purple-400 border-purple-500",
      label: "All Day",
      time: "Full Shift",
    },
    {
      color: "bg-red-500 border-red-600",
      label: "Off Duty",
      time: "Absent",
    },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-y-3 sm:gap-y-4 sm:gap-x-8 text-sm border-t border-gray-200 pt-5 px-6 bg-white pb-6 sm:pb-2">
      <span className="font-bold text-gray-900 mr-2 text-base mb-1 sm:mb-0">
        Shift Legend:
      </span>
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-3"
        >
          <div
            className={cn(
              "w-5 h-5 rounded-sm border shadow-sm shrink-0",
              item.color,
            )}
          />
          <span className="text-gray-700 font-medium text-sm">
            {item.label}{" "}
            <span className="text-gray-400 font-normal text-xs ml-1">
              ({item.time})
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}