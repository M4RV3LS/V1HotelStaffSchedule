import { useState, useRef, useEffect } from "react";
import { Filter, X, Search, ChevronLeft } from "lucide-react";
import { cn } from "./ui/utils";

interface FilterComboboxProps {
  departments: string[];
  designations: string[];
  staffNames: {
    name: string;
    department: string;
    designation: string;
  }[];
  selectedFilters: SelectedFilter[];
  onFilterChange: (filters: SelectedFilter[]) => void;
  className?: string;
}

export interface SelectedFilter {
  type: "department" | "designation" | "name";
  value: string;
  label: string;
}

type FilterCategory = "department" | "designation" | "name" | null;

export function FilterCombobox({
  departments,
  designations,
  staffNames: employeeNames,
  selectedFilters,
  onFilterChange,
  className,
}: FilterComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Determine current category from selected filters
  const currentCategory: FilterCategory = selectedFilters.length > 0 
    ? selectedFilters[0].type 
    : selectedCategory;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedCategory(null);
        setSearchTerm("");
      }
    }
    if (isOpen) {
      document.addEventListener(
        "mousedown",
        handleClickOutside,
      );
      return () =>
        document.removeEventListener(
          "mousedown",
          handleClickOutside,
        );
    }
  }, [isOpen]);

  const toggleFilter = (filter: SelectedFilter) => {
    const exists = selectedFilters.some(
      (f) => f.type === filter.type && f.value === filter.value,
    );
    if (exists) {
      // Remove the filter
      onFilterChange(
        selectedFilters.filter(
          (f) =>
            !(
              f.type === filter.type && f.value === filter.value
            ),
        ),
      );
    } else {
      // Add filter (all filters must be same category)
      onFilterChange([...selectedFilters, filter]);
    }
  };

  const removeFilter = (filter: SelectedFilter) => {
    onFilterChange(
      selectedFilters.filter(
        (f) =>
          !(f.type === filter.type && f.value === filter.value),
      ),
    );
  };

  const clearAll = () => {
    onFilterChange([]);
    setSearchTerm("");
    setSelectedCategory(null);
  };

  const handleCategorySelect = (category: FilterCategory) => {
    setSelectedCategory(category);
    setSearchTerm("");
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSearchTerm("");
  };

  const isSelected = (type: string, value: string) => {
    return selectedFilters.some(
      (f) => f.type === type && f.value === value,
    );
  };

  const filteredDepartments = departments.filter((dept) =>
    dept.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const filteredDesignations = designations.filter((desig) =>
    desig.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const filteredStaffNames = employeeNames.filter(
    (staff) =>
      staff.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const getCategoryLabel = (category: FilterCategory) => {
    if (category === "department") return "Department";
    if (category === "designation") return "Designation";
    if (category === "name") return "Employee Name";
    return "";
  };

  const hasResults =
    (selectedCategory === "department" && filteredDepartments.length > 0) ||
    (selectedCategory === "designation" && filteredDesignations.length > 0) ||
    (selectedCategory === "name" && filteredStaffNames.length > 0);

  return (
    <div
      className={cn("relative", className)}
      ref={dropdownRef}
    >
      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 border rounded cursor-pointer transition-colors w-full min-w-[200px]",
            isOpen
              ? "border-[#EA0029] bg-white ring-1 ring-[#EA0029]/20"
              : "border-gray-300 bg-white hover:border-gray-400",
          )}
        >
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />

          {selectedFilters.length === 0 ? (
            <span className="text-gray-500 text-sm truncate">
              Filter by Category...
            </span>
          ) : (
            <div className="flex-1 flex flex-wrap gap-1 overflow-hidden h-6">
              {selectedFilters
                .slice(0, 2)
                .map((filter, idx) => (
                  <span
                    key={`${filter.type}-${filter.value}-${idx}`}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-700 rounded-full text-[10px] font-medium border border-red-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFilter(filter);
                    }}
                  >
                    {filter.label}
                    <X className="w-2.5 h-2.5 cursor-pointer hover:text-red-900" />
                  </span>
                ))}
              {selectedFilters.length > 2 && (
                <span className="inline-flex items-center px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[10px]">
                  +{selectedFilters.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
        {selectedFilters.length > 0 && !isOpen && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              clearAll();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-[320px] bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-[400px] flex flex-col">
          {/* Show category selection OR value selection */}
          {!currentCategory ? (
            // Category Selection View
            <>
              <div className="p-3 border-b border-gray-200 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-700">
                  Select Filter Category
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Choose one category to filter by
                </p>
              </div>
              <div className="p-2">
                <button
                  onClick={() => handleCategorySelect("department")}
                  className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 rounded text-sm text-gray-700 transition-colors border border-transparent hover:border-gray-200"
                >
                  <span className="font-medium">Department</span>
                  <span className="text-xs text-gray-500">
                    {departments.length} options
                  </span>
                </button>
                <button
                  onClick={() => handleCategorySelect("designation")}
                  className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 rounded text-sm text-gray-700 transition-colors border border-transparent hover:border-gray-200"
                >
                  <span className="font-medium">Designation</span>
                  <span className="text-xs text-gray-500">
                    {designations.length} options
                  </span>
                </button>
                <button
                  onClick={() => handleCategorySelect("name")}
                  className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 rounded text-sm text-gray-700 transition-colors border border-transparent hover:border-gray-200"
                >
                  <span className="font-medium">Employee Name</span>
                  <span className="text-xs text-gray-500">
                    {employeeNames.length} options
                  </span>
                </button>
              </div>
            </>
          ) : (
            // Value Selection View
            <>
              <div className="p-2 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  {selectedFilters.length === 0 && (
                    <button
                      onClick={handleBackToCategories}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                      title="Back to categories"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>
                  )}
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-700">
                      {getCategoryLabel(currentCategory)}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Select multiple values
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#EA0029] focus:border-[#EA0029]"
                    autoFocus
                  />
                </div>
              </div>
              <div className="overflow-y-auto flex-1 p-1">
                {!hasResults ? (
                  <div className="p-4 text-center text-gray-500 text-xs">
                    No results found
                  </div>
                ) : (
                  <>
                    {currentCategory === "department" && filteredDepartments.map((dept) => (
                      <label
                        key={dept}
                        className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 cursor-pointer rounded-sm"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected(
                            "department",
                            dept,
                          )}
                          onChange={() =>
                            toggleFilter({
                              type: "department",
                              value: dept,
                              label: dept,
                            })
                          }
                          className="rounded border-gray-300 text-[#EA0029] focus:ring-[#EA0029]"
                        />
                        <span className="text-sm text-gray-700">
                          {dept}
                        </span>
                      </label>
                    ))}
                    {currentCategory === "designation" && filteredDesignations.map((desig) => (
                      <label
                        key={desig}
                        className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 cursor-pointer rounded-sm"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected(
                            "designation",
                            desig,
                          )}
                          onChange={() =>
                            toggleFilter({
                              type: "designation",
                              value: desig,
                              label: desig,
                            })
                          }
                          className="rounded border-gray-300 text-[#EA0029] focus:ring-[#EA0029]"
                        />
                        <span className="text-sm text-gray-700">
                          {desig}
                        </span>
                      </label>
                    ))}
                    {currentCategory === "name" && filteredStaffNames.map((staff) => (
                      <label
                        key={staff.name}
                        className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 cursor-pointer rounded-sm"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected(
                            "name",
                            staff.name,
                          )}
                          onChange={() =>
                            toggleFilter({
                              type: "name",
                              value: staff.name,
                              label: staff.name,
                            })
                          }
                          className="rounded border-gray-300 text-[#EA0029] focus:ring-[#EA0029]"
                        />
                        <span className="text-sm text-gray-700">
                          {staff.name}
                        </span>
                      </label>
                    ))}
                  </>
                )}
              </div>
              {selectedFilters.length > 0 && (
                <div className="p-2 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                  <span className="text-[10px] text-gray-500">
                    {selectedFilters.length} selected
                  </span>
                  <button
                    onClick={clearAll}
                    className="text-[10px] font-medium text-[#EA0029] hover:underline"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
