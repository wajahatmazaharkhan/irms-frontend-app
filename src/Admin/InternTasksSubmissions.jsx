import React, { useEffect, useState } from "react";
import CustomNavbar from "./CustomNavbar";
import axios from "axios";
import toast from "react-hot-toast";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Loader, useTitle } from "@/Components/compIndex";
import { Card, CardContent, CardTitle } from "@/Components/ui/card";
import {
  InfoIcon,
  FileText,
  Image as ImageIcon,
  User,
  Clock,
  Check,
  X as XIcon,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Trash2,
  Link2,
  ListChecks,
} from "lucide-react";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

const InternTasksSubmissions = () => {
  useTitle(`Task Submissions`);
  const [taskSubmissions, setTaskSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [isHoveringTitle, setIsHoveringTitle] = useState(false);

  useEffect(() => {
    const fetchAllSubmissions = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/getsubmitedtasks`
        );

        // Backend now returns TaskCompletion with populated `task` and `user`
        const submissionsWithSort = [...res.data].sort((a, b) => {
          const aStatus = a.reviewStatus || "Pending";
          const bStatus = b.reviewStatus || "Pending";
          if (aStatus === "Pending" && bStatus !== "Pending") return -1;
          if (bStatus === "Pending" && aStatus !== "Pending") return 1;
          return 0;
        });

        setTaskSubmissions(submissionsWithSort);
      } catch (err) {
        setError(err?.message || "Failed to fetch submissions");
      } finally {
        setLoading(false);
      }
    };

    fetchAllSubmissions();
  }, []);

  const redirectToImage = (image) => {
    window.open(image, "_blank");
  };

  const reviewTask = async (submissionId, userId, taskId, status) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/task/reviewtask`,
        {
          taskId,
          userId,
          status,
        }
      );

      if (res.status === 200 || res.status === 201) {
        setTaskSubmissions((prev) =>
          prev
            .map((sub) =>
              sub._id === submissionId
                ? {
                    ...sub,
                    reviewed: true,
                    reviewStatus: status,
                  }
                : sub
            )
            .sort((a, b) => {
              const aStatus = a.reviewStatus || "Pending";
              const bStatus = b.reviewStatus || "Pending";
              if (aStatus === "Pending" && bStatus !== "Pending") return -1;
              if (bStatus === "Pending" && aStatus !== "Pending") return 1;
              return 0;
            })
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error reviewing task: ", error);
      toast.error(error.response?.data?.error || "Error reviewing task");
      return false;
    }
  };

  const markAsComplete = async (submissionId, userId, taskId) => {
    const result = await Swal.fire({
      title: "Confirm Approval",
      text: "Approve this task submission?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Approve",
      cancelButtonText: "Cancel",
      background: "#ffffff",
      showClass: {
        popup: "animate__animated animate__fadeInDown animate__faster",
      },
    });

    if (result.isConfirmed) {
      const success = await reviewTask(
        submissionId,
        userId,
        taskId,
        "Accepted"
      );

      if (success) {
        toast.success("Task approved successfully", {
          position: "bottom-right",
          style: {
            background: "#10B981",
            color: "#fff",
            borderRadius: "12px",
          },
          icon: <ThumbsUp className="w-5 h-5" />,
        });
      }
    }
  };

  const markAsIncomplete = async (submissionId, userId, taskId) => {
    const result = await Swal.fire({
      title: "Confirm Rejection",
      text: "Reject this task submission?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Reject",
      cancelButtonText: "Cancel",
      background: "#ffffff",
      showClass: {
        popup: "animate__animated animate__fadeInDown animate__faster",
      },
    });

    if (result.isConfirmed) {
      const success = await reviewTask(
        submissionId,
        userId,
        taskId,
        "Rejected"
      );

      if (success) {
        toast.success("Task rejected successfully", {
          position: "bottom-right",
          style: {
            background: "#EF4444",
            color: "#fff",
            borderRadius: "12px",
          },
          icon: <ThumbsDown className="w-5 h-5" />,
        });
      }
    }
  };

  const deleteTask = async (submissionId, taskId) => {
    const result = await Swal.fire({
      title: "Delete Submission?",
      text: "This will delete both the task and its submission",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      background: "#ffffff",
      showClass: {
        popup: "animate__animated animate__headShake animate__faster",
      },
    });

    if (result.isConfirmed) {
      try {
        // First delete the submission
        let res = await axios.delete(
          `${import.meta.env.VITE_BASE_URL}/deletetasksubmition/${taskId}`
        );

        // Then delete the task itself
        res = await axios.delete(
          `${import.meta.env.VITE_BASE_URL}/task/delete-task/${taskId}`
        );

        if (res.status === 200 || res.status === 204) {
          setTaskSubmissions((prev) =>
            prev.filter((sub) => sub._id !== submissionId)
          );

          toast.success("Task submission deleted successfully", {
            position: "bottom-right",
            style: {
              background: "#6B7280",
              color: "#fff",
              borderRadius: "12px",
            },
          });
        }
      } catch (error) {
        console.error("Error deleting task submission: ", error);
        toast.error(
          error.response?.data?.error || "Error deleting task submission",
          {
            position: "bottom-right",
            style: {
              background: "#EF4444",
              color: "#fff",
              borderRadius: "12px",
            },
          }
        );
      }
    }
  };

  // Filter tasks by type using populated `task`
  const technicalTasks = taskSubmissions.filter(
    (submission) => submission.task?.taskType === "Technical"
  );
  const socialTasks = taskSubmissions.filter(
    (submission) => submission.task?.taskType === "Social"
  );

  if (loading) return <Loader />;

  if (error) {
    return (
      <>
        <CustomNavbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
          <p className="text-red-600 dark:text-red-400 text-sm">
            Error: {error}
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <CustomNavbar />
      <div className="w-full max-w-[1440px] mx-auto my-6 px-4 md:px-10 bg-transparent">
        {/* Header + Guide */}
        <motion.div
          className="flex flex-col items-center mb-8 cursor-pointer"
          onClick={() => {
            Swal.fire({
              title:
                '<span class="text-2xl font-bold text-gray-800">Task Submission Guide</span>',
              html: `
                <div class="text-left space-y-4">
                  <p class="text-gray-700">Review and manage all task submissions across all batches.</p>
                  <ul class="list-disc pl-5 text-sm text-gray-700 space-y-1">
                    <li>Click "Approve" or "Reject" to review a submission.</li>
                    <li>Use tabs to filter by Technical or Social tasks.</li>
                    <li>Click "View File" to open PDF reports.</li>
                    <li>Click the image thumbnail to open full-size view.</li>
                  </ul>
                </div>
              `,
              confirmButtonText: "Got it!",
              confirmButtonColor: "#3B82F6",
              background: "#ffffff",
              showClass: {
                popup: "animate__animated animate__zoomIn animate__faster",
              },
            });
          }}
          onHoverStart={() => setIsHoveringTitle(true)}
          onHoverEnd={() => setIsHoveringTitle(false)}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-slate-100 mb-2">
            Task Submissions
          </h1>
          <motion.div
            className="flex items-center text-blue-600 dark:text-blue-400"
            animate={{
              x: isHoveringTitle ? 5 : 0,
            }}
            transition={{
              repeat: isHoveringTitle ? Infinity : 0,
              repeatType: "reverse",
              duration: 0.5,
            }}
          >
            <span className="text-sm font-medium">Click for guidance</span>
            <ChevronRight className="h-4 w-4" />
          </motion.div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="inline-flex bg-gray-100 dark:bg-slate-800 p-1 rounded-nonexl shadow-inner dark:shadow-none border border-gray-200 dark:border-slate-700">
              {["all", "technical", "social"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-6 py-2 rounded-nonelg font-medium text-sm transition-all duration-300 ${
                    activeTab === tab
                      ? "text-white"
                      : "text-gray-600 hover:text-gray-800 dark:text-slate-300 dark:hover:text-slate-100"
                  }`}
                >
                  {activeTab === tab && (
                    <motion.span
                      layoutId="tabIndicator"
                      className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-nonelg shadow-md"
                      initial={false}
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <span className="relative z-10 capitalize">
                    {tab === "all" ? "All Tasks" : tab}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {(() => {
              const currentSubmissions =
                activeTab === "all"
                  ? taskSubmissions
                  : activeTab === "technical"
                  ? technicalTasks
                  : socialTasks;

              return currentSubmissions.length > 0 ? (
                currentSubmissions.map((submission, index) => (
                  <TaskCard
                    key={submission._id}
                    submission={submission}
                    markAsComplete={markAsComplete}
                    markAsIncomplete={markAsIncomplete}
                    deleteTask={deleteTask}
                    redirectToImage={redirectToImage}
                    index={index}
                  />
                ))
              ) : (
                <motion.div
                  className="col-span-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Alert className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 border border-blue-100 dark:border-slate-700 rounded-nonexl shadow-sm">
                    <div className="flex items-center gap-3">
                      <InfoIcon className="text-blue-500 flex-shrink-0" />
                      <AlertDescription className="text-gray-700 dark:text-slate-200">
                        No task submissions available in this category.
                      </AlertDescription>
                    </div>
                  </Alert>
                </motion.div>
              );
            })()}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};

const TaskCard = ({
  submission,
  markAsComplete,
  markAsIncomplete,
  deleteTask,
  redirectToImage,
  index,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const userId = submission.user?._id;
  const submissionId = submission._id;

  // `task` may be populated or just an ID; handle both
  const taskId = submission.task?._id || submission.task;
  const task = submission.task || {};
  const effectiveReviewStatus = submission.reviewStatus || "Pending";

  const getStatusStyles = () => {
    switch (effectiveReviewStatus) {
      case "Accepted":
        return {
          bg: "bg-green-100 dark:bg-green-900/60",
          text: "text-green-800 dark:text-green-100",
          border: "border-green-200 dark:border-green-700",
          hoverBg: "hover:bg-green-50 dark:hover:bg-green-900",
          icon: <ThumbsUp className="w-4 h-4" />,
        };
      case "Rejected":
        return {
          bg: "bg-red-100 dark:bg-red-900/60",
          text: "text-red-800 dark:text-red-100",
          border: "border-red-200 dark:border-red-700",
          hoverBg: "hover:bg-red-50 dark:hover:bg-red-900",
          icon: <ThumbsDown className="w-4 h-4" />,
        };
      default: // Pending
        return {
          bg: "bg-yellow-100 dark:bg-yellow-900/60",
          text: "text-yellow-800 dark:text-yellow-100",
          border: "border-yellow-200 dark:border-yellow-700",
          hoverBg: "hover:bg-yellow-50 dark:hover:bg-yellow-900",
          icon: <Clock className="w-4 h-4" />,
        };
    }
  };

  const statusStyles = getStatusStyles();

  const selfEvalLabelMap = {
    needs_improvement: "Needs Improvement",
    satisfactory: "Satisfactory",
    good: "Good",
    excellent: "Excellent",
  };

  const selfEvalColorMap = {
    needs_improvement:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/60 dark:text-red-100 dark:border-red-700",
    satisfactory:
      "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/60 dark:text-yellow-100 dark:border-yellow-700",
    good: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/60 dark:text-blue-100 dark:border-blue-700",
    excellent:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/60 dark:text-emerald-100 dark:border-emerald-700",
  };

  const selfEvalClass =
    submission.selfEvaluation && selfEvalColorMap[submission.selfEvaluation];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.05,
        duration: 0.4,
        type: "spring",
        stiffness: 100,
      }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
    >
      <Card
        className={`border ${statusStyles.border} rounded-nonexl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col ${statusStyles.hoverBg} dark:bg-slate-900`}
      >
        {/* Card Header */}
        <div
          className={`p-4 border-b ${statusStyles.border} bg-white/70 dark:bg-slate-900/80`}
        >
          <div className="flex justify-between items-start gap-3">
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-slate-100">
                <User
                  size={18}
                  className="text-indigo-600 dark:text-indigo-400"
                />
                <span>{submission.user?.name || "Unnamed Intern"}</span>
              </CardTitle>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                {submission.user?.email}
              </p>
              <p className="text-sm text-gray-600 dark:text-slate-300 mt-2 flex items-center gap-2">
                <FileText
                  size={16}
                  className="text-blue-600 dark:text-blue-400"
                />
                <span className="font-medium">
                  {task.title || "No title available"}
                </span>
              </p>
              {task.taskType && (
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                  Task Type:{" "}
                  <span className="font-medium">{task.taskType}</span>
                </p>
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              <span
                className={`px-2 py-1 text-xs font-medium rounded-nonefull flex items-center gap-1 ${statusStyles.bg} ${statusStyles.text}`}
              >
                {statusStyles.icon}
                {effectiveReviewStatus}
              </span>
              {submission.selfEvaluation && (
                <span
                  className={`px-2 py-1 text-[11px] font-medium rounded-nonefull border ${selfEvalClass}`}
                >
                  Self Eval:{" "}
                  {selfEvalLabelMap[submission.selfEvaluation] ||
                    submission.selfEvaluation}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card Content */}
        <CardContent className="p-4 flex-1 flex flex-col bg-white/60 dark:bg-slate-900/80">
          <div className="space-y-3 flex-1">
            {/* Submitted time */}
            <div className="flex items-start gap-3">
              <Clock
                size={16}
                className="text-gray-500 dark:text-slate-400 mt-0.5 flex-shrink-0"
              />
              <p className="text-sm text-gray-600 dark:text-slate-300">
                Submitted: {new Date(submission.createdAt).toLocaleString()}
              </p>
            </div>

            {/* Time spent */}
            {submission.timeSpent && (
              <div className="flex items-start gap-3">
                <ListChecks
                  size={16}
                  className="text-gray-500 dark:text-slate-400 mt-0.5 flex-shrink-0"
                />
                <p className="text-sm text-gray-600 dark:text-slate-300">
                  <span className="font-medium">Time Spent:</span>{" "}
                  {submission.timeSpent}
                </p>
              </div>
            )}

            {/* Comments / Summary */}
            {submission.comments && (
              <div className="flex items-start gap-3">
                <InfoIcon
                  size={16}
                  className="text-gray-500 dark:text-slate-400 mt-0.5 flex-shrink-0"
                />
                <p className="text-sm text-gray-700 dark:text-slate-200">
                  <span className="font-medium">Summary:</span>{" "}
                  {submission.comments}
                </p>
              </div>
            )}

            {/* Methods */}
            {submission.methods && (
              <div className="flex items-start gap-3">
                <InfoIcon
                  size={16}
                  className="text-gray-500 dark:text-slate-400 mt-0.5 flex-shrink-0"
                />
                <p className="text-sm text-gray-700 dark:text-slate-200">
                  <span className="font-medium">Methods / Approach:</span>{" "}
                  {submission.methods}
                </p>
              </div>
            )}

            {/* Results */}
            {submission.results && (
              <div className="flex items-start gap-3">
                <InfoIcon
                  size={16}
                  className="text-gray-500 dark:text-slate-400 mt-0.5 flex-shrink-0"
                />
                <p className="text-sm text-gray-700 dark:text-slate-200">
                  <span className="font-medium">Key Results:</span>{" "}
                  {submission.results}
                </p>
              </div>
            )}

            {/* Challenges */}
            {submission.challenges && (
              <div className="flex items-start gap-3">
                <InfoIcon
                  size={16}
                  className="text-gray-500 dark:text-slate-400 mt-0.5 flex-shrink-0"
                />
                <p className="text-sm text-gray-700 dark:text-slate-200">
                  <span className="font-medium">Challenges:</span>{" "}
                  {submission.challenges}
                </p>
              </div>
            )}

            {/* File Section */}
            <div className="flex items-start gap-3">
              <FileText
                size={16}
                className="text-gray-500 dark:text-slate-400 mt-0.5 flex-shrink-0"
              />
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-slate-200">
                  File (PDF/Doc):
                </p>
                {submission.file ? (
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={submission.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm inline-flex items-center gap-1"
                  >
                    View File
                  </motion.a>
                ) : (
                  <span className="text-gray-500 dark:text-slate-400 text-sm">
                    No File Uploaded
                  </span>
                )}
              </div>
            </div>

            {/* Image Section */}
            <div className="flex items-start gap-3">
              <ImageIcon
                size={16}
                className="text-gray-500 dark:text-slate-400 mt-0.5 flex-shrink-0"
              />
              <div className="w-full">
                <p className="text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">
                  Image:
                </p>
                {submission.image ? (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="cursor-pointer"
                    onClick={() => redirectToImage(submission.image)}
                  >
                    <img
                      src={submission.image}
                      alt="Task Submission"
                      className="rounded-nonelg w-full h-32 object-cover border border-gray-200 dark:border-slate-700 shadow-sm transition-all duration-300 hover:shadow-md"
                    />
                  </motion.div>
                ) : (
                  <span className="text-gray-500 dark:text-slate-400 text-sm">
                    No Image Uploaded
                  </span>
                )}
              </div>
            </div>

            {/* Links Section */}
            {(submission.githubLink || submission.externalLink) && (
              <div className="flex items-start gap-3">
                <Link2
                  size={16}
                  className="text-gray-500 dark:text-slate-400 mt-0.5 flex-shrink-0"
                />
                <div className="space-y-1 text-sm">
                  {submission.githubLink && (
                    <div>
                      <span className="font-medium text-gray-700 dark:text-slate-200">
                        GitHub / Repo:
                      </span>{" "}
                      <a
                        href={submission.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                      >
                        {submission.githubLink}
                      </a>
                    </div>
                  )}
                  {submission.externalLink && (
                    <div>
                      <span className="font-medium text-gray-700 dark:text-slate-200">
                        External Link:
                      </span>{" "}
                      <a
                        href={submission.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                      >
                        {submission.externalLink}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
            {effectiveReviewStatus === "Pending" ? (
              <>
                <motion.button
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 4px 14px rgba(16, 185, 129, 0.3)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => markAsComplete(submissionId, userId, taskId)}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-nonelg text-sm flex items-center gap-1.5 transition-all shadow-md flex-1 min-w-[100px]"
                >
                  <Check size={16} /> Approve
                </motion.button>
                <motion.button
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 4px 14px rgba(239, 68, 68, 0.3)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => markAsIncomplete(submissionId, userId, taskId)}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-nonelg text-sm flex items-center gap-1.5 transition-all shadow-md flex-1 min-w-[100px]"
                >
                  <XIcon size={16} /> Reject
                </motion.button>
              </>
            ) : (
              <motion.div
                className="w-full text-center py-2 px-4 rounded-nonelg text-sm font-medium bg-gray-50 dark:bg-slate-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {effectiveReviewStatus === "Accepted" ? (
                  <span className="text-green-600 dark:text-green-400 flex items-center justify-center gap-2">
                    <ThumbsUp className="w-4 h-4" /> Approved
                  </span>
                ) : (
                  <span className="text-red-600 dark:text-red-400 flex items-center justify-center gap-2">
                    <ThumbsDown className="w-4 h-4" /> Rejected
                  </span>
                )}
              </motion.div>
            )}

            <motion.button
              whileHover={{
                scale: 1.03,
                boxShadow: "0 4px 14px rgba(107, 114, 128, 0.3)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => deleteTask(submissionId, taskId)}
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-nonelg text-sm flex items-center gap-1.5 transition-all shadow-md flex-1 min-w-[100px]"
            >
              <Trash2 size={16} /> Delete
            </motion.button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InternTasksSubmissions;
