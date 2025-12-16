import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { ScheduleView } from "./components/ScheduleView";
import { HistoryView } from "./components/HistoryView";
import { ReportView } from "./components/ReportView";
import { getWeekIndexForDate } from "./utils/dateHelpers";
import { useIsMobile } from "./components/ui/use-mobile";

function App() {
  const [activeTab, setActiveTab] = useState<
    "schedule" | "history" | "reports"
  >("schedule");
  const isMobile = useIsMobile();

  // Default sidebar state: closed on mobile, open on desktop
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [currentWeekStart, setCurrentWeekStart] = useState(
    getWeekIndexForDate(today),
  );
  const [isEditMode, setIsEditMode] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-gray-50 w-full overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
      />

      <div className="flex-1 flex flex-col min-w-0 h-full">
        <Header
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={toggleSidebar}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
          <div className="p-4 sm:p-6 pb-24 sm:pb-6">
            {/* Tab Navigation - Scrollable on mobile */}
            <div className="flex overflow-x-auto gap-4 mb-6 border-b border-gray-200 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              <button
                onClick={() => setActiveTab("schedule")}
                className={`px-4 py-2 transition-colors whitespace-nowrap ${
                  activeTab === "schedule"
                    ? "border-b-2 border-[#EA0029] text-[#EA0029]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Schedule View
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`px-4 py-2 transition-colors whitespace-nowrap ${
                  activeTab === "history"
                    ? "border-b-2 border-[#EA0029] text-[#EA0029]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                History
              </button>
              <button
                onClick={() => setActiveTab("reports")}
                className={`px-4 py-2 transition-colors whitespace-nowrap ${
                  activeTab === "reports"
                    ? "border-b-2 border-[#EA0029] text-[#EA0029]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Reports
              </button>
            </div>

            <div className="min-h-[calc(100vh-200px)]">
              {activeTab === "schedule" ? (
                <ScheduleView
                  selectedMonth={selectedMonth}
                  setSelectedMonth={setSelectedMonth}
                  currentWeekStart={currentWeekStart}
                  setCurrentWeekStart={setCurrentWeekStart}
                  isEditMode={isEditMode}
                  setIsEditMode={setIsEditMode}
                />
              ) : activeTab === "history" ? (
                <HistoryView selectedMonth={selectedMonth} />
              ) : (
                <ReportView selectedMonth={selectedMonth} />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;