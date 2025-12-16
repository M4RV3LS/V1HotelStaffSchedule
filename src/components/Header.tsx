import { Bell, FileText, Menu } from "lucide-react";
import { useIsMobile } from "./ui/use-mobile";

interface HeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function Header({
  isSidebarOpen,
  onToggleSidebar,
}: HeaderProps) {
  const isMobile = useIsMobile();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Logo Section */}
        <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
          {/* Always show hamburger on mobile, or if sidebar is closed on desktop */}
          {(isMobile || !isSidebarOpen) && (
            <button
              onClick={onToggleSidebar}
              className="p-2 hover:bg-gray-100 rounded transition-colors shrink-0"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          )}

          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-[#EA0029] rounded flex items-center justify-center text-white font-bold">
              R
            </div>
            <div className="hidden sm:block">
              <span className="text-gray-900">Red</span>
              <span className="text-[#EA0029]">Partners</span>
            </div>
          </div>

          <div className="h-6 w-px bg-gray-300 hidden sm:block" />

          <div className="flex items-center gap-2 hidden md:flex">
            <div className="w-6 h-6 bg-[#EA0029] rounded" />
            <span className="text-[#EA0029] text-sm">
              RedDoorz
            </span>
          </div>

          <div className="text-xs text-gray-500 hidden lg:block whitespace-nowrap">
            Your Property Rating:{" "}
            <span className="text-gray-900">0.0 / 5</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button className="p-2 hover:bg-gray-100 rounded relative transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded transition-colors">
            <FileText className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
}