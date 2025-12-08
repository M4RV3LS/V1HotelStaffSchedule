import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ScheduleView } from './components/ScheduleView';
import { HistoryView } from './components/HistoryView';
import { getWeekIndexForDate } from './utils/dateHelpers';

function App() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'history'>('schedule');
  
  // Initialize with today's date and calculate the correct week
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [currentWeekStart, setCurrentWeekStart] = useState(getWeekIndexForDate(today));
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Tab Navigation */}
            <div className="flex gap-4 mb-6 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('schedule')}
                className={`px-4 py-2 transition-colors ${
                  activeTab === 'schedule'
                    ? 'border-b-2 border-[#EA0029] text-[#EA0029]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Schedule View
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 transition-colors ${
                  activeTab === 'history'
                    ? 'border-b-2 border-[#EA0029] text-[#EA0029]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                History
              </button>
            </div>

            {activeTab === 'schedule' ? (
              <ScheduleView
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                currentWeekStart={currentWeekStart}
                setCurrentWeekStart={setCurrentWeekStart}
                isEditMode={isEditMode}
                setIsEditMode={setIsEditMode}
              />
            ) : (
              <HistoryView selectedMonth={selectedMonth} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;