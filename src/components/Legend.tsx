export function Legend() {
  return (
    <div className="bg-gray-50 rounded border border-gray-200 p-4">
      <div className="text-xs text-gray-600 mb-3">Shift Types:</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-xs text-gray-700">Morning (6:00 - 14:00)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500" />
          <span className="text-xs text-gray-700">Afternoon (14:00 - 22:00)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <span className="text-xs text-gray-700">Night (22:00 - 6:00)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-500" />
          <span className="text-xs text-gray-700">All Day (Full Shift)</span>
        </div>
      </div>
    </div>
  );
}
