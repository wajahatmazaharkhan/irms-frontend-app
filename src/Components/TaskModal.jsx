import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useAppContext } from "@/context/AppContext";
import {
  Loader2,
  Upload,
  FileText,
  Image as ImageIcon,
  X,
  AlertCircle,
} from "lucide-react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import axios from "axios";

export default function TaskModal({ taskId }) {
  const [open, setOpen] = useState(true);
  const [file, setFile] = useState(null); // used for PDF
  const [image, setImage] = useState(null);
  const [comments, setComments] = useState(""); // main required description / summary
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("pending");
  const [dragActive, setDragActive] = useState(false);
  const { modalView, setModalView } = useAppContext();

  // extra fields for research-style submission
  const [methods, setMethods] = useState("");
  const [results, setResults] = useState("");
  const [challenges, setChallenges] = useState("");
  const [timeSpent, setTimeSpent] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [selfEvaluation, setSelfEvaluation] = useState("");

  const baseUrl = import.meta.env.VITE_BASE_URL;

  const handleSubmit = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to submit the task?",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#2A6AED",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, submit it!",
      cancelButtonText: "No, cancel",
    });

    if (result.isConfirmed) {
      if (!comments.trim()) {
        toast.error("Please add a description before submitting");
        return;
      }

      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const formData = new FormData();

        // existing fields (backend expects these)
        formData.append("file", file);     // PDF
        formData.append("image", image);   // image
        formData.append("comments", comments);
        formData.append("taskId", taskId);

        // new optional fields (safe – backend will just ignore until you add support)
        if (methods) formData.append("methods", methods);
        if (results) formData.append("results", results);
        if (challenges) formData.append("challenges", challenges);
        if (timeSpent) formData.append("timeSpent", timeSpent);
        if (githubLink) formData.append("githubLink", githubLink);
        if (externalLink) formData.append("externalLink", externalLink);
        if (selfEvaluation) formData.append("selfEvaluation", selfEvaluation);

        const response = await axios.post(`${baseUrl}/submitTask`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        const taskComplete = {
          status: status,
        };

        if (response.status === 201) {
          toast.success("Task submitted successfully!");
          axios
            .put(`${baseUrl}/task/update-task/${taskId}`, taskComplete, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
              console.log("Task status updated successfully:", response.data);
            })
            .catch((error) => {
              console.error("Error updating task status:", error);
            });
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      } catch (error) {
        console.error("Error submitting task:", error);
        if (error.response) {
          toast.error(
            `Server Error: ${error.response.data.message || "Please try again"}`
          );
        } else if (error.request) {
          toast.error(
            "No response from server. Please check your network connection."
          );
        } else {
          toast.error(`Error: ${error.message}`);
        }
      } finally {
        setLoading(false);
        setModalView(false);
        window.location.reload();
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    if (
      type === "file" &&
      droppedFile.type.match(
        "application/(pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document)"
      )
    ) {
      setFile(droppedFile);
    } else if (type === "image" && droppedFile.type.match("image.*")) {
      setImage(droppedFile);
    } else {
      toast.error(`Invalid file type for ${type} upload`);
    }
  };

  if (loading) {
    return (
      <Dialog open={true} onClose={() => {}} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-gray-500/75 dark:bg-slate-900/80" />
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel className="relative w-full max-w-lg rounded-nonelg bg-white dark:bg-slate-900 p-8 text-center shadow-xl dark:shadow-2xl dark:border dark:border-slate-700">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                <p className="text-xl font-semibold text-gray-900 dark:text-slate-100">
                  Submitting your task...
                </p>
                <p className="text-sm text-gray-500 dark:text-slate-300">
                  Please wait while we process your submission
                </p>
                <div className="mt-4 w-full bg-gray-200 dark:bg-slate-800 rounded-nonefull h-2">
                  <div className="bg-blue-600 h-2 rounded-nonefull animate-pulse"></div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75 dark:bg-slate-900/80" />
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-start justify-center pt-10 px-4 sm:pt-16 sm:px-6">
          <DialogPanel className="w-full max-w-3xl md:max-w-4xl rounded-nonexl bg-white dark:bg-slate-900 shadow-2xl dark:shadow-2xl dark:border dark:border-slate-700">
            <div className="max-h-[85vh] overflow-y-auto">
              {/* Header */}
              <div className="relative border-b border-gray-100 dark:border-slate-700 px-6 py-4">
                <button
                  onClick={() => setModalView(false)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:text-slate-400 dark:hover:text-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
                <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-slate-100">
                  Submit Your Task
                </DialogTitle>
                <p className="mt-1 text-sm text-gray-500 dark:text-slate-300">
                  Provide a brief summary, upload your report or artefacts, and
                  share links to your work.
                </p>
              </div>

              {/* Content */}
              <div className="px-6 py-6 space-y-8">
                {/* Top: description + meta */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    {/* Summary / Description (comments) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-200">
                        Summary of Work Done
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <textarea
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="Briefly describe what you did, your approach, and key outcomes..."
                        className="mt-2 block w-full rounded-none border border-gray-300 dark:border-slate-700 px-4 py-3 text-sm placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:text-slate-100"
                        rows={4}
                      />
                      {!comments.trim() && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Description is required
                        </p>
                      )}
                    </div>

                    {/* Methods & Results */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-200">
                          Methods / Approach
                        </label>
                        <textarea
                          value={methods}
                          onChange={(e) => setMethods(e.target.value)}
                          placeholder="Tools, libraries, methodologies, datasets..."
                          className="mt-2 block w-full rounded-none border border-gray-300 dark:border-slate-700 px-3 py-2 text-sm placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:text-slate-100"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-200">
                          Key Results / Findings
                        </label>
                        <textarea
                          value={results}
                          onChange={(e) => setResults(e.target.value)}
                          placeholder="What did you observe or conclude?"
                          className="mt-2 block w-full rounded-none border border-gray-300 dark:border-slate-700 px-3 py-2 text-sm placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:text-slate-100"
                          rows={3}
                        />
                      </div>
                    </div>

                    {/* Challenges */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-200">
                        Challenges / Roadblocks (optional)
                      </label>
                      <textarea
                        value={challenges}
                        onChange={(e) => setChallenges(e.target.value)}
                        placeholder="Mention any blockers, data issues, or dependencies..."
                        className="mt-2 block w-full rounded-none border border-gray-300 dark:border-slate-700 px-3 py-2 text-sm placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:text-slate-100"
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Right column: simple meta fields */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-200">
                        Time Spent
                      </label>
                      <input
                        type="text"
                        value={timeSpent}
                        onChange={(e) => setTimeSpent(e.target.value)}
                        placeholder="e.g. 5 hours, 2 days"
                        className="mt-2 block w-full rounded-none border border-gray-300 dark:border-slate-700 px-3 py-2 text-sm placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:text-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-200">
                        Task Status
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="mt-2 block w-full rounded-none border border-gray-300 dark:border-slate-700 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:text-slate-100"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_review">In Review</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-200">
                        Self Evaluation
                      </label>
                      <select
                        value={selfEvaluation}
                        onChange={(e) => setSelfEvaluation(e.target.value)}
                        className="mt-2 block w-full rounded-none border border-gray-300 dark:border-slate-700 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:text-slate-100"
                      >
                        <option value="">Select</option>
                        <option value="needs_improvement">Needs Improvement</option>
                        <option value="satisfactory">Satisfactory</option>
                        <option value="good">Good</option>
                        <option value="excellent">Excellent</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Attachments & Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* PDF upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-200">
                      Upload PDF Report
                    </label>
                    <div
                      onDragEnter={(e) => handleDrag(e)}
                      onDragLeave={(e) => handleDrag(e)}
                      onDragOver={(e) => handleDrag(e)}
                      onDrop={(e) => handleDrop(e, "file")}
                      className={`mt-2 flex flex-col justify-center rounded-nonelg border-2 border-dashed p-5 ${
                        dragActive
                          ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-slate-900/60"
                          : "border-gray-300 dark:border-slate-600 dark:bg-slate-900"
                      }`}
                    >
                      <div className="flex flex-col items-center text-center space-y-2">
                        <FileText className="mx-auto h-10 w-10 text-gray-400 dark:text-slate-400" />
                        <div className="flex flex-col text-sm leading-6 text-gray-600 dark:text-slate-300">
                          <label className="relative cursor-pointer rounded-nonemd bg-white dark:bg-slate-800 font-semibold text-blue-600 dark:text-blue-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500 dark:hover:text-blue-300 px-3 py-2">
                            <span>Select PDF</span>
                            <input
                              type="file"
                              accept="application/pdf"
                              onChange={(e) => setFile(e.target.files[0])}
                              className="sr-only"
                            />
                          </label>
                          <span className="text-xs mt-1">
                            or drag and drop PDF (max 10MB)
                          </span>
                        </div>
                        <p className="text-xs leading-5 text-gray-600 dark:text-slate-400">
                          Ideal for reports, literature reviews, or detailed write-ups.
                        </p>
                        {file && (
                          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-slate-300">
                            <FileText className="h-4 w-4" />
                            <span className="truncate max-w-[180px]">
                              {file.name}
                            </span>
                            <button
                              onClick={() => setFile(null)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Image upload (already existed) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-200">
                      Upload Image (graphs, screenshots)
                    </label>
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={(e) => handleDrop(e, "image")}
                      className={`mt-2 flex justify-center rounded-nonelg border-2 border-dashed p-5 ${
                        dragActive
                          ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-slate-900/60"
                          : "border-gray-300 dark:border-slate-600 dark:bg-slate-900"
                      }`}
                    >
                      <div className="text-center">
                        <ImageIcon className="mx-auto h-10 w-10 text-gray-400 dark:text-slate-400" />
                        <div className="mt-3 flex flex-col text-sm leading-6 text-gray-600 dark:text-slate-300 items-center">
                          <label className="relative cursor-pointer rounded-nonemd bg-white dark:bg-slate-800 font-semibold text-blue-600 dark:text-blue-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500 dark:hover:text-blue-300 px-3 py-2">
                            <span>Upload an image</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => setImage(e.target.files[0])}
                              className="sr-only"
                            />
                          </label>
                          <p className="pl-1 text-xs mt-1">
                            or drag and drop
                          </p>
                        </div>
                        <p className="text-xs leading-5 text-gray-600 dark:text-slate-400">
                          PNG, JPG, GIF up to 5MB
                        </p>
                        {image && (
                          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-slate-300">
                            <ImageIcon className="h-4 w-4" />
                            <span className="truncate max-w-[180px]">
                              {image.name}
                            </span>
                            <button
                              onClick={() => setImage(null)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-200">
                      GitHub / Repo URL
                    </label>
                    <input
                      type="url"
                      value={githubLink}
                      onChange={(e) => setGithubLink(e.target.value)}
                      placeholder="https://github.com/..."
                      className="mt-2 block w-full rounded-none border border-gray-300 dark:border-slate-700 px-3 py-2 text-sm placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-200">
                      External Link (Drive, Overleaf, Notion, etc.)
                    </label>
                    <input
                      type="url"
                      value={externalLink}
                      onChange={(e) => setExternalLink(e.target.value)}
                      placeholder="https://drive.google.com/..."
                      className="mt-2 block w-full rounded-none border border-gray-300 dark:border-slate-700 px-3 py-2 text-sm placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-gray-50 dark:bg-slate-900/95 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-noneb-lg border-t border-gray-200 dark:border-slate-700">
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  Required fields: summary. PDFs/images/links are recommended
                  for detailed research tasks.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setModalView(false)}
                    className="rounded-nonemd px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus:ring-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!comments.trim()}
                    className="rounded-nonemd bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-500 dark:focus:ring-blue-500 dark:focus:ring-offset-slate-900"
                  >
                    Submit Task
                  </button>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}