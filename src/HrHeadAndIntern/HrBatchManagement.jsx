import CustomNavbar from "./CustomHrNavbar";
import useTitle from "@/Components/useTitle";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Loader, AlertCircle, Check, X } from "lucide-react";
import {
  BatchStats,
  QuickActions,
  BatchModal,
  Filters,
  BatchForm,
  BatchCard,
} from "@/Components/compIndex.js";

import { formatDate, formatMonth, getStatusFromDates } from "@/lib/batchUtils";
import { batchService } from "@/services/batchService.js";
import { getMatchingBatchedByUserId } from "@/lib/batchUtils";
import { toast } from "react-hot-toast";

function HRBatchManagement() {
  useTitle("My Batches");
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
  const [viewLoading, setViewLoading] = useState(null);
  const [editLoading, setEditLoading] = useState(null);
  const [joinRequests, setJoinRequests] = useState([]);
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRequestsPanel, setShowRequestsPanel] = useState(false);
  const [requestsLoading, setRequestsLoading] = useState(false);

  const handleApproveInterns = async (batchId, internIds) => {
    try {
      setIsProcessing(true);
      const baseUrl = import.meta.env.VITE_BASE_URL;

      // First get the current batch data
      const response = await axios.get(`${baseUrl}/batches/${batchId}`);
      const currentBatch = response.data;

      // Prepare updated batch data
      const updatedBatch = {
        name: currentBatch.name,
        startDate: currentBatch.startDate,
        endDate: currentBatch.endDate,
        hr: currentBatch.hr.map((h) => h.hrId?._id || h.hrId || h._id || h),
        interns: [
          ...currentBatch.interns.map(i => i._id || i),
          ...internIds
        ]
      };

      // Update the batch
      await axios.put(`${baseUrl}/batches/${batchId}`, updatedBatch);

      return true;
    } catch (err) {
      console.error("Error updating batch with new interns:", err);
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    interns: [],
    hr: [],
  });
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchBatchData = async () => {
      try {
        setLoading(true);
        let data = await batchService.fetchBatchData();
        const progressData = await batchService.fetchBatchProgress();
        const filteredIds = await getMatchingBatchedByUserId({ userId: userId });
        const filteredBatches = data.filter((batch) =>
          filteredIds.includes(batch._id)
        );
        data = filteredBatches;

        const transformedData = data.map((batch) => {
          const safeDate = (date) => {
            if (!date) return "";
            const d = new Date(date);
            return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
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
            completedInterns: `${batchProgress?.completedTasks ?? 0}/${batchProgress?.allTasks ?? 0
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
  }, [userId]);

  useEffect(() => {
    if (showCreateForm) {
      fetchAvailableUsers();
    }
  }, [showCreateForm]);

  const fetchJoinRequests = async () => {
    try {
      setRequestsLoading(true);
      setShowRequestsPanel(true); // Show panel immediately when starting to load
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const requests = [];

      for (const batch of batchData) {
        try {
          const response = await axios.get(`${baseUrl}/api/batch/batch-requests/${batch.id}`);
          if (response.data?.data?.length > 0) {
            requests.push(...response.data.data.map(req => ({
              ...req,
              batchId: batch.id,
              batchName: batch.batchName
            })));
          }
        } catch (err) {
          console.error(`Error fetching requests for batch ${batch.id}:`, err);
        }
      }

      setJoinRequests(requests);
    } catch (err) {
      console.error("Error fetching join requests:", err);
      alert("Failed to load join requests. Please try again.");
    } finally {
      setRequestsLoading(false);
    }
  };


  const handleRequestSelection = (userId) => {
    setSelectedRequests(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRequests.length === joinRequests.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(joinRequests.map(req => req._id));
    }
  };

  const processRequests = async (action) => {
    if (selectedRequests.length === 0) {
      alert(`Please select at least one request to ${action}`);
      return;
    }

    setIsProcessing(true);
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const results = [];

    for (const userId of selectedRequests) {
      try {
        const request = joinRequests.find(req => req._id === userId);
        if (!request) continue;

        if (action === 'approve') {
          // First approve the user's batch request
          await axios.patch(`${baseUrl}/api/batch/approve-batch/${userId}`, {
            batchId: request.unapprovedBatch
          });

          // Then update the batch with the new intern
          const success = await handleApproveInterns(
            request.unapprovedBatch,
            [userId]
          );

          results.push({ userId, success });
        } else {
          await axios.patch(`${baseUrl}/api/batch/reject-batch/${userId}`);
          results.push({ userId, success: true });
        }
      } catch (err) {
        console.error(`Error ${action}ing request for user ${userId}:`, err);
        results.push({ userId, success: false });
      }
    }

    setIsProcessing(false);
    const successCount = results.filter(r => r.success).length;
    if (successCount > 0) {
      alert(`Successfully processed ${successCount} ${action} requests`);
      fetchJoinRequests(); // Refresh the list
      fetchBatchData(); // Refresh batch data
    } else {
      alert(`Failed to process ${action} requests`);
    }
    setSelectedRequests([]);
  };

  const fetchAvailableUsers = async () => {
    try {
      setUsersLoading(true);
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const response = await axios.get(`${baseUrl}/allusers`);
      const data = response.data;
      const availUsersResponse = await axios.get(`${baseUrl}/available-interns`);

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

      const interns = availUsersResponse.data.data;
      const currentUserId = userId;
      const hrPersonnel = allUsers
        .filter((user) => user.role === "hr" && user._id === currentUserId)
        .map((user) => ({
          id: user._id,
          name: user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email || "Unknown User",
          email: user.email || "",
          role: user.role,
        }));

      setAvailableInterns(interns);
      setAvailableHR(hrPersonnel);
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
      setViewLoading(batchId);
      setIsModalOpen(true);
      setModalType(type);

      const response = await batchService.getBatchById(batchId);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const batchData = await response.json();

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
    } catch (error) {
      console.error("Failed to fetch batch details:", error);
      alert("Failed to load batch details. Please try again.");
    } finally {
      setViewLoading(null);
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
    } catch (err) {
      console.error("Error deleting batch:", err);
      alert("Failed to delete batch. Please try again.");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEditClick = async (batch) => {
    try {
      setEditLoading(batch.id);
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const res = await axios.get(`${baseUrl}/batches/${batch.id}`);
      const fullBatch = res.data;

      setFormData({
        name: fullBatch.name || "",
        startDate: fullBatch.startDate?.split("T")[0] || "",
        endDate: fullBatch.endDate?.split("T")[0] || "",
        interns: fullBatch.interns?.map((i) => i._id || i) || [],
        hr: fullBatch.hr?.map((h) => h.hrId?._id || h.hrId || h._id || h) || [],
      });

      setIsEditing(true);
      setEditBatchId(fullBatch._id);
      setShowCreateForm(true);
    } catch (error) {
      console.error("Error loading batch for edit:", error);
      alert("Could not load batch details. Please try again.");
    } finally {
      setEditLoading(null);
    }
  };

  const handleCreateBatch = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.startDate || !formData.endDate) {
      alert("Please fill in all required fields.");
      return;
    }

    setFormLoading(true);

    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const response = await axios.post(`${baseUrl}/batches`, formData);
      setFormLoading(false);
      toast.success("Batch Created Successfully");
      const newBatch = response.data;
      setFormLoading(true);

      // Transform the new batch data to match the expected format
      const transformedBatch = {
        id: newBatch._id,
        batchName: newBatch.name,
        month: formatMonth(newBatch.startDate),
        startDate: newBatch.startDate?.split("T")[0] || "",
        endDate: newBatch.endDate?.split("T")[0] || "",
        totalInterns: newBatch.interns?.length || 0,
        activeInterns: newBatch.interns?.length || 0,
        completedInterns: "0/0", // Default value
        totalHR: newBatch.hr?.length || 0,
        status: getStatusFromDates(newBatch.startDate, newBatch.endDate),
        coordinator: "TBD",
        technologies: [],
        progress: 0,
      };

      setBatchData(prev => [...prev, transformedBatch]);
      setShowCreateForm(false);

      setFormData({
        name: "",
        startDate: "",
        endDate: "",
        interns: [],
        hr: [],
      });

    } catch (err) {
      console.error("Error creating batch:", err);
      alert(`Failed to create batch: ${err.response?.data?.message || err.message}`);
    } finally {
      setFormLoading(false);
      window.location.reload();
    }
  };

  const handleUpdateBatch = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const response = await axios.put(`${baseUrl}/batches/${editBatchId}`, formData);
      const updatedBatch = response.data;

      // Transform the updated batch data to match the expected format
      const transformedBatch = {
        id: updatedBatch._id,
        batchName: updatedBatch.name,
        month: formatMonth(updatedBatch.startDate),
        startDate: updatedBatch.startDate?.split("T")[0] || "",
        endDate: updatedBatch.endDate?.split("T")[0] || "",
        totalInterns: updatedBatch.interns?.length || 0,
        activeInterns: updatedBatch.interns?.length || 0,
        completedInterns: "0/0", // Default value
        totalHR: updatedBatch.hr?.length || 0,
        status: getStatusFromDates(updatedBatch.startDate, updatedBatch.endDate),
        coordinator: "TBD",
        technologies: [],
        progress: 0,
      };

      setBatchData(prev =>
        prev.map(batch =>
          batch.id === editBatchId ? transformedBatch : batch
        )
      );
      setShowCreateForm(false);
      setIsEditing(false);
      setEditBatchId(null);
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Update failed");
      console.error(err);
    } finally {
      setFormLoading(false);
      window.location.reload();
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
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map(String).includes(stringValue)
        ? prev[field].filter((item) => item !== stringValue)
        : [...prev[field], stringValue],
    }));
  };

  const uniqueMonths = [...new Set(batchData.map((batch) => batch.month))];
  const filteredBatches = batchData.filter((batch) => {
    const matchesSearch =
      (batch.batchName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (batch.coordinator?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      (batch.status?.toLowerCase() || '') === filterStatus.toLowerCase();
    const matchesMonth =
      selectedMonth === "" ||
      (batch.month?.includes(selectedMonth) || false);

    return matchesSearch && matchesStatus && matchesMonth;
  });

  if (loading) {
    return (
      <>
        <CustomNavbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin dark:text-blue-400" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
              Loading batches...
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
              Error Loading Data
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-nonelg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto p-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Batch Management
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Manage month-wise intern sessions and track batch performance
            </p>
          </div>

          <div className="mb-6">
            {/* BatchStats & QuickActions are external components - ensure they receive same props */}
            <BatchStats batchData={batchData} />
            <QuickActions
              setShowCreateForm={setShowCreateForm}
              onViewRequests={fetchJoinRequests}
            />
          </div>

          <div className="mb-6">
            <Filters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              uniqueMonths={uniqueMonths}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredBatches.map((batch) => (
              <BatchCard
                key={batch.id}
                batch={batch}
                handleView={handleView}
                handleEditClick={handleEditClick}
                handleDeleteBatch={handleDeleteBatch}
                deleteLoading={deleteLoading}
                viewLoading={viewLoading === batch.id}
                editLoading={editLoading === batch.id}
              />
            ))}
          </div>

          {filteredBatches.length === 0 && !loading && (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                No batches found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
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
          loading={viewLoading !== null}
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
          formLoading={formLoading}
          handleCreateBatch={handleCreateBatch}
          handleUpdateBatch={handleUpdateBatch}
          hideActions={true}
        />
      )}

      {showRequestsPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-nonelg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Batch Join Requests
                </h2>
                <button
                  onClick={() => {
                    setShowRequestsPanel(false);
                    setSelectedRequests([]);
                  }}
                  className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
                >
                  <X size={24} />
                </button>
              </div>

              {requestsLoading ? (
                <div className="text-center py-8">
                  <Loader className="w-8 h-8 text-blue-600 mx-auto mb-4 animate-spin dark:text-blue-400" />
                  <p className="text-gray-500 dark:text-gray-400">Loading join requests...</p>
                </div>
              ) : joinRequests.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No pending join requests found</p>
                </div>
              ) : (
                <>
                  <div className="flex gap-4 mb-4">
                    <button
                      onClick={() => handleSelectAll()}
                      className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-slate-600 focus:outline-none"
                    >
                      {selectedRequests.length === joinRequests.length ? 'Deselect All' : 'Select All'}
                    </button>
                    <button
                      onClick={() => processRequests('approve')}
                      disabled={isProcessing}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
                    >
                      {isProcessing ? (
                        <Loader className="animate-spin" size={18} />
                      ) : (
                        <Check size={18} />
                      )}
                      Approve Selected
                    </button>
                    <button
                      onClick={() => processRequests('reject')}
                      disabled={isProcessing}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400"
                    >
                      {isProcessing ? (
                        <Loader className="animate-spin" size={18} />
                      ) : (
                        <X size={18} />
                      )}
                      Reject Selected
                    </button>
                  </div>

                  <div className="space-y-4">
                    {joinRequests.map((request) => (
                      <div
                        key={request._id}
                        className="border rounded-nonelg p-4 hover:bg-gray-50 dark:hover:bg-slate-700 border-gray-200 dark:border-slate-700"
                      >
                        <div className="flex items-center gap-4">
                          <input
                            type="checkbox"
                            checked={selectedRequests.includes(request._id)}
                            onChange={() => handleRequestSelection(request._id)}
                            className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                {request.name}
                              </h3>
                              <span className="text-sm text-gray-500 dark:text-gray-300">
                                Batch: {request.batchName}
                              </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300">{request.email}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Department: {request.department}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default HRBatchManagement;