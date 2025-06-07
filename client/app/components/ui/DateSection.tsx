import React from "react";
import { Calendar, Clock } from "lucide-react";

interface DateSectionProps {
  selectedMonth: string;
  selectedDate: string;
  expandedMonth: string | null;
  handleMonthClick: (month: string) => void;
  setSelectedDate: (date: string) => void;
  months: string[];
  monthDates: Record<string, string[]>;
}

const DateSection: React.FC<DateSectionProps> = ({
  selectedMonth,
  selectedDate,
  expandedMonth,
  handleMonthClick,
  setSelectedDate,
  months,
  monthDates,
}) => {
  return (
    <div className="bg-white shadow-md border-b mt-1 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Month Selection */}
        <div className="flex items-center gap-4 py-2 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-700 font-medium">
            <Calendar className="text-emerald-600 w-5 h-5" />
            <span className="text-sm">Select Month:</span>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {months.map((month) => (
              <button
                key={month}
                onClick={() => handleMonthClick(month)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  selectedMonth === month
                    ? "bg-emerald-600 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102"
                }`}
              >
                {month}
              </button>
            ))}
          </div>
        </div>

        {/* Date Selection */}
        {expandedMonth && (
          <div className="flex items-center gap-4 py-2 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2 text-gray-700 font-medium">
              <Clock className="text-emerald-600 w-5 h-5" />
              <span className="text-sm">Available Dates:</span>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0">
              {monthDates[expandedMonth].map((date) => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    selectedDate === date
                      ? "bg-emerald-500 text-white shadow-md scale-105 ring-2 ring-emerald-200"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:scale-102"
                  }`}
                >
                  {date}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DateSection;
