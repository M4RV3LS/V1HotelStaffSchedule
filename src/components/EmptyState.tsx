import { Calendar, Plus, Loader2, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  month: string;
  onCreateSchedule: () => void;
  isCreating: boolean;
  isAllowed: boolean;
}

export function EmptyState({ month, onCreateSchedule, isCreating, isAllowed }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6">
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
        isAllowed ? 'bg-gray-100' : 'bg-orange-50'
      }`}>
        {isAllowed ? (
          <Calendar className="w-10 h-10 text-gray-400" />
        ) : (
          <AlertCircle className="w-10 h-10 text-orange-500" />
        )}
      </div>
      
      <h2 className="text-xl text-gray-900 mb-2">
        {isAllowed ? `No Schedule Created for ${month}` : `Schedule Not Available for ${month}`}
      </h2>
      
      <p className="text-sm text-gray-500 mb-8 text-center max-w-md">
        {isAllowed 
          ? 'Create a new schedule to start managing staff attendance and shifts for this month. The system auto-generates schedules on the 1st of each month if not already created.'
          : 'You can only create and view schedules up to next month. Schedules for months beyond next month will be auto-generated on the 1st of each month.'
        }
      </p>
      
      {isAllowed && (
        <>
          <button
            onClick={onCreateSchedule}
            className="px-6 py-3 bg-[#EA0029] text-white rounded hover:bg-[#c40023] flex items-center gap-2 transition-colors"
            disabled={isCreating}
          >
            {isCreating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Schedule...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Create Schedule
              </>
            )}
          </button>
          
          {isCreating && (
            <p className="text-sm text-gray-500 mt-4">
              Loading default shifts from RedPartner configurations...
            </p>
          )}
        </>
      )}
    </div>
  );
}