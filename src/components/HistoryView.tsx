import { generateMockHistoryData } from '../utils/historyData';

interface HistoryViewProps {
  selectedMonth: Date;
}

export function HistoryView({ selectedMonth }: HistoryViewProps) {
  const historyData = generateMockHistoryData(selectedMonth);
  const monthYearDisplay = selectedMonth.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div>
      <h2 className="text-xl text-gray-900 mb-6">
        {monthYearDisplay} Schedule Activity Log
      </h2>

      <div className="bg-white rounded border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-sm text-gray-600">Email</th>
              <th className="px-6 py-3 text-left text-sm text-gray-600">Update Date</th>
              <th className="px-6 py-3 text-left text-sm text-gray-600">Message</th>
            </tr>
          </thead>
          <tbody>
            {historyData.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                  No activity logged for this month yet.
                </td>
              </tr>
            ) : (
              historyData.map((entry, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-200 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="px-6 py-4 text-sm text-gray-700">{entry.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{entry.updateDate}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{entry.message}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
