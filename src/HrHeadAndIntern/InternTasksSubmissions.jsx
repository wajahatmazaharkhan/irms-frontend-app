
import React, { useEffect, useState } from "react";
import CustomNavbar from "./CustomHrNavbar";
import axios from "axios";
import toast from "react-hot-toast";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Loader, useTitle } from "@/Components/compIndex";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import {
  InfoIcon,
  CheckCircle2,
  XCircle,
  X,
  CrossIcon,
  Trash2,
} from "lucide-react";
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
      <div className="w-full max-w-[1440px] mx-auto my-6 px-4 md:px-10">
        <h2
          onClick={() => {
            Swal.fire({
              title:
                '<div class="text-xl font-semibold text-gray-800 mb-2">Task Acceptance and Rejection Process</div>',
              html: `...`, // Keep your existing Swal HTML here
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {taskSubmissions.length > 0 ? (
            taskSubmissions.map((submission) => (
              <div
                key={submission._id}
                className="p-6 bg-gradient-to-br from-white via-indigo-50 to-purple-100 rounded-2xl shadow-md border border-indigo-200"
              >
                <h3 className="text-xl font-bold text-indigo-700 mb-2">
                  {submission.user?.name || "Unnamed Intern"}
                </h3>

                <p className="text-gray-700 mb-1">
                  <span className="font-semibold">Task:</span>{" "}
                  {submission.taskDetails?.title || submission.task || "N/A"}
                </p>

                <p className="mb-1">
                  <span className="font-semibold">Status:</span>{" "}
                  <span className="px-2 py-1 text-sm font-medium rounded bg-yellow-100 text-yellow-700">
                    {submission.taskDetails?.status || "Pending"}
                  </span>
                </p>

                <p className="text-gray-600 mb-1">
                  <span className="font-semibold">Comments:</span>{" "}
                  {submission.comments || "No Comments"}
                </p>

                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Created:</span>{" "}
                  {new Date(submission.createdAt).toLocaleString()}
                </p>

                {/* File Section */}
                <div className="mb-2">
                  <span className="font-semibold text-gray-700">File:</span>{" "}
                  {submission.file ? (
                    <a
                      href={submission.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline ml-1"
                    >
                      📄 View File
                    </a>
                  ) : (
                    <span className="text-gray-500 ml-1">No File Uploaded</span>
                  )}
                </div>

                {/* Image Section */}
                <div className="mb-2">
                  <span className="font-semibold text-gray-700">Image:</span>{" "}
                  {submission.image ? (
                    <div
                      className="mt-2 cursor-pointer"
                      onClick={() => redirectToImage(submission.image)}
                    >
                      <img
                        src={submission.image}
                        alt="Task Submission"
                        className="rounded-lg w-full h-40 object-cover border border-gray-300 shadow-sm"
                      />
                    </div>
                  ) : (
                    <span className="text-gray-500 ml-1">No Image Uploaded</span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      markAsComplete(submission.task, submission.user?._id)
                    }
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                  >
                    <CheckCircle2 size={16} /> Accept
                  </button>
                  <button
                    onClick={() =>
                      markAsIncomplete(submission.task, submission.user?._id)
                    }
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                  >
                    <XCircle size={16} /> Reject
                  </button>
                  <button
                    onClick={() => deleteTask(submission.task)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                  >
                    <X size={16} /> Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full">
              <Alert className="bg-blue-50 border-blue-200">
                <InfoIcon className="text-blue-500" />
                <AlertDescription>
                  No task submissions available for your batches.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </div>
    </>

  );
};

export default InternTasksSubmissions;
