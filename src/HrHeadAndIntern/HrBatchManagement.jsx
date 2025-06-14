import CustomHrNavbar from "./CustomHrNavbar";
import useTitle from "@/Components/useTitle";
import {useState, useEffect} from "react";
import {BatchCard, BatchDetails, BatchFilterSearch, BatchForm} from "@/Components/compIndex.js"
import { getStatusFromDates, formatDate, formatMonth } from "@/lib/dateUtils";
import {batchService} from "@/services/batchService.js";

import {
    Users,
    Plus,
    Download,
    CalendarDays,
    UserCheck,
    TrendingUp,
    AlertCircle,
    Calendar as CalendarIcon,
    Settings,
    Loader,
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

    useEffect(() => {
        const fetchBatchData = async () => {
            try {
                setLoading(true);
                const data = await batchService.fetchBatchData();
                const progressData = await batchService.fetchBatchProgress();

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
                        activeInterns: batch.totalInterns,
                        completedInterns: `${batchProgress?.completedTasks ?? 0}/${batchProgress?.allTasks ?? 0}`,
                        totalHR: batch.totalHR,
                        status: getStatusFromDates(batch.startDate, batch.EndDate),
                        coordinator: "TBD",
                        technologies: [],
                        progress: batchProgress?.progress ?? 0,
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
            const data = await batchService.fetchAvailableUsers();

            let allUsers;
            if (Array.isArray(data)) {
                allUsers = data;
            } else if (data.users && Array.isArray(data.users)) {
                allUsers = data.users;
            } else if (data.data && Array.isArray(data.data)) {
                allUsers = data.data;
            } else {
                throw new Error("Invalid response format: expected an array of users");
            }

            if (!Array.isArray(allUsers)) {
                throw new Error("Users data is not an array");
            }

            const interns = allUsers
                .filter(user => user && typeof user === 'object' && user.role === 'intern')
                .map(user => ({
                    id: user._id,
                    name: user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email || "Unknown User",
                    email: user.email || "",
                    role: user.role,
                }));

            const hrPersonnel = allUsers
                .filter(user => user && typeof user === 'object' && user.role === 'hr')
                .map(user => ({
                    id: user._id,
                    name: user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email || "Unknown User",
                    email: user.email || "",
                    role: user.role,
                }));

            setAvailableInterns(interns);
            setAvailableHR(hrPersonnel);
        } catch (err) {
            console.error("Error fetching users:", err);
            alert(`Failed to load users: ${err.message}`);
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
        const confirmed = window.confirm(
            `Are you sure you want to delete the batch "${batchName}"? This action cannot be undone.`
        );

        if (!confirmed) return;

        setDeleteLoading(batchId);
        try {
            const response = await batchService.deleteBatch(batchId);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setBatchData((prevBatches) => prevBatches.filter((batch) => batch.id !== batchId));
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

        if (!formData.name || !formData.startDate || !formData.EndDate) {
            alert("Please fill in all required fields.");
            return;
        }

        if (new Date(formData.startDate) >= new Date(formData.EndDate)) {
            alert("End date must be after start date.");
            return;
        }

        if (formData.interns.length === 0 || formData.hr.length === 0) {
            alert("Please select at least one intern and one HR personnel.");
            return;
        }

        setFormLoading(true);
        try {
            const response = await batchService.createBatch(formData);
            const result = await response.json();

            setFormData({
                name: "",
                startDate: "",
                EndDate: "",
                interns: [],
                hr: [],
            });
            setShowCreateForm(false);
            alert("Batch created successfully!");
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
            const response = await batchService.updateBatch(editBatchId, formData);
            const data = await response.json();

            if (!response.ok) {
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
        const {name, value} = e.target;
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
                <CustomHrNavbar/>
                <div
                    className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                    <div className="text-center">
                        <Loader className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin"/>
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
                <CustomHrNavbar/>
                <div
                    className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                    <div className="text-center">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4"/>
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
            <CustomHrNavbar/>
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
                                            <IconComponent className={`w-6 h-6 ${stat.color}`}/>
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
                                        <IconComponent className="w-8 h-8"/>
                                        <div className="w-2 h-2 bg-white rounded-full opacity-70"></div>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                                    <p className="text-sm opacity-90">{action.description}</p>
                                </button>
                            );
                        })}
                    </div>

                    {/* Filters and Search */}
                    <BatchFilterSearch
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        filterStatus={filterStatus}
                        setFilterStatus={setFilterStatus}
                        selectedMonth={selectedMonth}
                        setSelectedMonth={setSelectedMonth}
                        uniqueMonths={uniqueMonths}
                    />

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
                        <BatchDetails setIsModalOpen={setIsModalOpen} selectedBatch={selectedBatch}/>
                    )}
                </div>

                {filteredBatches.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4"/>
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