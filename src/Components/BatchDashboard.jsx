"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Info,
  Check,
  Users,
  FileText,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  Navbar,
  Wrapper,
  useTitle,
  InternNecessities,
} from "@/Components/compIndex";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import TaskModal from "./TaskModal";
import { Button } from "@/Components/ui/button";
import { Calendar as CalendarUI } from "react-calendar";

const BatchDashboard = () => {
  const role = localStorage.getItem("role");
  useTitle("IRMS | Intern Dashboard");
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tasksWithDetails, setTasksWithDetails] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5, 1)); // June 2025 to match image
  const [activeTab, setActiveTab] = useState("technical");
  const [isHovered, setIsHovered] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const baseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const { modalView, setModalView } = useAppContext();

  useEffect(() => {
    if (role === "admin" || role === "hrHead") {
      navigate("/admin-access");
    } else if (role === "hr") {
      navigate("/hrhomepage");
    }
  }, [role]);

  useEffect(() => {
    const fetchBatchData = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem("userId");
        if (!userId) {
          throw new Error("User ID not found in localStorage");
        }

        const usersResponse = await fetch(`${baseUrl}/allusers`);
        if (!usersResponse.ok) {
          throw new Error("Failed to fetch user data");
        }

        const usersData = await usersResponse.json();
        const currentUser = usersData.data.find((user) => user._id === userId);

        if (!currentUser) {
          throw new Error("User not found");
        }

        const batchId = currentUser.batch;
        if (!batchId) {
          setError("NO_BATCH_ASSIGNED");
          setLoading(false);
          return;
        }

        const batchResponse = await fetch(`${baseUrl}/batches/${batchId}`);
        if (!batchResponse.ok) {
          throw new Error("Failed to fetch batch data");
        }

        const batchData = await batchResponse.json();
        setBatch(batchData);

        if (batchData.tasks?.length > 0) {
          await fetchTaskDetails(batchData.tasks, userId);
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchTaskDetails = async (tasks, currentUserId) => {
      try {
        setTasksLoading(true);

        // Option A: Filter tasks array first to only those assigned to current user
        // Compare as strings because one side might be ObjectId
        const tasksForUser = tasks.filter(
          (t) => String(t.assignedTo) === String(currentUserId)
        );

        const tasksWithDetails = await Promise.all(
          tasksForUser.map(async (task) => {
            try {
              const response = await fetch(
                `${baseUrl}/task/get-task/${task.taskId}`
              );
              if (!response.ok) throw new Error("Failed to fetch task");
              const data = await response.json();
              // combine both batch-level metadata and full details
              return {
                ...task,
                details: data.taskDetails,
              };
            } catch (err) {
              console.error(`Error fetching task ${task.taskId}:`, err);
              return {
                ...task,
                details: null,
              };
            }
          })
        );

        setTasksWithDetails(tasksWithDetails);
      } catch (err) {
        console.error("Error fetching task details:", err);
      } finally {
        setTasksLoading(false);
      }
    };
    fetchBatchData();
  }, [baseUrl]);

  // Task Status Badge Component
  const TaskStatusBadge = ({ status }) => {
    const statusConfig = {
      completed: {
        icon: CheckCircle,
        className:
          "bg-green-100 text-green-700 border border-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-800",
      },
      pending: {
        icon: Clock,
        className:
          "bg-yellow-100 text-yellow-700 border border-yellow-200 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-800",
      },
      overdue: {
        icon: AlertCircle,
        className:
          "bg-red-100 text-red-700 border border-red-200 dark:bg-red-900 dark:text-red-100 dark:border-red-800",
      },
    };

    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <div
        className={`flex items-center gap-1 px-3 py-1 rounded-nonefull text-sm font-medium capitalize ${config.className}`}
      >
        <Icon className="w-4 h-4" />
        <span>{status || "pending"}</span>
      </div>
    );
  };

  // Helper functions
  const calculateCompletionPercentage = () => {
    if (!batch || batch.allTasks === 0) return 0;
    return Math.round((batch.completedTasks / batch.allTasks) * 100);
  };

  const getFilteredTasks = (category) => {
    return tasksWithDetails.filter((task) => {
      const taskCategory =
        task.details?.category || task.details?.taskType || "technical";
      return taskCategory.toLowerCase() === category.toLowerCase();
    });
  };

  // Handle submit button click
  const handleSubmitTask = (taskId) => {
    setSelectedTaskId(taskId);
    setModalView(true);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div id="mainContent">
          <Wrapper>
            <div className="min-h-screen flex flex-row items-center justify-center mx-auto place-content-center dark:bg-slate-900">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <img
                  className="w-10 h-10 mx-auto mb-4"
                  src="https://cdn.pixabay.com/animation/2023/08/11/21/18/21-18-05-265_512.gif"
                  alt=""
                />
              </motion.div>
            </div>
          </Wrapper>
        </div>
      </>
    );
  }

  if (error === "NO_BATCH_ASSIGNED") {
    return (
      <>
        <Navbar />
        <div id="mainContent">
          <Wrapper>
            <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-slate-900 dark:border dark:border-slate-700 dark:text-slate-100 rounded-nonexl shadow-lg p-8 max-w-md text-center"
              >
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
                    className="px-4 py-2 bg-blue-600 text-white rounded-nonelg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Refresh Status
                  </button>
                </div>
              </motion.div>
            </div>
          </Wrapper>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div id="mainContent">
          <Wrapper>
            <div className="min-h-screen dark:bg-slate-900 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-slate-900 dark:border dark:border-slate-700 dark:text-slate-100 rounded-nonexl shadow-lg p-8 max-w-md text-center"
              >
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
                  Error loading batch data
                </h3>
                <p className="text-gray-600 dark:text-slate-300 mb-6">
                  {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-nonelg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </motion.div>
            </div>
          </Wrapper>
        </div>
      </>
    );
  }

  const filteredTasks = getFilteredTasks(activeTab);

  return (
    <>
      {/* Task Modal */}
      {modalView && selectedTaskId && <TaskModal taskId={selectedTaskId} />}

      <Navbar />
      <div id="mainContent">
        <Wrapper>
          <div className="min-h-screen dark:bg-slate-950 dark:text-slate-100">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg dark:from-blue-700 dark:to-purple-800"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
                <div className="text-center">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-nowrap">
                    IRMS | Dashboard
                  </h1>
                  <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto">
                    Track your internship progress and stay updated with your
                    batch
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 -mt-12 relative z-10">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-slate-900 rounded-nonexl p-6 text-center shadow-lg border border-gray-100 dark:border-slate-700 hover:shadow-xl transition-shadow"
                >
                  <div className="w-12 h-12 bg-blue-500 rounded-nonelg flex items-center justify-center mx-auto mb-3 shadow-md">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-slate-300 mb-1">
                    Batch Status
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                    Completed
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    Current program phase
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-slate-900 rounded-nonexl p-6 text-center shadow-lg border border-gray-100 dark:border-slate-700 hover:shadow-xl transition-shadow"
                >
                  <div className="w-12 h-12 bg-green-500 rounded-nonelg flex items-center justify-center mx-auto mb-3 shadow-md">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-slate-300 mb-1">
                    Total Interns
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                    {batch?.interns?.length || 0}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    In your batch
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-slate-900 rounded-nonexl p-6 text-center shadow-lg border border-gray-100 dark:border-slate-700 hover:shadow-xl transition-shadow"
                >
                  <div className="w-12 h-12 bg-purple-500 rounded-nonelg flex items-center justify-center mx-auto mb-3 shadow-md">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-slate-300 mb-1">
                    Total Tasks
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                    {batch?.allTasks || 0}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    Assigned to batch
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-slate-900 rounded-nonexl p-6 text-center shadow-lg border border-gray-100 dark:border-slate-700 hover:shadow-xl transition-shadow"
                >
                  <div className="w-12 h-12 bg-orange-500 rounded-nonelg flex items-center justify-center mx-auto mb-3 shadow-md">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-slate-300 mb-1">
                    Completion
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                    {calculateCompletionPercentage()}%
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    Tasks completed
                  </p>
                </motion.div>
              </div>

              <InternNecessities />

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Tasks Section - Left side */}
                <div className="lg:col-span-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white dark:bg-slate-900 rounded-nonexl shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                          Assigned Tasks
                          <span className="ml-2 text-sm font-normal text-blue-600 dark:text-blue-400">
                            {tasksWithDetails.length} active
                          </span>
                        </h2>
                        <button
                          onClick={() => navigate("/view-all-tasks")}
                          className="text-blue-600 dark:text-blue-400 text-sm hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
                        >
                          View all →
                        </button>
                      </div>

                      {/* Tabs */}
                      <div className="border-b border-gray-200 dark:border-slate-700 mb-6">
                        <nav className="-mb-px flex space-x-8">
                          <button
                            onClick={() => setActiveTab("technical")}
                            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                              activeTab === "technical"
                                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-500"
                            }`}
                          >
                            Technical
                          </button>
                          <button
                            onClick={() => setActiveTab("social")}
                            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                              activeTab === "social"
                                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-500"
                            }`}
                          >
                            Social
                          </button>
                        </nav>
                      </div>

                      {/* Task Content */}
                      {tasksLoading ? (
                        <div className="flex justify-center py-16">
                          <div className="animate-spin rounded-nonefull h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                      ) : filteredTasks.length > 0 ? (
                        <div className="space-y-4">
                          {filteredTasks
                            .toReversed()
                            .map((task, index) => {
                              const assignedIntern = batch.interns?.find(
                                (intern) => intern._id === task.assignedTo
                              ) || {
                                name: "Unassigned",
                                email: "",
                              };

                              return (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="p-4 border border-gray-200 dark:border-slate-700 rounded-nonelg hover:border-blue-300 dark:hover:border-blue-500 transition-colors bg-gray-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700"
                                  whileHover={{ scale: 1.01 }}
                                >
                                  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                                    <div className="flex-1 space-y-3">
                                      <div className="flex items-start justify-between">
                                        <h4 className="font-semibold text-lg text-gray-900 dark:text-slate-100">
                                          {task.details?.title ||
                                            `Task ${index + 1}`}
                                        </h4>
                                        <TaskStatusBadge
                                          status={task.details?.status}
                                        />
                                      </div>

                                      {task.details?.description && (
                                        <p className="text-gray-600 dark:text-slate-300 text-sm">
                                          {task.details.description}
                                        </p>
                                      )}

                                      <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-slate-400">
                                        <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-slate-800 px-2.5 py-1 rounded-nonefull">
                                          <Calendar className="w-3.5 h-3.5" />
                                          <span>
                                            Start:{" "}
                                            {task.details?.startDate
                                              ? new Date(
                                                  task.details.startDate
                                                ).toLocaleDateString()
                                              : "Not set"}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-slate-800 px-2.5 py-1 rounded-nonefull">
                                          <Calendar className="w-3.5 h-3.5" />
                                          <span>
                                            End:{" "}
                                            {task.details?.endDate
                                              ? new Date(
                                                  task.details.endDate
                                                ).toLocaleDateString()
                                              : "Not set"}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex flex-col gap-3 min-w-[120px] w-full lg:w-auto mt-4 lg:mt-0">
                                      <Button
                                        onClick={() =>
                                          handleSubmitTask(task.details?._id)
                                        }
                                        className={`w-full ${
                                          task.details?.status === "completed"
                                            ? "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 dark:bg-green-900 dark:text-green-100 dark:hover:bg-green-800 dark:border-green-800"
                                            : "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
                                        }`}
                                        variant={
                                          task.details?.status === "completed"
                                            ? "outline"
                                            : "default"
                                        }
                                        disabled={!task.details?._id}
                                      >
                                        {task.details?.status === "completed"
                                          ? "Resubmit"
                                          : "Submit"}
                                      </Button>
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })
                            .slice(0, 3)}
                        </div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center py-20"
                        >
                          <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-nonefull flex items-center justify-center mx-auto mb-4">
                            <Info className="h-8 w-8 text-gray-400 dark:text-slate-400" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-2">
                            No {activeTab} tasks found
                          </h3>
                          <p className="text-gray-600 dark:text-slate-300 text-sm">
                            You {`don't`} have any {activeTab} tasks assigned
                            yet.
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* Calendar Section - Right side */}
                <div className="lg:col-span-4 calendar-wrapper">
                  <div className="text-black rounded-none shadow-sm border  p-4">
                    <CalendarUI />
                  </div>
                </div>
              </div>

              {/* Additional Batch Information */}
              {batch && (batch.hr?.length > 0 || batch.interns?.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 bg-white dark:bg-slate-900 rounded-nonexl shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-6">
                      Batch Information
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* HR Contacts */}
                      {batch.hr?.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-slate-100 mb-4 flex items-center">
                            Mentor Contacts
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-2 py-1 rounded-nonefull">
                              {batch.hr.length}
                            </span>
                          </h4>
                          <div className="space-y-3">
                            {batch.hr.map((hrContact, index) => (
                              <motion.div
                                key={index}
                                whileHover={{ x: 5 }}
                                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-nonelg border border-gray-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 transition-colors"
                              >
                                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-medium shadow-md">
                                  {hrContact.hrId?.name?.charAt(0) || "H"}
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-800 dark:text-slate-100 break-all">
                                    {hrContact.hrId?.name || "HR Contact"}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-slate-300 break-all">
                                    {hrContact.hrId?.email ||
                                      "No email provided"}
                                  </div>
                                </div>
                                <button
                                  onClick={() =>
                                    navigate(
                                      `/internchat/${hrContact.hrId?._id}`
                                    )
                                  }
                                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-2 rounded-nonefull hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                    />
                                  </svg>
                                </button>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Fellow Interns */}
                      {batch.interns?.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-slate-100 mb-4 flex items-center">
                            Fellow Interns
                            <span className="ml-2 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-2 py-1 rounded-nonefull">
                              {batch.interns.length}
                            </span>
                          </h4>
                          <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                            {batch.interns.map((intern, index) => (
                              <motion.div
                                key={index}
                                whileHover={{ x: 5 }}
                                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-nonelg border border-gray-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 transition-colors"
                              >
                                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium shadow-md">
                                  {intern.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="break-all font-medium text-gray-800 dark:text-slate-100 ">
                                    {intern.name}
                                  </div>
                                  <div className="break-all text-sm text-gray-500 dark:text-slate-300 ">
                                    {intern.email}
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </Wrapper>
      </div>
    </>
  );
};

export default BatchDashboard;
