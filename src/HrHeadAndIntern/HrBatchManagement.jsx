import CustomHrNavbar from "./CustomHrNavbar";
import { Link } from "react-router-dom";
import useTitle from "@/Components/useTitle";
import { useState, useEffect } from "react";
import {BatchCard, BatchDetails, BatchForm} from "@/Components/batchManagement/index.js";
import {getStatusFromDates, calculateProgress, formatDate, formatMonth} from "@/utils/dateUtils.js";

import {
  Users,
  Calendar,
  Plus,
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
  const [isEditing, setIsEditing] = useState(false);
  const [editBatchId, setEditBatchId] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        const response = await fetch(`${baseUrl}/api/batch/get-summary`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const progressResponse = await fetch(`${baseUrl}/batches/progress`);
        const progressData = await progressResponse.json();

        // Transform API data to match component structure
        const transformedData = data.map((batch) => {
          const safeDate = (date) => {
            if (!date) return "";
            const d = new Date(date);
            return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
          };

          const batchProgress = progressData.find(p => p._id === batch._id);

          return {
            id: batch._id,
            batchName: batch.name,
            month: formatMonth(batch.startDate),
            startDate: safeDate(batch.startDate),
            endDate: safeDate(batch.EndDate),
            totalInterns: batch.totalInterns,
            activeInterns: batch.totalInterns, // Assuming all are active for now
            completedInterns: `${batchProgress?.completedTasks ?? 0}/${batchProgress?.allTasks ?? 0}`,
            totalHR: batch.totalHR,
            status: getStatusFromDates(batch.startDate, batch.EndDate),
            coordinator: "TBD", // API doesn't provide this
            technologies: [], // API doesn't provide this
            progress: batchProgress?.progress ?? 0, // fallback to 0 if not found
          };
        });



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



  const handleView = async (batchId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/batches/${batchId}`
      );
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      console.log("Full batch object:", data); // ✅ You can verify what's coming
      setSelectedBatch(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch batch details:", error.message);
      alert("Failed to load batch details.");
    }
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
      const apiData = {
        ...formData,
        EndDate: formData.EndDate,  // Ensure this is included
      };

      const response = await fetch(`${baseUrl}/batches`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });


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

  const handleEditClick = async (batch) => {
    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const res = await fetch(`${baseUrl}/batches/${batch.id}`); // assuming batch has _id
      if (!res.ok) throw new Error("Failed to fetch batch details");

      const fullBatch = await res.json();

      setFormData({
        name: fullBatch.name || "",
        startDate: fullBatch.startDate?.split("T")[0] || "",
        EndDate: fullBatch.EndDate?.split("T")[0] || "",
        interns: fullBatch.interns?.map((i) => i._id || i) || [],
        hr: fullBatch.hr?.map((h) => h._id || h) || [],
      });

      setIsEditing(true);
      setEditBatchId(fullBatch._id);
      setShowCreateForm(true);
    } catch (error) {
      console.error("Error loading batch for edit:", error);
      alert("Could not load batch details. Please try again.");
    }
  };

  const handleUpdateBatch = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const res = await fetch(`${baseUrl}/batches/${editBatchId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Update failed");
      }

      alert("Batch updated successfully!");
      setShowCreateForm(false);
      setIsEditing(false);
      setEditBatchId(null);
    } catch (err) {
      alert(err.message || "Update failed");
      console.error(err);
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
      action: " ",
    },
    {
      title: "Batch Settings",
      description: "Configure batch parameters",
      icon: Settings,
      color: "from-orange-500 to-orange-700",
      action: "settings",
    },
  ];

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
        <CustomHrNavbar />
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
        <CustomHrNavbar />
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
      <CustomHrNavbar />
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
                <BatchCard
                    key={batch.id}
                    batch={batch}
                    handleView={handleView}
                    handleEditClick={handleEditClick}
                    handleDeleteBatch={handleDeleteBatch}
                    deleteLoading={deleteLoading}
                />


            ))}
          </div>
          {isModalOpen && selectedBatch && (
            <BatchDetails setIsModalOpen={setIsModalOpen} selectedBatch={selectedBatch} />
          )}
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
          <BatchForm
              formData={formData}
              availableInterns={availableInterns}
              availableHR={availableHR}
              isEditing={isEditing}
              setShowCreateForm={setShowCreateForm}
              setIsEditing={setIsEditing}
              setEditBatchId={setEditBatchId}
              setFormData={setFormData}
              usersLoading={usersLoading}
              handleUpdateBatch={handleUpdateBatch}
              handleCreateBatch={handleCreateBatch}
              handleInputChange={handleInputChange}
              handleMultiSelectChange={handleMultiSelectChange}
              formLoading={formLoading}
          />

      )}
    </>
  );
}

export default BatchManagement;