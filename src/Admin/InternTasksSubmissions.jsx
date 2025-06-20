import React, { useEffect, useState } from "react";
import CustomNavbar from "./CustomNavbar";
import axios from "axios";
import toast from "react-hot-toast";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Loader, useTitle } from "@/Components/compIndex";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
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
  Trash2
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
        // Fetch all submissions
        const submissionsRes = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/getsubmitedtasks`
        );
        
        // Get task details for each submission
        const submissionsWithDetails = await Promise.all(
          submissionsRes.data.map(async sub => {
            try {
              const taskRes = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/task/get-task/${sub.task}`
              );
              return {
                ...sub,
                taskDetails: taskRes.data.taskDetails
              };
            } catch (error) {
              console.error("Error fetching task details:", error);
              return sub;
            }
          })
        );

        // Sort with Pending first
        submissionsWithDetails.sort((a, b) => {
          if ((a.reviewStatus || "Pending") === "Pending") return -1;
          if ((b.reviewStatus || "Pending") === "Pending") return 1;
          return 0;
        });

        setTaskSubmissions(submissionsWithDetails);
      } catch (err) {
        setError(err.message);
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
          status
        }
      );

      if (res.status === 200 || res.status === 201) {
        setTaskSubmissions(prev => 
          prev.map(sub => 
            sub._id === submissionId 
              ? { 
                  ...sub, 
                  reviewed: true,
                  reviewStatus: status 
                } 
              : sub
          ).sort((a, b) => {
            if ((a.reviewStatus || "Pending") === "Pending") return -1;
            if ((b.reviewStatus || "Pending") === "Pending") return 1;
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
        popup: 'animate__animated animate__fadeInDown animate__faster'
      },
    });

    if (result.isConfirmed) {
      const success = await reviewTask(submissionId, userId, taskId, "Accepted");
      
      if (success) {
        toast.success("Task approved successfully", {
          position: "bottom-right",
          style: {
            background: "#10B981",
            color: "#fff",
            borderRadius: "12px"
          },
          icon: <ThumbsUp className="w-5 h-5" />
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
        popup: 'animate__animated animate__fadeInDown animate__faster'
      },
    });

    if (result.isConfirmed) {
      const success = await reviewTask(submissionId, userId, taskId, "Rejected");
      
      if (success) {
        toast.success("Task rejected successfully", {
          position: "bottom-right",
          style: {
            background: "#EF4444",
            color: "#fff",
            borderRadius: "12px"
          },
          icon: <ThumbsDown className="w-5 h-5" />
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
        popup: 'animate__animated animate__headShake animate__faster'
      },
    });

    if (result.isConfirmed) {
      try {
		  
		  // First delete the submission
		  let res = await axios.delete(
          `${import.meta.env.VITE_BASE_URL}/deletetasksubmition/${taskId}`
        );
		  
        // Then the task
         res = await axios.delete(
          `${import.meta.env.VITE_BASE_URL}/task/delete-task/${taskId}`
        );

        if (res.status === 200 || res.status === 204) {
          // Remove from local state
          setTaskSubmissions(prev => prev.filter(sub => sub._id !== submissionId));
          
          toast.success("Task submission deleted successfully", {
            position: "bottom-right",
            style: {
              background: "#6B7280",
              color: "#fff",
              borderRadius: "12px"
            }
          });
        }
      } catch (error) {
        console.error("Error deleting task submission: ", error);
        toast.error(error.response?.data?.error || "Error deleting task submission", {
          position: "bottom-right",
          style: {
            background: "#EF4444",
            color: "#fff",
            borderRadius: "12px"
          }
        });
      }
    }
  };

  // Filter tasks by type
  const technicalTasks = taskSubmissions.filter(
    submission => submission.taskDetails?.taskType === "Technical"
  );
  const socialTasks = taskSubmissions.filter(
    submission => submission.taskDetails?.taskType === "Social"
  );

  if (loading) return <Loader />;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <CustomNavbar />
      <div className="w-full max-w-[1440px] mx-auto my-6 px-4 md:px-10">
        <motion.div 
          className="flex flex-col items-center mb-8 cursor-pointer"
          onClick={() => {
            Swal.fire({
              title: '<span class="text-2xl font-bold text-gray-800">Task Submission Guide</span>',
              html: `
                <div class="text-left space-y-4">
                  <p class="text-gray-700">Review and manage all task submissions across all batches</p>
                </div>
              `,
              confirmButtonText: "Got it!",
              confirmButtonColor: "#3B82F6",
              background: "#ffffff",
              showClass: {
                popup: 'animate__animated animate__zoomIn animate__faster'
              },
            });
          }}
          onHoverStart={() => setIsHoveringTitle(true)}
          onHoverEnd={() => setIsHoveringTitle(false)}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">
            Task Submissions
          </h1>
          <motion.div
            className="flex items-center text-blue-600"
            animate={{
              x: isHoveringTitle ? 5 : 0
            }}
            transition={{
              repeat: isHoveringTitle ? Infinity : 0,
              repeatType: "reverse",
              duration: 0.5
            }}
          >
            <span className="text-sm font-medium">Click for guidance</span>
            <ChevronRight className="h-4 w-4" />
          </motion.div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="inline-flex bg-gray-100 p-1 rounded-xl shadow-inner">
              {["all", "technical", "social"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-6 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                    activeTab === tab
                      ? "text-white"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {activeTab === tab && (
                    <motion.span
                      layoutId="tabIndicator"
                      className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-md"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
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
                  <Alert className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <InfoIcon className="text-blue-500 flex-shrink-0" />
                      <AlertDescription className="text-gray-700">
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
  index
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const userId = submission.user?._id;
  const submissionId = submission._id;
  const taskId = submission.task;
  const effectiveReviewStatus = submission.reviewStatus || "Pending";

  const getStatusStyles = () => {
    switch(effectiveReviewStatus) {
      case "Accepted":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          border: "border-green-200",
          hoverBg: "hover:bg-green-50",
          icon: <ThumbsUp className="w-4 h-4" />
        };
      case "Rejected":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          border: "border-red-200",
          hoverBg: "hover:bg-red-50",
          icon: <ThumbsDown className="w-4 h-4" />
        };
      default: // Pending (including null case)
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          border: "border-yellow-200",
          hoverBg: "hover:bg-yellow-50",
          icon: <Clock className="w-4 h-4" />
        };
    }
  };

  const statusStyles = getStatusStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.05,
        duration: 0.4,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
    >
      <Card className={`border ${statusStyles.border} rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col ${statusStyles.hoverBg}`}>
        {/* Card Header */}
        <div className={`p-4 border-b ${statusStyles.border}`}>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <User size={18} className="text-indigo-600" />
                {submission.user?.name || "Unnamed Intern"}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                <FileText size={16} className="text-blue-600" />
                {submission.taskDetails?.title || "N/A"}
              </p>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${statusStyles.bg} ${statusStyles.text}`}>
              {statusStyles.icon}
              {effectiveReviewStatus}
            </span>
          </div>
        </div>

        {/* Card Content */}
        <CardContent className="p-4 flex-1 flex flex-col">
          <div className="space-y-3 flex-1">
            <div className="flex items-start gap-3">
              <Clock size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600">
                Submitted: {new Date(submission.createdAt).toLocaleString()}
              </p>
            </div>

            {submission.comments && (
              <div className="flex items-start gap-3">
                <InfoIcon size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Comments:</span>{" "}
                  {submission.comments}
                </p>
              </div>
            )}

            {/* File Section */}
            <div className="flex items-center gap-3">
              <FileText size={16} className="text-gray-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">File:</p>
                {submission.file ? (
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={submission.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm inline-flex items-center gap-1"
                  >
                    View File
                  </motion.a>
                ) : (
                  <span className="text-gray-500 text-sm">No File Uploaded</span>
                )}
              </div>
            </div>

            {/* Image Section */}
            <div className="flex items-start gap-3">
              <ImageIcon size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Image:</p>
                {submission.image ? (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="cursor-pointer"
                    onClick={() => redirectToImage(submission.image)}
                  >
                    <img
                      src={submission.image}
                      alt="Task Submission"
                      className="rounded-lg w-full h-32 object-cover border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md"
                    />
                  </motion.div>
                ) : (
                  <span className="text-gray-500 text-sm">No Image Uploaded</span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
            {effectiveReviewStatus === "Pending" ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: "0 4px 14px rgba(16, 185, 129, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => markAsComplete(submissionId, userId, taskId)}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1.5 transition-all shadow-md flex-1 min-w-[100px]"
                >
                  <Check size={16} /> Approve
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: "0 4px 14px rgba(239, 68, 68, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => markAsIncomplete(submissionId, userId, taskId)}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1.5 transition-all shadow-md flex-1 min-w-[100px]"
                >
                  <XIcon size={16} /> Reject
                </motion.button>
              </>
            ) : (
              <motion.div
                className="w-full text-center py-2 px-4 rounded-lg text-sm font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {effectiveReviewStatus === "Accepted" ? (
                  <span className="text-green-600 flex items-center justify-center gap-2">
                    <ThumbsUp className="w-4 h-4" /> Approved
                  </span>
                ) : (
                  <span className="text-red-600 flex items-center justify-center gap-2">
                    <ThumbsDown className="w-4 h-4" /> Rejected
                  </span>
                )}
              </motion.div>
            )}
            
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: "0 4px 14px rgba(107, 114, 128, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => deleteTask(submissionId, taskId)}
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1.5 transition-all shadow-md flex-1 min-w-[100px]"
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