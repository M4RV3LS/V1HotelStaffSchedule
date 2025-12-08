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
      color: "bg-slate-400 border-slate-500",
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
    <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-sm border-t border-gray-200 pt-5 px-6 bg-white pb-2">
      <span className="font-bold text-gray-900 mr-2 text-base">
        Shift Legend:
      </span>
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-3"
        >
          <div
            className={cn(
              "w-5 h-5 rounded-sm border shadow-sm",
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