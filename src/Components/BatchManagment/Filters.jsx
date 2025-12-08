import { Search, Filter, Calendar, Download } from "lucide-react";

export function Filters({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  selectedMonth,
  setSelectedMonth,
  uniqueMonths,
}) {
  return (
    <div className="bg-white rounded-nonexl shadow-md p-6 mb-8 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search batches..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-nonelg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-nonelg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="upcoming">Upcoming</option>
          </select>
        </div>

        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-nonelg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">All Months</option>
            {uniqueMonths.map((month, index) => (
              <option key={index} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <button className="bg-blue-600 text-white px-6 py-2 rounded-nonelg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2">
          <Download className="w-4 h-4" />
          Export Data
        </button>
      </div>
    </div>
  );
}