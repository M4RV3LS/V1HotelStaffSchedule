import { cn } from "./ui/utils";

export function ShiftLegend() {
  // Requirement 4: Specific shift list
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
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm border-t border-gray-200 pt-4 px-4 bg-white">
      <span className="font-bold text-gray-800 mr-2">
        Shift Legend:
      </span>
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-2"
        >
          <div
            className={cn(
              "w-4 h-4 rounded-sm border",
              item.color,
            )}
          />
          <span className="text-gray-700 font-medium">
            {item.label}{" "}
            <span className="text-gray-400 font-normal text-xs ml-0.5">
              ({item.time})
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}