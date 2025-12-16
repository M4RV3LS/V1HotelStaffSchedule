import {
  BarChart3,
  Home,
  PieChart,
  BookOpen,
  FileText,
  Star,
  ShoppingCart,
  Users,
  Calendar,
  DollarSign,
  CreditCard,
  BarChart,
  CheckSquare,
  Package,
  Settings,
  Bell,
  Shield,
  FileCheck,
  LogOut,
  RotateCcw,
  X,
} from "lucide-react";
import { useIsMobile } from "./ui/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { cn } from "./ui/utils";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const isMobile = useIsMobile();

  // Mobile View: Uses a Sheet (Drawer)
  if (isMobile) {
    return (
      <Sheet
        open={isOpen}
        onOpenChange={(open) => !open && onToggle()}
      >
        <SheetContent side="left" className="p-0 w-80">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>
          <SidebarContent onToggle={onToggle} isMobile={true} />
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop View: Persistent Sidebar
  if (!isOpen) return null;

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full shrink-0">
      <SidebarContent onToggle={onToggle} isMobile={false} />
    </div>
  );
}

interface SidebarContentProps {
  onToggle: () => void;
  isMobile: boolean;
}

function SidebarContent({
  onToggle,
  isMobile,
}: SidebarContentProps) {
  const menuItems = [
    { icon: BarChart3, label: "Summary Report", active: false },
    { icon: Home, label: "Room Chart", active: false },
    { icon: PieChart, label: "Non Room Chart", active: false },
    { icon: BookOpen, label: "Booking List", active: false },
    { icon: FileText, label: "Order List", active: false },
    { icon: Star, label: "Review & Ratings", active: false },
    {
      icon: ShoppingCart,
      label: "Create Order",
      active: false,
    },
    { icon: Users, label: "Walk In", active: false },
    {
      icon: Package,
      label: "Corp/Gov Bookings",
      active: false,
    },
    { icon: Calendar, label: "Availability", active: false },
    {
      icon: Calendar,
      label: "Employee Schedule",
      active: true,
    },
    { icon: DollarSign, label: "Price Control", active: false },
    { icon: BarChart, label: "Reports", active: false },
    { icon: CheckSquare, label: "Training", active: false },
    { icon: FileText, label: "Deal List", active: false },
    { icon: CreditCard, label: "Payment", active: false },
    { icon: CreditCard, label: "Rate Card", active: false },
    { icon: CheckSquare, label: "Housekeeping", active: false },
    { icon: Settings, label: "Settings", active: false },
    { icon: Bell, label: "Notifications", active: false },
    { icon: Shield, label: "Hygiene Pass", active: false },
    {
      icon: FileCheck,
      label: "Terms & Conditions",
      active: false,
    },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* User Welcome */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#EA0029] rounded flex items-center justify-center text-white shrink-0">
              R
            </div>
            <div className="min-w-0">
              <div className="text-xs text-gray-500 truncate">
                Welcome,
              </div>
              <div className="text-sm font-medium truncate">
                User Name
              </div>
            </div>
          </div>
          {/* Only show close button on desktop, Sheet handles close on mobile via swipe/overlay */}
          {!isMobile && (
            <button
              onClick={onToggle}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-2 scrollbar-thin">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
              item.active
                ? "bg-[#EA0029] text-white"
                : "text-gray-600 hover:bg-gray-50",
            )}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Language Selector */}
      <div className="p-4 border-t border-gray-200">
        <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-white">
          <option>Language (English)</option>
        </select>
      </div>

      {/* Bottom Actions */}
      <div className="border-t border-gray-200 pb-safe">
        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50">
          <LogOut className="w-4 h-4 shrink-0" />
          Log Out
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50">
          <RotateCcw className="w-4 h-4 shrink-0" />
          Reset Password
        </button>
      </div>
    </div>
  );
}