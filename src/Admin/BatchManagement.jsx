import CustomNavbar from "./CustomNavbar";
import { Link } from "react-router-dom";
import useTitle from "@/Components/useTitle";
import { useState, useEffect } from "react";
import {
  Users,
  Calendar,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Download,
  Filter,
  Search,
  CalendarDays,
  Clock,
  UserCheck,
  BookOpen,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Calendar as CalendarIcon,
  FileText,
  Settings,
  Loader,
  X,
  Save,
} from "lucide-react";

function BatchManagement() {
  useTitle("Batch Management");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [batchData, setBatchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [availableInterns, setAvailableInterns] = useState([]);
  const [availableHR, setAvailableHR] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [usersLoading, setUsersLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    EndDate: "",
    interns: [],
    hr: [],
  });

  // Fetch batch data from API
  useEffect(() => {
    const fetchBatchData = async () => {
      try {
        setLoading(true);
        const baseUrl = import.meta.env.VITE_BASE_URL;
        const response = await fetch(`${baseUrl}/batches/summary`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Transform API data to match component structure
        const transformedData = data.map((batch) => ({
          id: batch._id,
          batchName: batch.name,
          month: formatMonth(batch.startDate),
          startDate: formatDate(batch.startDate),
          endDate: formatDate(batch.EndDate),
          totalInterns: batch.totalInterns,
          activeInterns: batch.totalInterns, // Assuming all are active for now
          completedInterns: 0, // API doesn't provide this, set to 0
          totalHR: batch.totalHR,
          status: getStatusFromDates(batch.startDate, batch.EndDate),
          coordinator: "TBD", // API doesn't provide this
          technologies: [], // API doesn't provide this
          progress: calculateProgress(batch.startDate, batch.EndDate),
        }));

        setBatchData(transformedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching batch data:", err);
        setError("Failed to load batch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBatchData();
  }, []);

  // Fetch available interns and HR when form opens
  useEffect(() => {
    if (showCreateForm) {
      fetchAvailableUsers();
    }
  }, [showCreateForm]);

  const fetchAvailableUsers = async () => {
    try {
      setUsersLoading(true);
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const response = await fetch(`${baseUrl}/allusers`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // console.log("Raw API response:", data); // Debug log

      // Handle different response structures
      let allUsers;
      if (Array.isArray(data)) {
        allUsers = data;
      } else if (data.users && Array.isArray(data.users)) {
        allUsers = data.users;
      } else if (data.data && Array.isArray(data.data)) {
        allUsers = data.data;
      } else {
        console.error("Unexpected API response structure:", data);
        throw new Error("Invalid response format: expected an array of users");
      }

      // console.log("Processed users array:", allUsers); // Debug log

      // Validate that allUsers is an array
      if (!Array.isArray(allUsers)) {
        throw new Error("Users data is not an array");
      }

      // Filter users based on their roles
      const interns = allUsers
        .filter((user) => {
          // Ensure user object has required properties
          if (!user || typeof user !== "object") {
            console.warn("Invalid user object:", user);
            return false;
          }

          // console.log(
          //   "Checking user role:",
          //   user.role,
          //   "for user:",
          //   user.email
          // ); // Debug log
          return user.role === "intern";
        })
        .map((user) => ({
          id: user._id,
          name:
            user.name ||
            `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
            user.email ||
            "Unknown User",
          email: user.email || "",
          role: user.role,
        }));

      const hrPersonnel = allUsers
        .filter((user) => {
          // Ensure user object has required properties
          if (!user || typeof user !== "object") {
            console.warn("Invalid user object:", user);
            return false;
          }

          return user.role === "hr";
        })
        .map((user) => ({
          id: user._id,
          name:
            user.name ||
            `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
            user.email ||
            "Unknown User",
          email: user.email || "",
          role: user.role,
        }));

      // console.log("Filtered interns:", interns); // Debug log
      // console.log("Filtered HR personnel:", hrPersonnel); // Debug log

      setAvailableInterns(interns);
      setAvailableHR(hrPersonnel);
    } catch (err) {
      console.error("Error fetching users:", err);

      // Provide more specific error messages
      let errorMessage = "Failed to load users. ";
      if (err.message.includes("Invalid response format")) {
        errorMessage +=
          "The server response format is unexpected. Please check the API endpoint.";
      } else if (err.message.includes("Users data is not an array")) {
        errorMessage +=
          "The user data format is invalid. Please contact support.";
      } else {
        errorMessage += "Please try again later.";
      }

      alert(errorMessage);

      // Keep arrays empty to show proper empty state
      setAvailableInterns([]);
      setAvailableHR([]);
    } finally {
      setUsersLoading(false);
    }
  };

  // Helper functions
  const formatDate = (dateString) => {
    return new Date(dateString).toISOString().split("T")[0];
  };

  const formatMonth = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString("en-US", {
      month: "long",
    })} ${date.getFullYear()}`;
  };

  const getStatusFromDates = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return "Upcoming";
    } else if (now > end) {
      return "Completed";
    } else {
      return "Active";
    }
  };

  const calculateProgress = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return 0;
    if (now > end) return 100;

    const totalDuration = end - start;
    const elapsed = now - start;
    return Math.round((elapsed / totalDuration) * 100);
  };

  // Handle delete batch
  const handleDeleteBatch = async (batchId, batchName) => {
    // Confirm deletion
    const confirmed = window.confirm(
      `Are you sure you want to delete the batch "${batchName}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeleteLoading(batchId);

    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const response = await fetch(`${baseUrl}/batches/${batchId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Remove the deleted batch from local state
      setBatchData((prevBatches) =>
        prevBatches.filter((batch) => batch.id !== batchId)
      );

      // Show success message
      alert("Batch deleted successfully!");
    } catch (err) {
      console.error("Error deleting batch:", err);
      alert("Failed to delete batch. Please try again.");
    } finally {
      setDeleteLoading(null);
    }
  };

  // Handle form submission
  const handleCreateBatch = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.startDate || !formData.EndDate) {
      alert("Please fill in all required fields.");
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.EndDate)) {
      alert("End date must be after start date.");
      return;
    }

    if (formData.interns.length === 0) {
      alert("Please select at least one intern.");
      return;
    }

    if (formData.hr.length === 0) {
      alert("Please select at least one HR personnel.");
      return;
    }

    setFormLoading(true);

    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const response = await fetch(`${baseUrl}/batches`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();

      // Reset form and close modal
      setFormData({
        name: "",
        startDate: "",
        EndDate: "",
        interns: [],
        hr: [],
      });
      setShowCreateForm(false);

      // Show success message
      alert("Batch created successfully!");

      // Refresh batch data
      window.location.reload();
    } catch (err) {
      console.error("Error creating batch:", err);
      alert(`Failed to create batch: ${err.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle multi-select changes
  const handleMultiSelectChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  // Calculate dashboard stats from fetched data
  const dashboardStats = [
    {
      icon: Users,
      label: "Total Batches",
      value: batchData.length.toString(),
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      icon: CalendarDays,
      label: "Active Sessions",
      value: batchData
        .filter((batch) => batch.status === "Active")
        .length.toString(),
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      icon: UserCheck,
      label: "Total Interns",
      value: batchData
        .reduce((sum, batch) => sum + batch.totalInterns, 0)
        .toString(),
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      icon: TrendingUp,
      label: "Total HR",
      value: batchData
        .reduce((sum, batch) => sum + batch.totalHR, 0)
        .toString(),
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
  ];

  const quickActions = [
    {
      title: "Create New Batch",
      description: "Start a new intern batch session",
      icon: Plus,
      color: "from-blue-500 to-blue-700",
      action: "create",
      onClick: () => setShowCreateForm(true),
    },
    {
      title: "Schedule Sessions",
      description: "Plan upcoming batch sessions",
      icon: CalendarIcon,
      color: "from-green-500 to-green-700",
      action: "schedule",
    },
    {
      title: "Export Reports",
      description: "Download batch performance reports",
      icon: Download,
      color: "from-purple-500 to-purple-700",
      action: "export",
    },
    {
      title: "Batch Settings",
      description: "Configure batch parameters",
      icon: Settings,
      color: "from-orange-500 to-orange-700",
      action: "settings",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Upcoming":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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

  const filteredBatches = batchData.filter((batch) => {
    const matchesSearch =
      batch.batchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.coordinator.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      batch.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesMonth =
      selectedMonth === "" || batch.month.includes(selectedMonth);

    return matchesSearch && matchesStatus && matchesMonth;
  });

  // Get unique months for filter dropdown
  const uniqueMonths = [...new Set(batchData.map((batch) => batch.month))];

  if (loading) {
    return (
      <>
        <CustomNavbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Loading batches...
            </h3>
            <p className="text-gray-500">Please wait while we fetch the data</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <CustomNavbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Error Loading Data
            </h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto p-6">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Batch Management
            </h1>
            <p className="text-gray-600 text-lg">
              Manage month-wise intern sessions and track batch performance
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dashboardStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className={`bg-white rounded-xl shadow-md p-6 border ${stat.borderColor} hover:shadow-lg transition-shadow duration-300`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {stat.label}
                      </p>
                      <p className={`text-2xl font-bold ${stat.color}`}>
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <IconComponent className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`bg-gradient-to-br ${action.color} rounded-xl shadow-lg p-6 text-white hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-left`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <IconComponent className="w-8 h-8" />
                    <div className="w-2 h-2 bg-white rounded-full opacity-70"></div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                  <p className="text-sm opacity-90">{action.description}</p>
                </button>
              );
            })}
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search batches..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
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

              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Export Data
              </button>
            </div>
          </div>

          {/* Batch Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredBatches.map((batch) => (
              <div
                key={batch.id}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {batch.batchName}
                    </h3>
                    <div
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        batch.status
                      )}`}
                    >
                      {getStatusIcon(batch.status)}
                      {batch.status}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteBatch(batch.id, batch.batchName)
                      }
                      disabled={deleteLoading === batch.id}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {deleteLoading === batch.id ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {batch.startDate} to {batch.endDate}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    {batch.totalInterns} Total Interns
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <UserCheck className="w-4 h-4" />
                    {batch.totalHR} HR Personnel
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4" />
                    {batch.completedInterns} Completed
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      Progress
                    </span>
                    <span className="text-sm font-medium text-gray-800">
                      {batch.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${batch.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Month:</span> {batch.month}
                  </p>
                  {batch.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {batch.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium">
                    View Details
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium">
                    Manage Interns
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredBatches.length === 0 && !loading && (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No batches found
              </h3>
              <p className="text-gray-500">
                {batchData.length === 0
                  ? "No batch data available. Create your first batch to get started."
                  : "Try adjusting your search or filter criteria"}
              </p>
            </div>
          )}
        </div>

        {/* Create Batch Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Create New Batch
                  </h2>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {usersLoading ? (
                  <div className="text-center py-8">
                    <Loader className="w-8 h-8 text-blue-600 mx-auto mb-4 animate-spin" />
                    <p className="text-gray-600">Loading users...</p>
                  </div>
                ) : (
                  <form onSubmit={handleCreateBatch} className="space-y-6">
                    {/* Batch Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Batch Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g., Web Dev Internship Batch 2025"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Start Date *
                        </label>
                        <input
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          End Date *
                        </label>
                        <input
                          type="date"
                          name="EndDate"
                          value={formData.EndDate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    {/* Interns Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Interns *
                      </label>
                      {availableInterns.length === 0 ? (
                        <div className="border border-gray-300 rounded-lg p-4 text-center text-gray-500">
                          No interns available. Make sure users with "intern"
                          role exist in the system.
                        </div>
                      ) : (
                        <div className="border border-gray-300 rounded-lg p-4 max-h-40 overflow-y-auto">
                          {availableInterns.map((intern) => (
                            <div
                              key={intern.id}
                              className="flex items-center mb-2"
                            >
                              <input
                                type="checkbox"
                                id={`intern-${intern.id}`}
                                checked={formData.interns.includes(intern.id)}
                                onChange={() =>
                                  handleMultiSelectChange("interns", intern.id)
                                }
                                className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label
                                htmlFor={`intern-${intern.id}`}
                                className="text-sm text-gray-700 flex-1"
                              >
                                <span className="font-medium">
                                  {intern.name}
                                </span>
                                <span className="text-gray-500 ml-2">
                                  ({intern.email})
                                </span>
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded ml-2">
                                  {intern.role}
                                </span>
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Selected: {formData.interns.length} intern(s)
                      </p>
                    </div>

                    {/* HR Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select HR Personnel *
                      </label>
                      {availableHR.length === 0 ? (
                        <div className="border border-gray-300 rounded-lg p-4 text-center text-gray-500">
                          No HR personnel available. Make sure users with "hr"
                          role exist in the system.
                        </div>
                      ) : (
                        <div className="border border-gray-300 rounded-lg p-4 max-h-40 overflow-y-auto">
                          {availableHR.map((hr) => (
                            <div key={hr.id} className="flex items-center mb-2">
                              <input
                                type="checkbox"
                                id={`hr-${hr.id}`}
                                checked={formData.hr.includes(hr.id)}
                                onChange={() =>
                                  handleMultiSelectChange("hr", hr.id)
                                }
                                className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label
                                htmlFor={`hr-${hr.id}`}
                                className="text-sm text-gray-700 flex-1"
                              >
                                <span className="font-medium">{hr.name}</span>
                                <span className="text-gray-500 ml-2">
                                  ({hr.email})
                                </span>
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded ml-2">
                                  {hr.role}
                                </span>
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Selected: {formData.hr.length} HR personnel
                      </p>
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowCreateForm(false)}
                        className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={
                          formLoading ||
                          availableInterns.length === 0 ||
                          availableHR.length === 0
                        }
                        className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {formLoading ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        {formLoading ? "Creating..." : "Create Batch"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default BatchManagement;
