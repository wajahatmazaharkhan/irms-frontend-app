import CustomNavbar from "./CustomHrNavbar"; 
import { Link } from "react-router-dom";
import useTitle from "@/Components/useTitle";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Users,
  CalendarDays,
  Clock,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Loader,
  FileText,
  Search,
  Filter,
} from "lucide-react";

function BatchPage() {
  useTitle("My Batches");

  const [batchData, setBatchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [hrUserId, setHrUserId] = useState(null);

  // Retrieve HR user ID from localStorage
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setHrUserId(userId);
    } else {
      setError("HR user ID not found in localStorage.");
      setLoading(false);
    }
  }, []);

  // Fetch batches assigned to the HR user
  useEffect(() => {
    const fetchBatchData = async () => {
      if (!hrUserId) return;

      try {
        setLoading(true);
        const baseUrl = import.meta.env.VITE_BASE_URL;

        // Fetch batches where the HR user is assigned
        const response = await axios.get(`${baseUrl}/api/batch/get-by-hr/${hrUserId}`);
        const data = response.data;

        // Transform API data to match component structure
        const transformedData = data.map((batch) => {
          const safeDate = (date) => {
            if (!date) return "";
            const d = new Date(date);
            return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
          };

          const formatMonth = (date) => {
            if (!date) return "";
            const d = new Date(date);
            return isNaN(d.getTime())
              ? ""
              : d.toLocaleString("default", { month: "long", year: "numeric" });
          };

          const getStatusFromDates = (start, end) => {
            const now = new Date();
            const s = new Date(start);
            const e = new Date(end);
            if (isNaN(s.getTime()) || isNaN(e.getTime())) return "Invalid";
            if (now < s) return "Upcoming";
            if (now > e) return "Completed";
            return "Active";
          };

          return {
            id: batch._id,
            batchName: batch.name,
            month: formatMonth(batch.startDate),
            startDate: safeDate(batch.startDate),
            endDate: safeDate(batch.endDate),
            totalInterns: batch.totalManagedInterns, 
            totalHR: batch.totalHR,  
            status: getStatusFromDates(batch.startDate, batch.endDate),
          };
        });

        setBatchData(transformedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching batch data:", err);
        setError("Failed to load your batches. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBatchData();
  }, [hrUserId]);

  // Status color and icon helpers
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800";
      case "Completed":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800";
      case "Upcoming":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="w-4 h-4" />;
      case "Completed":
        return <BookOpen className="w-4 h-4" />;
      case "Upcoming":
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Filter batches based on search and status
  const filteredBatches = batchData.filter((batch) => {
    const matchesSearch = batch.batchName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      batch.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <>
        <CustomNavbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-12 h-12 text-blue-600 dark:text-blue-300 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
              Loading your batches...
            </h3>
            <p className="text-gray-500 dark:text-gray-400">Please wait while we fetch the data</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <CustomNavbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 dark:text-red-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
              Error Loading Data
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-2 rounded-nonelg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <CustomNavbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto p-6">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              My Batches
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              View and manage attendance for your assigned batches
            </p>
          </div>

          {/* Filters and Search */}
          <div className="bg-white dark:bg-gray-900 rounded-nonexl shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-1/3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by batch name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-nonelg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                />
              </div>
              <div className="relative w-full md:w-auto">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-400 w-5 h-5" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-nonelg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                >
                  <option value="all">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Upcoming">Upcoming</option>
                </select>
              </div>
            </div>
          </div>

          {/* Batch Table */}
          <div className="bg-white dark:bg-gray-900 rounded-nonexl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Batch Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Month
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Interns
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      HR
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredBatches.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                      >
                        No batches assigned to you.
                      </td>
                    </tr>
                  ) : (
                    filteredBatches.map((batch) => (
                      <tr key={batch.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {batch.batchName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {batch.month}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-nonefull text-xs font-medium border ${getStatusColor(
                              batch.status
                            )}`}
                          >
                            {getStatusIcon(batch.status)}
                            <span className="ml-1">{batch.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {batch.totalInterns}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {batch.totalHR}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link
                            to={`/hrattendance/${batch.id}`}
                            className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 flex items-center gap-2"
                            title="Manage Attendance"
                          >
                            <FileText className="w-5 h-5" />
                            Attendance
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BatchPage;