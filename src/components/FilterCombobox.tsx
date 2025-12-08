import { useState, useRef, useEffect } from 'react';
import { Filter, X, Search } from 'lucide-react';

interface FilterComboboxProps {
  departments: string[];
  designations: string[];
  staffNames: { name: string; department: string; designation: string }[];
  selectedFilters: SelectedFilter[];
  onFilterChange: (filters: SelectedFilter[]) => void;
}

export interface SelectedFilter {
  type: 'department' | 'designation' | 'name';
  value: string;
  label: string;
}

export function FilterCombobox({
  departments,
  designations,
  staffNames,
  selectedFilters,
  onFilterChange,
}: FilterComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const toggleFilter = (filter: SelectedFilter) => {
    const exists = selectedFilters.some(
      (f) => f.type === filter.type && f.value === filter.value
    );

    if (exists) {
      onFilterChange(
        selectedFilters.filter((f) => !(f.type === filter.type && f.value === filter.value))
      );
    } else {
      onFilterChange([...selectedFilters, filter]);
    }
  };

  const removeFilter = (filter: SelectedFilter) => {
    onFilterChange(
      selectedFilters.filter((f) => !(f.type === filter.type && f.value === filter.value))
    );
  };

  const clearAll = () => {
    onFilterChange([]);
    setSearchTerm('');
  };

  const isSelected = (type: string, value: string) => {
    return selectedFilters.some((f) => f.type === type && f.value === value);
  };

  // Filter items based on search term
  const filteredDepartments = departments.filter((dept) =>
    dept.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDesignations = designations.filter((desig) =>
    desig.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStaffNames = staffNames.filter((staff) =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hasResults = filteredDepartments.length > 0 || filteredDesignations.length > 0 || filteredStaffNames.length > 0;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main Input Field */}
      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-4 py-2 border-2 rounded cursor-pointer transition-colors min-w-[400px] ${
            isOpen ? 'border-[#EA0029] bg-white' : 'border-gray-300 bg-white hover:border-gray-400'
          }`}
        >
          <Filter className="w-4 h-4 text-gray-400" />
          
          {selectedFilters.length === 0 ? (
            <span className="text-gray-500 text-sm">Filter by Dept, Role, or Name...</span>
          ) : (
            <div className="flex-1 flex flex-wrap gap-1">
              {selectedFilters.slice(0, 3).map((filter, idx) => (
                <span
                  key={`${filter.type}-${filter.value}-${idx}`}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFilter(filter);
                  }}
                >
                  {filter.label}
                  <X className="w-3 h-3 cursor-pointer hover:text-red-600" />
                </span>
              ))}
              {selectedFilters.length > 3 && (
                <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                  +{selectedFilters.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Clear All Button (when filters are active) */}
        {selectedFilters.length > 0 && !isOpen && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              clearAll();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-[400px] flex flex-col">
          {/* Search Input Inside Dropdown */}
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#EA0029] focus:border-transparent"
                autoFocus
              />
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto flex-1">
            {!hasResults ? (
              <div className="p-6 text-center text-gray-500 text-sm">
                No results found for &quot;{searchTerm}&quot;
              </div>
            ) : (
              <>
                {/* DEPARTMENTS Section */}
                {filteredDepartments.length > 0 && (
                  <div>
                    <div className="sticky top-0 bg-gray-100 px-4 py-2 text-xs uppercase tracking-wide text-gray-600 z-10">
                      Departments
                    </div>
                    <div className="px-2 py-1">
                      {filteredDepartments.map((dept) => (
                        <label
                          key={dept}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer rounded"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected('department', dept)}
                            onChange={() =>
                              toggleFilter({ type: 'department', value: dept, label: dept })
                            }
                            className="w-4 h-4 text-[#EA0029] border-gray-300 rounded focus:ring-[#EA0029]"
                          />
                          <span className="text-sm text-gray-900">{dept}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* DESIGNATIONS Section */}
                {filteredDesignations.length > 0 && (
                  <div>
                    <div className="sticky top-0 bg-gray-100 px-4 py-2 text-xs uppercase tracking-wide text-gray-600 z-10">
                      Designations
                    </div>
                    <div className="px-2 py-1">
                      {filteredDesignations.map((desig) => (
                        <label
                          key={desig}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer rounded"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected('designation', desig)}
                            onChange={() =>
                              toggleFilter({ type: 'designation', value: desig, label: desig })
                            }
                            className="w-4 h-4 text-[#EA0029] border-gray-300 rounded focus:ring-[#EA0029]"
                          />
                          <span className="text-sm text-gray-900">{desig}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* STAFF NAMES Section */}
                {filteredStaffNames.length > 0 && (
                  <div>
                    <div className="sticky top-0 bg-gray-100 px-4 py-2 text-xs uppercase tracking-wide text-gray-600 z-10">
                      Staff Names
                    </div>
                    <div className="px-2 py-1">
                      {filteredStaffNames.map((staff) => (
                        <label
                          key={staff.name}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer rounded"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected('name', staff.name)}
                            onChange={() =>
                              toggleFilter({ type: 'name', value: staff.name, label: staff.name })
                            }
                            className="w-4 h-4 text-[#EA0029] border-gray-300 rounded focus:ring-[#EA0029]"
                          />
                          <div className="flex-1">
                            <div className="text-sm text-gray-900">{staff.name}</div>
                            <div className="text-xs text-gray-500">
                              {staff.designation} • {staff.department}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Actions */}
          {selectedFilters.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
              <span className="text-xs text-gray-600">
                {selectedFilters.length} filter{selectedFilters.length !== 1 ? 's' : ''} active
              </span>
              <button
                onClick={clearAll}
                className="text-xs text-[#EA0029] hover:text-[#c40023] hover:underline"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
