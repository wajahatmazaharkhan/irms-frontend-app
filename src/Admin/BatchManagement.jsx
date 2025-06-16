import CustomNavbar from "./CustomNavbar";
import useTitle from "@/Components/useTitle";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  BatchStats,
  QuickActions,
  BatchModal,
  Filters,
  BatchForm,
  BatchCard,
} from "@/Components/compIndex.js";

import { Loader, AlertCircle } from "lucide-react";
import { formatDate, formatMonth, getStatusFromDates } from "@/lib/batchUtils";

function BatchManagement() {
  useTitle("Batch Management");
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [batchData, setBatchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [availableInterns, setAvailableInterns] = useState([]);
  const [availableHR, setAvailableHR] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [usersLoading, setUsersLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editBatchId, setEditBatchId] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("simple");
  const [formLoading, setFormLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    interns: [],
    hr: [],
  });

  // Fetch batch data from API
  useEffect(() => {
    const fetchBatchData = async () => {
      try {
        setLoading(true);
        const baseUrl = import.meta.env.VITE_BASE_URL;

        const [batchResponse, progressResponse] = await Promise.all([
          axios.get(`${baseUrl}/api/batch/get-summary`),
          axios.get(`${baseUrl}/batches/progress`),
        ]);

        const data = batchResponse.data;
        const progressData = progressResponse.data;

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
			  if (now < s) return "upcoming";  // Changed from "Upcoming" to "upcoming"
			  if (now > e) return "completed"; // Changed from "Completed" to "completed"
			  return "active";                 // Changed from "Ongoing" to "active"
			};

          const batchProgress = progressData.find((p) => p._id === batch._id);
         
          return {
            id: batch._id,
            batchName: batch.name,
            month: formatMonth(batch.startDate),
            startDate: safeDate(batch.startDate),
            endDate: safeDate(batch.endDate),
            totalInterns: batch.totalInterns,
            activeInterns: batch.totalInterns,
            completedInterns: `${batchProgress?.completedTasks ?? 0}/${
              batchProgress?.allTasks ?? 0
            }`,
            totalHR: batch.totalHR,
            status: getStatusFromDates(batch.startDate, batch.endDate),
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
		if (isEditing) {
		  // For edit mode, we'll fetch users in handleEditClick
		  return;
		}
		// For create mode, just fetch available users normally
		fetchAvailableUsers();
	  }
	}, [showCreateForm]);

	const fetchAvailableUsers = async (batchInterns = null) => {
	  try {
		setUsersLoading(true);
		const baseUrl = import.meta.env.VITE_BASE_URL;

		const [allUsersResponse, availUsersResponse] = await Promise.all([
		  axios.get(`${baseUrl}/allusers`),
		  axios.get(`${baseUrl}/available-interns`)
		]);

		const allUsers = allUsersResponse.data?.data ?? allUsersResponse.data ?? [];
		const availableInternsFromAPI = availUsersResponse.data?.data ?? availUsersResponse.data ?? [];

		// Process current batch interns if provided
		let currentBatchInterns = [];
		if (batchInterns) {
		  currentBatchInterns = batchInterns.map(intern => ({
			id: intern._id || intern.id,
			name: intern.name,
			email: intern.email,
			role: intern.role || 'intern'
		  }));
		}

		// Merge current batch interns with available interns (no duplicates)
		const finalAvailableInterns = [
		  ...currentBatchInterns,
		  ...availableInternsFromAPI.filter(
			availIntern => !currentBatchInterns.some(bi => bi.id === availIntern.id)
		  )
		];

		const availableHR = allUsers
		  .filter(user => user.role === "hr")
		  .map(user => {
			const firstName = user.firstName || "";
			const lastName = user.lastName || "";
			const fullName = `${firstName} ${lastName}`.trim();
			
			return {
			  id: user._id,
			  name: user.name || fullName || user.email || "Unknown HR",
			  email: user.email || "",
			  role: user.role
			};
		  });

		setAvailableInterns(finalAvailableInterns);
		setAvailableHR(availableHR);
	  } catch (err) {
		console.error("Error fetching users:", err);
		alert("Failed to load users. Please try again later.");
		setAvailableInterns([]);
		setAvailableHR([]);
	  } finally {
		setUsersLoading(false);
	  }
	};



  const handleView = async (batchId, type = "simple") => {
    try {
      setIsModalOpen(true);
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/batches/${batchId}`);
      const batchData = response.data;
      
      if (type === "deep" && batchData.tasks?.length > 0) {
        const tasksWithDetails = await Promise.all(
          batchData.tasks.map(async (task) => {
            try {
              if (!task.taskId) return task;
              const taskResponse = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/task/get-task/${task.taskId}`,
                { timeout: 3000 }
              );
              return {
                ...task,
                details: taskResponse.data?.taskDetails || null
              };
            } catch (error) {
              console.error(`Error fetching task ${task.taskId}:`, error);
              return task;
            }
          })
        );
        batchData.tasks = tasksWithDetails;
      }
      
      setSelectedBatch(batchData);
      setModalType(type);
    } catch (error) {
      console.error("Failed to fetch batch details:", error);
      if (error.response?.status === 500) {
        alert("Server error occurred while loading batch details");
      } else {
        alert("Failed to load batch details. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBatch = async (batchId, batchName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the batch "${batchName}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeleteLoading(batchId);

    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      await axios.delete(`${baseUrl}/batches/${batchId}`);
      setBatchData((prevBatches) =>
        prevBatches.filter((batch) => batch.id !== batchId)
      );
      alert("Batch deleted successfully!");
    } catch (err) {
      console.error("Error deleting batch:", err);
      alert("Failed to delete batch. Please try again.");
    } finally {
      setDeleteLoading(null);
    }
  };

	const handleEditClick = async (batch) => {
	  try {
		const baseUrl = import.meta.env.VITE_BASE_URL;
		
		// Fetch full batch details
		const res = await axios.get(`${baseUrl}/batches/${batch.id}`);
		const fullBatch = res.data;

		// Set form data first
		setFormData({
		  name: fullBatch.name || "",
		  startDate: fullBatch.startDate?.split("T")[0] || "",
		  endDate: fullBatch.endDate?.split("T")[0] || "",
		  interns: fullBatch.interns?.map(i => i._id || i) || [],
		  hr: fullBatch.hr?.map(h => h.hrId?._id || h.hrId || h._id || h) || [],
		});

		// Fetch users with current batch interns
		await fetchAvailableUsers(fullBatch.interns);

		setIsEditing(true);
		setEditBatchId(fullBatch._id);
		setShowCreateForm(true);
	  } catch (error) {
		console.error("Error loading batch for edit:", error);
		alert("Could not load batch details. Please try again.");
	  }
	};




	// Handle form submission
	const handleCreateBatch = async (e) => {
	  e.preventDefault();

	  // Validation
	  if (!formData.name || !formData.startDate || !formData.endDate) {
		alert("Please fill in all required fields.");
		return;
	  }

	  if (new Date(formData.startDate) >= new Date(formData.endDate)) {
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
		const response = await axios.post(`${baseUrl}/batches`, formData);
		const result = response.data;

		// Reset form and close modal
		setFormData({
		  name: "",
		  startDate: "",
		  endDate: "",
		  interns: [],
		  hr: [],
		});
		setShowCreateForm(false);

		alert("Batch created successfully!");
		window.location.reload();
	  } catch (err) {
		console.error("Error creating batch:", err);
		alert(`Failed to create batch: ${err.response?.data?.message || err.message}`);
	  } finally {
		setFormLoading(false);
	  }
	};

	const handleUpdateBatch = async (e) => {
	  e.preventDefault();
	  setFormLoading(true);

	  try {
		const baseUrl = import.meta.env.VITE_BASE_URL;
		const res = await axios.put(
		  `${baseUrl}/batches/${editBatchId}`,
		  formData
		);
		const data = res.data;

		alert("Batch updated successfully!");
		setShowCreateForm(false);
		setIsEditing(false);
		setEditBatchId(null);
		window.location.reload();
	  } catch (err) {
		alert(err.response?.data?.message || err.message || "Update failed");
		console.error(err);
	  } finally {
		setFormLoading(false);
	  }
	};
	
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMultiSelectChange = (field, value) => {
    const stringValue = String(value);
    setFormData((prev) => {
      const current = prev[field].map(String);
      return {
        ...prev,
        [field]: current.includes(stringValue)
          ? current.filter((item) => item !== stringValue)
          : [...current, stringValue],
      };
    });
  };

  // Get unique months for filter dropdown
  const uniqueMonths = [...new Set(batchData.map((batch) => batch.month))];

	const filteredBatches = batchData.filter((batch) => {
	  const matchesSearch =
		batch.batchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
		batch.coordinator.toLowerCase().includes(searchTerm.toLowerCase());
	  const matchesStatus =
		filterStatus === "all" ||
		batch.status.toLowerCase() === filterStatus.toLowerCase(); // Case-insensitive comparison
	  const matchesMonth =
		selectedMonth === "" || batch.month.includes(selectedMonth);

	  return matchesSearch && matchesStatus && matchesMonth;
	});

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

          <BatchStats batchData={batchData} />
          <QuickActions setShowCreateForm={setShowCreateForm} />
          
          <Filters 
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
      </div>

      {isModalOpen && selectedBatch && (
        <BatchModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          batch={selectedBatch}
          type={modalType}
          loading={loading}
        />
      )}

      {showCreateForm && (
		  <BatchForm
			isOpen={showCreateForm}
			onClose={() => {
			  setShowCreateForm(false);
			  setIsEditing(false);
			  setEditBatchId(null);
			  setFormData({
				name: "",
				startDate: "",
				endDate: "",
				interns: [],
				hr: [],
			  });
			}}
			formData={formData}
			setFormData={setFormData}
			handleInputChange={handleInputChange}
			handleMultiSelectChange={handleMultiSelectChange}
			availableInterns={availableInterns}
			availableHR={availableHR}
			usersLoading={usersLoading}
			isEditing={isEditing}
			editBatchId={editBatchId}
			formLoading={formLoading} // Add this line
			handleCreateBatch={handleCreateBatch} // Add these two lines
			handleUpdateBatch={handleUpdateBatch}
		  />
		)}
    </>
  );
}

export default BatchManagement;