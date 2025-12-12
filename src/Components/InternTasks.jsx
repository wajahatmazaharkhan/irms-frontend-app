"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  ListChecks,
  Search,
  Filter,
  Info,
} from "lucide-react";
import { Navbar, Wrapper, useTitle } from "@/Components/compIndex";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import TaskModal from "./TaskModal";
import { Button } from "@/Components/ui/button";

const InternTasksPage = () => {
  useTitle("IRMS | Tasks");
  const navigate = useNavigate();
  const { modalView, setModalView } = useAppContext();

  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [error, setError] = useState(null);

  const [tasksWithDetails, setTasksWithDetails] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "pending" | "in_review" | "completed" | "overdue"
  const [categoryFilter, setCategoryFilter] = useState("all"); // "all" | "technical" | "social"
  const [sortMode, setSortMode] = useState("deadline"); // "deadline" | "recent"
  const [searchQuery, setSearchQuery] = useState("");

  // NEW: controls mobile filters panel visibility
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const baseUrl = import.meta.env.VITE_BASE_URL;
  const role = localStorage.getItem("role");

  // Redirect non-intern roles
  useEffect(() => {
    if (role === "admin" || role === "hrHead") {
      navigate("/admin-access");
    } else if (role === "hr") {
      navigate("/hrhomepage");
    }
  }, [role, navigate]);

  // Fetch batch + tasks
  useEffect(() => {
    const fetchBatchData = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem("userId");
        const role = localStorage.getItem("role");

        if (!userId) throw new Error("User ID not found in localStorage");

        const usersResponse = await fetch(`${baseUrl}/allusers`);
        if (!usersResponse.ok) throw new Error("Failed to fetch user data");

        const usersData = await usersResponse.json();
        const currentUser = usersData.data.find((u) => u._id === userId);
        if (!currentUser) throw new Error("User not found");

        const batchId = currentUser.batch;
        if (!batchId) {
          setError("NO_BATCH_ASSIGNED");
          setLoading(false);
          return;
        }

        const batchResponse = await fetch(`${baseUrl}/batches/${batchId}`);
        if (!batchResponse.ok) throw new Error("Failed to fetch batch data");
        const batchData = await batchResponse.json();

        setBatch(batchData);

        if (batchData.tasks?.length > 0) {
          // Pass userId and role so fetchTaskDetails can filter appropriately
          await fetchTaskDetails(batchData.tasks, userId, role);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load data");
        setLoading(false);
      }
    };

    const fetchTaskDetails = async (tasks, userId, role) => {
      try {
        setTasksLoading(true);

        // Roles that can see all tasks
        const privilegedRoles = ["admin", "hr", "hrHead"];

        // If user is not privileged, only keep tasks assigned to them
        const tasksToFetch =
          privilegedRoles.includes(role) || !role
            ? tasks
            : tasks.filter((t) => String(t.assignedTo) === String(userId));

        const detailed = await Promise.all(
          tasksToFetch.map(async (t) => {
            try {
              const res = await fetch(`${baseUrl}/task/get-task/${t.taskId}`);
              if (!res.ok) throw new Error("Failed to fetch task");
              const data = await res.json();
              return {
                ...t,
                details: data.taskDetails,
              };
            } catch (err) {
              console.error("Error fetching task", t.taskId, err);
              return { ...t, details: null };
            }
          })
        );

        setTasksWithDetails(detailed);
      } catch (err) {
        console.error("Error fetching task details:", err);
      } finally {
        setTasksLoading(false);
      }
    };

    fetchBatchData();
    // keep baseUrl as dependency; you may add role if role can change during session
  }, [baseUrl]);

  // Helper: compute completion stats
  const stats = useMemo(() => {
    const total = tasksWithDetails.length;
    let completed = 0;
    let overdue = 0;
    const now = new Date();

    tasksWithDetails.forEach((t) => {
      const status = (t.details?.status || "").toLowerCase();
      if (status === "completed") completed += 1;

      const end = t.details?.endDate ? new Date(t.details.endDate) : null;
      if (end && end.getTime() < now.getTime() && status !== "completed") {
        overdue += 1;
      }
    });

    const pending = total - completed;
    const completion = total === 0 ? 0 : Math.round((completed / total) * 100);

    return { total, completed, pending, overdue, completion };
  }, [tasksWithDetails]);

  // Helper: status object (including derived "overdue")
  const getTaskStatus = (task) => {
    const rawStatus = (task.details?.status || "pending").toLowerCase();
    const now = new Date();
    const end = task.details?.endDate ? new Date(task.details.endDate) : null;

    if (rawStatus === "completed") return "completed";
    if (end && end.getTime() < now.getTime()) return "overdue";
    if (rawStatus === "in_review") return "in_review";
    return "pending";
  };

  // Helper: deadline info text & tone
  const getDeadlineInfo = (task) => {
    const endDateStr = task.details?.endDate;
    if (!endDateStr) {
      return {
        label: "No deadline set",
        tone: "neutral",
      };
    }

    const end = new Date(endDateStr);
    const now = new Date();

    const diffMs = end.getTime() - now.getTime();
    const dayMs = 1000 * 60 * 60 * 24;
    const diffDays = Math.round(diffMs / dayMs);

    if (diffMs < 0) {
      const pastDays = Math.abs(diffDays);
      if (pastDays === 0) {
        return { label: "Deadline passed today", tone: "overdue" };
      }
      return {
        label: `Deadline passed ${pastDays} day${pastDays > 1 ? "s" : ""} ago`,
        tone: "overdue",
      };
    }

    if (diffDays === 0) {
      return { label: "Due today", tone: "urgent" };
    }

    if (diffDays === 1) {
      return { label: "1 day remaining", tone: "soon" };
    }

    return {
      label: `${diffDays} days remaining`,
      tone: diffDays <= 3 ? "soon" : "safe",
    };
  };

  // Status badge (square)
  const TaskStatusBadge = ({ status }) => {
    const normalized = (status || "").toLowerCase();
    let label = "Pending";
    let classes =
      "border border-yellow-500 text-yellow-600 bg-yellow-50 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-700";

    if (normalized === "completed") {
      label = "Completed";
      classes =
        "border border-green-500 text-green-600 bg-green-50 dark:bg-green-900 dark:text-green-100 dark:border-green-700";
    } else if (normalized === "overdue") {
      label = "Overdue";
      classes =
        "border border-red-500 text-red-600 bg-red-50 dark:bg-red-900 dark:text-red-100 dark:border-red-700";
    } else if (normalized === "in_review") {
      label = "In Review";
      classes =
        "border border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-700";
    }

    return (
      <div
        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium uppercase tracking-wide ${classes} rounded-none`}
      >
        {normalized === "completed" && <CheckCircle className="w-3 h-3" />}
        {normalized === "overdue" && <AlertCircle className="w-3 h-3" />}
        {normalized === "pending" && <Clock className="w-3 h-3" />}
        {normalized === "in_review" && <Clock className="w-3 h-3" />}
        <span>{label}</span>
      </div>
    );
  };

  // Filter + sort tasks
  const visibleTasks = useMemo(() => {
    let result = [...tasksWithDetails];

    if (categoryFilter !== "all") {
      result = result.filter((t) => {
        const cat = t.details?.category || t.details?.taskType || "technical";
        return cat.toLowerCase() === categoryFilter;
      });
    }

    if (statusFilter !== "all") {
      result = result.filter((t) => getTaskStatus(t) === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((t) => {
        const title = (t.details?.title || "").toLowerCase();
        const desc = (t.details?.description || "").toLowerCase();
        return title.includes(q) || desc.includes(q);
      });
    }

    if (sortMode === "deadline") {
      result.sort((a, b) => {
        const da = a.details?.endDate
          ? new Date(a.details.endDate).getTime()
          : Infinity;
        const db = b.details?.endDate
          ? new Date(b.details.endDate).getTime()
          : Infinity;
        return da - db;
      });
    } else {
      // recent (startDate desc, fallback to createdAt)
      result.sort((a, b) => {
        const da = a.details?.startDate
          ? new Date(a.details.startDate).getTime()
          : a.details?.createdAt
          ? new Date(a.details.createdAt).getTime()
          : 0;
        const db = b.details?.startDate
          ? new Date(b.details.startDate).getTime()
          : b.details?.createdAt
          ? new Date(b.details.createdAt).getTime()
          : 0;
        return db - da;
      });
    }

    return result;
  }, [tasksWithDetails, categoryFilter, statusFilter, searchQuery, sortMode]);

  // Open modal
  const handleSubmitTask = (taskId) => {
    if (!taskId) return;
    setSelectedTaskId(taskId);
    setModalView(true);
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div id="mainContent">
          <Wrapper>
            <div className="min-h-screen flex flex-row items-center justify-center bg-gray-50 dark:bg-slate-900">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <img
                  className="w-10 h-10 mx-auto mb-4"
                  src="https://cdn.pixabay.com/animation/2023/08/11/21/18/21-18-05-265_512.gif"
                  alt="Loading"
                />
              </motion.div>
            </div>
          </Wrapper>
        </div>
      </>
    );
  }

  // No batch assigned
  if (error === "NO_BATCH_ASSIGNED") {
    return (
      <>
        <Navbar />
        <div id="mainContent">
          <Wrapper>
            <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
              <div className="bg-white dark:bg-slate-900 dark:border dark:border-slate-700 dark:text-slate-100 px-8 py-8 max-w-md text-center border border-gray-200 rounded-none">
                <div className="text-blue-500 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-2">
                  No Batch Assigned
                </h3>
                <p className="text-gray-600 dark:text-slate-300 mb-4">
                  You are not currently assigned to any batch.
                </p>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  Kindly contact your respective HR for assistance.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-none hover:bg-blue-700 transition-colors text-sm"
                  >
                    Refresh Status
                  </button>
                </div>
              </div>
            </div>
          </Wrapper>
        </div>
      </>
    );
  }

  // Generic error
  if (error) {
    return (
      <>
        <Navbar />
        <div id="mainContent">
          <Wrapper>
            <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
              <div className="bg-white dark:bg-slate-900 dark:border dark:border-slate-700 dark:text-slate-100 px-8 py-8 max-w-md text-center border border-gray-200 rounded-none">
                <div className="text-red-500 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-2">
                  Error loading tasks
                </h3>
                <p className="text-gray-600 dark:text-slate-300 mb-6">
                  {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-none hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </Wrapper>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Task Modal */}
      {modalView && selectedTaskId && <TaskModal taskId={selectedTaskId} />}

      <Navbar />
      <div id="mainContent">
        <Wrapper>
          <div className="min-h-screen bg-gray-50 dark:bg-slate-950 dark:text-slate-100">
            {/* Page header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg dark:from-blue-700 dark:to-purple-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
                      <ListChecks className="w-7 h-7" />
                      Tasks
                    </h1>
                    <p className="text-blue-100 text-sm md:text-base mt-1">
                      Review all your assigned tasks, track deadlines, and
                      submit work.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex flex-col">
                      <span className="opacity-80">Total Tasks</span>
                      <span className="text-xl font-bold">{stats.total}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="opacity-80">Completed</span>
                      <span className="text-xl font-bold">
                        {stats.completed}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="opacity-80">Overdue</span>
                      <span className="text-xl font-bold">{stats.overdue}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="opacity-80">Completion</span>
                      <span className="text-xl font-bold">
                        {stats.completion}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
              {/* Filters + search */}
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 px-4 py-4 rounded-none">
                <div className="flex flex-col gap-4">
                  {/* Top row: search + filter-toggle button */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                    {/* Search */}
                    <div className="flex-1 max-w-xl">
                      <div className="flex items-center gap-2 border border-gray-300 dark:border-slate-700 px-3 py-2 rounded-none bg-gray-50 dark:bg-slate-900">
                        <Search className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search tasks by title or description..."
                          className="bg-transparent focus:outline-none text-sm w-full text-gray-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                        />
                      </div>
                    </div>

                    {/* Filters toggle (always visible, but only collapses on small screens) */}
                    <div className="flex items-center justify-between lg:justify-end">
                      <button
                        type="button"
                        onClick={() => setShowFilterPanel((prev) => !prev)}
                        className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium uppercase tracking-wide border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-700 dark:text-slate-200 rounded-none lg:hidden"
                      >
                        <Filter className="w-4 h-4" />
                        {showFilterPanel ? "Hide Filters" : "Show Filters"}
                      </button>

                      <div className="hidden lg:flex items-center gap-2 text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">
                        <Filter className="w-4 h-4" />
                        Filters
                      </div>
                    </div>
                  </div>

                  {/* Actual filters panel */}
                  <div
                    className={`border-t border-gray-200 dark:border-slate-700 pt-4 mt-2 ${
                      showFilterPanel ? "block" : "hidden"
                    } lg:block`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                      {/* Category */}
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                          Category
                        </span>
                        <div className="flex border border-gray-300 dark:border-slate-700 text-xs overflow-x-auto">
                          <button
                            onClick={() => setCategoryFilter("all")}
                            className={`px-3 py-1 whitespace-nowrap ${
                              categoryFilter === "all"
                                ? "bg-blue-600 text-white"
                                : "bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-200"
                            } rounded-none`}
                          >
                            All
                          </button>
                          <button
                            onClick={() => setCategoryFilter("technical")}
                            className={`px-3 py-1 border-l border-gray-300 dark:border-slate-700 whitespace-nowrap ${
                              categoryFilter === "technical"
                                ? "bg-blue-600 text-white"
                                : "bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-200"
                            } rounded-none`}
                          >
                            Technical
                          </button>
                          <button
                            onClick={() => setCategoryFilter("social")}
                            className={`px-3 py-1 border-l border-gray-300 dark:border-slate-700 whitespace-nowrap ${
                              categoryFilter === "social"
                                ? "bg-blue-600 text-white"
                                : "bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-200"
                            } rounded-none`}
                          >
                            Social
                          </button>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                          Status
                        </span>
                        <div className="flex border border-gray-300 dark:border-slate-700 text-xs overflow-x-auto">
                          <button
                            onClick={() => setStatusFilter("all")}
                            className={`px-3 py-1 whitespace-nowrap ${
                              statusFilter === "all"
                                ? "bg-blue-600 text-white"
                                : "bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-200"
                            } rounded-none`}
                          >
                            All
                          </button>
                          <button
                            onClick={() => setStatusFilter("pending")}
                            className={`px-3 py-1 border-l border-gray-300 dark:border-slate-700 whitespace-nowrap ${
                              statusFilter === "pending"
                                ? "bg-blue-600 text-white"
                                : "bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-200"
                            } rounded-none`}
                          >
                            Pending
                          </button>
                          <button
                            onClick={() => setStatusFilter("in_review")}
                            className={`px-3 py-1 border-l border-gray-300 dark:border-slate-700 whitespace-nowrap ${
                              statusFilter === "in_review"
                                ? "bg-blue-600 text-white"
                                : "bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-200"
                            } rounded-none`}
                          >
                            In Review
                          </button>
                          <button
                            onClick={() => setStatusFilter("completed")}
                            className={`px-3 py-1 border-l border-gray-300 dark:border-slate-700 whitespace-nowrap ${
                              statusFilter === "completed"
                                ? "bg-blue-600 text-white"
                                : "bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-200"
                            } rounded-none`}
                          >
                            Completed
                          </button>
                          <button
                            onClick={() => setStatusFilter("overdue")}
                            className={`px-3 py-1 border-l border-gray-300 dark:border-slate-700 whitespace-nowrap ${
                              statusFilter === "overdue"
                                ? "bg-blue-600 text-white"
                                : "bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-200"
                            } rounded-none`}
                          >
                            Overdue
                          </button>
                        </div>
                      </div>

                      {/* Sort */}
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                          Sort
                        </span>
                        <div className="flex border border-gray-300 dark:border-slate-700 text-xs overflow-x-auto">
                          <button
                            onClick={() => setSortMode("deadline")}
                            className={`px-3 py-1 whitespace-nowrap ${
                              sortMode === "deadline"
                                ? "bg-blue-600 text-white"
                                : "bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-200"
                            } rounded-none`}
                          >
                            Sort by Deadline
                          </button>
                          <button
                            onClick={() => setSortMode("recent")}
                            className={`px-3 py-1 border-l border-gray-300 dark:border-slate-700 whitespace-nowrap ${
                              sortMode === "recent"
                                ? "bg-blue-600 text-white"
                                : "bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-200"
                            } rounded-none`}
                          >
                            Newest First
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tasks list */}
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 px-4 py-4 rounded-none">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                    Assigned Tasks
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    Showing {visibleTasks.length} of {tasksWithDetails.length}{" "}
                    tasks
                  </p>
                </div>

                {tasksLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin h-10 w-10 border-t-2 border-b-2 border-blue-500 rounded-full" />
                  </div>
                ) : visibleTasks.length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 border border-dashed border-gray-300 dark:border-slate-700 mb-3">
                      <Info className="w-6 h-6 text-gray-400 dark:text-slate-400" />
                    </div>
                    <h3 className="text-base font-medium text-gray-900 dark:text-slate-100 mb-1">
                      No tasks match your filters
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-slate-300">
                      Try changing the status/category filters or clearing the
                      search.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {visibleTasks.map((task, index) => {
                      const deadlineInfo = getDeadlineInfo(task);
                      const status = getTaskStatus(task);
                      const isCompleted = status === "completed";

                      return (
                        <motion.div
                          key={task.details?._id || index}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.02 }}
                          className="border border-gray-200 dark:border-slate-700 px-4 py-4 bg-gray-50 dark:bg-slate-950 hover:bg-white dark:hover:bg-slate-800 transition-colors rounded-none"
                        >
                          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                            <div className="flex-1 space-y-2">
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <div>
                                  <h3 className="font-semibold text-gray-900 dark:text-slate-100 text-sm md:text-base">
                                    {task.details?.title || "Untitled Task"}
                                  </h3>
                                  {task.details?.category && (
                                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                                      Category:{" "}
                                      <span className="uppercase tracking-wide">
                                        {task.details.category}
                                      </span>
                                    </p>
                                  )}
                                </div>
                                <TaskStatusBadge status={status} />
                              </div>

                              {task.details?.description && (
                                <p className="text-xs md:text-sm text-gray-700 dark:text-slate-300 line-clamp-3">
                                  {task.details.description}
                                </p>
                              )}

                              <div className="flex flex-wrap gap-3 text-xs text-gray-600 dark:text-slate-300">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>
                                    Start:{" "}
                                    {task.details?.startDate
                                      ? new Date(
                                          task.details.startDate
                                        ).toLocaleDateString()
                                      : "Not set"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>
                                    End:{" "}
                                    {task.details?.endDate
                                      ? new Date(
                                          task.details.endDate
                                        ).toLocaleDateString()
                                      : "Not set"}
                                  </span>
                                </div>

                                {/* Deadline info */}
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span
                                    className={
                                      deadlineInfo.tone === "overdue"
                                        ? "text-red-600 dark:text-red-400"
                                        : deadlineInfo.tone === "urgent"
                                        ? "text-orange-600 dark:text-orange-400"
                                        : deadlineInfo.tone === "soon"
                                        ? "text-yellow-600 dark:text-yellow-400"
                                        : "text-emerald-600 dark:text-emerald-400"
                                    }
                                  >
                                    {deadlineInfo.label}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2 min-w-[140px]">
                              <Button
                                onClick={() =>
                                  handleSubmitTask(task.details?._id)
                                }
                                className={`w-full text-sm font-medium rounded-none ${
                                  isCompleted
                                    ? "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-700 dark:hover:bg-green-800"
                                    : "bg-blue-600 text-white hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500"
                                }`}
                                variant={isCompleted ? "outline" : "default"}
                              >
                                {isCompleted ? "Resubmit" : "Submit"}
                              </Button>
                              {!isCompleted && (
                                <p className="text-[10px] text-gray-500 dark:text-slate-400">
                                  Make sure to upload your work and provide a
                                  clear summary in the submission form.
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Wrapper>
      </div>
    </>
  );
};

export default InternTasksPage;
