
import React, { useEffect, useState } from "react";
import CustomNavbar from "./CustomHrNavbar";
import axios from "axios";
import toast from "react-hot-toast";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Loader, useTitle } from "@/Components/compIndex";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { InfoIcon, CheckCircle2, XCircle, X } from "lucide-react";
import Swal from "sweetalert2";

const InternTasksSubmissions = () => {
  useTitle(`Task Submissions`);
  const [taskSubmissions, setTaskSubmissions] = useState([]);
  const [tasksMap, setTasksMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hrId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchHRTasks = async () => {
      try {
        // Step 1: Get HR's batches and intern IDs
        const batchesRes = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/batch/get-ids`
        );
        const hrBatches = batchesRes.data.data.filter(batch => 
          batch.hr.some(hr => hr._id === hrId)
        );

        // Step 2: Get all tasks from HR's batches
        const batchTasks = await Promise.all(
          hrBatches.map(async (batch) => {
            const res = await axios.get(
              `${import.meta.env.VITE_BASE_URL}/api/batch/get/${batch._id}`
            );
            return res.data.tasks || [];
          })
        );
        const allTasks = batchTasks.flat();

        // Create task map and collect task IDs
        const taskIdMap = {};
        const hrTaskIds = [];
        allTasks.forEach(task => {
          taskIdMap[task.taskId] = task;
          hrTaskIds.push(task.taskId);
        });

        // Step 3: Get all submissions and filter by HR's task IDs
        const submissionsRes = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/getsubmitedtasks`
        );
        const filteredSubmissions = submissionsRes.data.filter(sub => 
          hrTaskIds.includes(sub.task)
        );

        // Step 4: Get task details for each submission
        const tasksDetails = await Promise.all(
          filteredSubmissions.map(async sub => {
            const res = await axios.get(
              `${import.meta.env.VITE_BASE_URL}/task/get-task/${sub.task}`
            );
            return res.data.taskDetails;
          })
        );

        // Combine data
        const finalData = filteredSubmissions.map((sub, index) => ({
          ...sub,
          taskDetails: tasksDetails[index]
        }));

        setTasksMap(taskIdMap);
        setTaskSubmissions(finalData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHRTasks();
  }, [hrId]);

  const redirectToImage = (image) => {
    window.open(image, "_blank");
  };

  // ... (keep all your existing action functions: markAsComplete, markAsIncomplete, deleteTask)
   const markAsComplete = async (taskId, userId) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to mark this task as complete?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#2A6AED",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, mark it!",
      });

      if (result.isConfirmed) {
        await sendAcceptNotification(
          userId,
          taskId,
          "Submission Approved",
          "Accepted"
        );

        toast.success("Task marked as complete successfully");
        await Swal.fire(
          "Marked!",
          "The task has been marked as complete.",
          "success"
        );
      }
    } catch (error) {
      console.error("Error marking task as complete: ", error);
      toast.error("Error marking task as complete");
      await Swal.fire(
        "Error!",
        "There was an issue marking the task as complete.",
        "error"
      );
    }
  };

  const markAsIncomplete = async (taskId, userId) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to mark this task as incomplete?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#2A6AED",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, mark it!",
      });

      if (result.isConfirmed) {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/send/notification`,
          {
            userId: userId,
            taskId: taskId,
            message: "Submission Rejected",
            status: "Rejected",
          }
        );

        if (res.status === 200 || res.status === 201) {
          await Swal.fire(
            "Marked!",
            "The task has been marked as incomplete.",
            "success"
          );
        }
      }
    } catch (error) {
      console.error("Error marking task as incomplete: ", error);
      toast.error("Error marking task as incomplete");
      await Swal.fire(
        "Error!",
        "There was an issue marking the task as incomplete.",
        "error"
      );
    }
  };

  const deleteTask = async (taskId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#2A6AED",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.delete(
          `${import.meta.env.VITE_BASE_URL}/task/delete-task/${taskId}`
        );

        if (res.status === 200 || res.status === 204 || res.status === 201) {
          Swal.fire("Deleted!", "Your item has been deleted.", "success");
        }
      } catch (error) {
        console.error("Error deleting task: ", error);
        Swal.fire("Error!", "There was an issue deleting the task.", "error");
      }
    }
  };

  if (loading) return <Loader />;
  if (error) return <div>Error: {error}</div>;

  return (
  <>
    <CustomNavbar />
    <div className="container mx-auto my-6 p-6">
      <h2
        onClick={() => {
          Swal.fire({
            title:
              '<div class="text-xl font-semibold text-gray-800 mb-2">Task Acceptance and Rejection Process</div>',
            html: `
            <div class="space-y-4 text-left p-2">
              <!-- Accept Section -->
              <div class="flex items-start gap-3 bg-green-50 p-4 rounded-lg border border-green-200">
                <div class="mt-1">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <h4 class="font-semibold text-green-700 text-lg mb-1">Accept</h4>
                  <p class="text-green-600 leading-relaxed">
                    Task is approved, and the user is notified. The task will be 
                    <span class="font-semibold text-red-600">deleted</span> 
                    from the database, but all submission details, files, and links will be archived in the admin panel for reference.
                  </p>
                </div>
              </div>
      
              <!-- Reject Section -->
              <div class="flex items-start gap-3 bg-red-50 p-4 rounded-lg border border-red-200">
                <div class="mt-1">
                  <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <h4 class="font-semibold text-red-700 text-lg mb-1">Reject</h4>
                  <p class="text-red-600 leading-relaxed">
                    User is notified for revision with an option to resubmit the task.
                  </p>
                </div>
              </div>
      
              <!-- Important Note -->
              <div class="flex items-start gap-3 bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div class="mt-1">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <span class="font-semibold text-blue-700">Important:</span>
                  <p class="text-blue-600 leading-relaxed">
                    No need to worry, as all task submissions will be securely saved in the admin panel for future reference.
                  </p>
                </div>
              </div>
            </div>
          `,
            showCancelButton: true,
            cancelButtonText: "Close",
            showConfirmButton: false,
            width: "600px",
            padding: "2rem",
            showCloseButton: true,
            customClass: {
              popup: "rounded-xl",
              cancelButton:
                "px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200",
              actions: "mt-4",
              container: "font-sans",
            },
            buttonsStyling: false,
          });
        }}
        className="text-3xl underline cursor-pointer font-semibold text-center mb-6"
      >
        Intern Task Submissions
      </h2>

      {/* Mobile View */}
      <div className="overflow-x-auto mt-10 sm:hidden">
        {taskSubmissions.length > 0 ? (
          taskSubmissions.map((submission) => (
            <div
              key={submission._id}
              className="mb-4 p-4 border border-gray-300 rounded-lg"
            >
              <h3 className="font-semibold text-lg">
                {submission.user?.name}
              </h3>
              <p>
                <strong>Task:</strong>{" "}
                {submission.taskDetails?.title || submission.task || "N/A"}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {submission.taskDetails?.status || "N/A"}
              </p>
              <p>
                <strong>Comments:</strong>{" "}
                {submission.comments || "No Comments"}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(submission.createdAt).toLocaleString()}
              </p>
              {submission.file && (
                <a
                  href={submission.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline block mt-2"
                >
                  View File
                </a>
              )}
              {submission.image && (
                <div
                  className="mt-2"
                  onClick={() => redirectToImage(submission.image)}
                >
                  <img
                    src={submission.image}
                    alt="Task Submission"
                    className="w-16 h-16 cursor-pointer object-cover rounded"
                  />
                </div>
              )}
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() =>
                    markAsComplete(submission.task, submission.user?._id)
                  }
                  className="bg-green-500 text-white px-3 py-1 rounded flex items-center gap-1"
                >
                  <CheckCircle2 size={16} /> Accept
                </button>
                <button
                  onClick={() =>
                    markAsIncomplete(submission.task, submission.user?._id)
                  }
                  className="bg-red-500 text-white px-3 py-1 rounded flex items-center gap-1"
                >
                  <XCircle size={16} /> Reject
                </button>
                <button
                  onClick={() => deleteTask(submission.task)}
                  className="bg-blue-500 text-white px-3 py-1 rounded flex items-center gap-1"
                >
                  <X size={16} /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <Alert className="bg-blue-50 border-blue-200">
            <InfoIcon className="text-blue-500" />
            <AlertDescription>
              No task submissions available for your batches.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Desktop View */}
      <div className="overflow-x-auto mt-10 hidden sm:block">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="border-b p-3 text-left text-sm sm:text-base">
                Intern Name
              </th>
              <th className="border-b p-3 text-left text-sm sm:text-base">
                Task
              </th>
              <th className="border-b p-3 text-left text-sm sm:text-base">
                Status
              </th>
              <th className="border-b p-3 text-left text-sm sm:text-base">
                Comments
              </th>
              <th className="border-b p-3 text-left text-sm sm:text-base">
                File
              </th>
              <th className="border-b p-3 text-left text-sm sm:text-base">
                Image
              </th>
              <th className="border-b p-3 text-left text-sm sm:text-base">
                Created At
              </th>
              <th className="border-b p-3 text-left text-sm sm:text-base">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {taskSubmissions.length > 0 ? (
              taskSubmissions.map((submission) => (
                <tr key={submission._id} className="hover:bg-gray-50">
                  <td className="border-b p-3 text-sm sm:text-base">
                    {submission.user?.name || "N/A"}
                  </td>

                  <td className="border-b p-3 text-sm sm:text-base">
                    {submission.taskDetails?.title || submission.task}
                  </td>

                  <td className="border-b p-3 text-sm sm:text-base capitalize">
                    {submission.taskDetails?.status || "N/A"}
                  </td>

                  <td className="border-b p-3 text-sm sm:text-base max-w-xs truncate">
                    {submission.comments || "No Comments"}
                  </td>

                  <td className="border-b p-3 text-sm sm:text-base">
                    {submission.file ? (
                      <a
                        href={submission.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        View File
                      </a>
                    ) : (
                      "No File"
                    )}
                  </td>

                  <td className="border-b p-3 text-sm sm:text-base">
                    {submission.image ? (
                      <img
                        onClick={() => redirectToImage(submission.image)}
                        src={submission.image}
                        alt="Task Submission"
                        className="w-16 h-16 cursor-pointer object-cover rounded"
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>

                  <td className="border-b p-3 text-sm sm:text-base">
                    {new Date(submission.createdAt).toLocaleString()}
                  </td>

                  <td className="border-b p-3 text-sm sm:text-base">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          markAsComplete(submission.task, submission.user?._id)
                        }
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1 text-xs"
                      >
                        <CheckCircle2 size={14} /> Accept
                      </button>
                      <button
                        onClick={() =>
                          markAsIncomplete(submission.task, submission.user?._id)
                        }
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 text-xs"
                      >
                        <XCircle size={14} /> Reject
                      </button>
                      <button
                        onClick={() => deleteTask(submission.task)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1 text-xs"
                      >
                        <X size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-3 text-center">
                  <Alert className="bg-blue-50 border-blue-200">
                    <InfoIcon className="text-blue-500" />
                    <AlertDescription>
                      No task submissions available for your batches.
                    </AlertDescription>
                  </Alert>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </>
);
};

export default InternTasksSubmissions;