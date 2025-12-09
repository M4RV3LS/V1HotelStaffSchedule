import { Bell, FileText, Menu } from 'lucide-react';

interface HeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function Header({ isSidebarOpen, onToggleSidebar }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo Section */}
        <div className="flex items-center gap-4">
          {!isSidebarOpen && (
            <button
              onClick={onToggleSidebar}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#EA0029] rounded flex items-center justify-center text-white">
              R
            </div>
            <div>
              <span className="text-gray-900">Red</span>
              <span className="text-[#EA0029]">Partners</span>
            </div>
          </div>
          
          <div className="h-6 w-px bg-gray-300" />
          
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#EA0029] rounded" />
            <span className="text-[#EA0029]">RedDoorz</span>
          </div>
          
          <div className="text-xs text-gray-500">
            Your Property Rating: <span className="text-gray-900">0.0 / 5</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded relative">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded">
            <FileText className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
}