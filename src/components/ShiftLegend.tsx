export function ShiftLegend() {
  return (
    <div className="flex items-center gap-4 text-xs">
      <span className="text-gray-600">Shift Legend:</span>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <span className="text-gray-700">Morning</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
        <span className="text-gray-700">Afternoon</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full bg-orange-600"></div>
        <span className="text-gray-700">Evening</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
        <span className="text-gray-700">Night</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full bg-gray-500"></div>
        <span className="text-gray-700">All Day</span>
      </div>
    </div>
  );
}
