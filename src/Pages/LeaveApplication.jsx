import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import {
  Calendar,
  Clock,
  FileText,
  Loader2,
  CheckCircle,
  XCircle,
  Clock3,
} from "lucide-react";
import { Navbar, Footer, useTitle } from "@/Components/compIndex";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const LeaveApplication = () => {
  useTitle("Leave Application");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const leaveTypes = [
    { value: "Sick Leave", label: "Sick Leave" },
    { value: "Personal Leave", label: "Personal Leave" },
    { value: "Vacation", label: "Vacation" },
    { value: "Other", label: "Other" },
  ];

  useEffect(() => {
    fetchLeaveHistory();
  }, []);

  const fetchLeaveHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/leave/mine`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLeaveHistory(response.data.leaves || []);
    } catch (error) {
      console.error("Error fetching leave history:", error);
    }
  };

  const validateForm = () => {
    if (!formData.leaveType) {
      toast.error("Please select a leave type");
      return false;
    }
    if (!formData.startDate) {
      toast.error("Please select a start date");
      return false;
    }
    if (!formData.endDate) {
      toast.error("Please select an end date");
      return false;
    }
    if (!formData.reason) {
      toast.error("Please provide a reason for leave");
      return false;
    }

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    if (end < start) {
      toast.error("End date cannot be before start date");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const loadingToast = toast.loading("Submitting leave application...");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${import.meta.env.VITE_BASE_URL}/leave`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.dismiss(loadingToast);
      toast.success("Leave application submitted successfully!");
      setFormData({
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
      });
      fetchLeaveHistory();
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(
        error.response?.data?.message || "Error submitting application"
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      Approved:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      Pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
      Rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
    };

    const icons = {
      Approved: <CheckCircle className="w-4 h-4 mr-1" />,
      Pending: <Clock3 className="w-4 h-4 mr-1" />,
      Rejected: <XCircle className="w-4 h-4 mr-1" />,
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide rounded-none ${styles[status] ||
          styles.Pending
          }`}
      >
        {icons[status] || icons.Pending}
        {status || "Pending"}
      </span>
    );
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  };

  return (
    <>
      <Navbar />
      <Toaster position="top-center" />

      <div className="relative min-h-screen ml-0 bg-gray-50 dark:bg-slate-950 md:ml-32">
        <div className="px-6 pt-6 pb-12">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* PAGE HEADER */}
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-none">
              <CardHeader className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex items-center justify-center bg-blue-100 dark:bg-blue-900/40 rounded-none border border-blue-200 dark:border-blue-800">
                      <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100 tracking-wide">
                        Leave Application
                      </CardTitle>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Submit a new leave request and view the status of your
                        previous applications.
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-6 text-xs text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Approved</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock3 className="w-4 h-4 text-yellow-600" />
                      <span>Pending</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span>Rejected</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="py-3">
                <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Processing time: 24–48 hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* MAIN CONTENT: FORM + TABLE */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* FORM */}
              <Card className="xl:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-none">
                <CardHeader className="border-b border-slate-200 dark:border-slate-800 pb-3">
                  <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    New Leave Request
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Leave type */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wide">
                        Leave Type <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={formData.leaveType}
                        onValueChange={(value) =>
                          setFormData({ ...formData, leaveType: value })
                        }
                      >
                        <SelectTrigger className="w-full h-10 text-sm bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-gray-100 rounded-none">
                          <SelectValue placeholder="Select leave type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-none">
                          {leaveTypes.map((type) => (
                            <SelectItem
                              key={type.value}
                              value={type.value}
                              className="text-sm dark:focus:bg-slate-800"
                            >
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Dates */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wide">
                        Duration <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[11px] text-gray-600 dark:text-gray-400">
                            Start Date
                          </span>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 dark:text-gray-500" />
                            <input
                              type="date"
                              value={formData.startDate}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  startDate: e.target.value,
                                })
                              }
                              className="w-full h-10 pl-9 pr-3 text-sm bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-gray-100 rounded-none outline-none"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[11px] text-gray-600 dark:text-gray-400">
                            End Date
                          </span>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 dark:text-gray-500" />
                            <input
                              type="date"
                              value={formData.endDate}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  endDate: e.target.value,
                                })
                              }
                              className="w-full h-10 pl-9 pr-3 text-sm bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-gray-100 rounded-none outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Reason */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wide">
                        Reason for Leave{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Textarea
                        value={formData.reason}
                        onChange={(e) =>
                          setFormData({ ...formData, reason: e.target.value })
                        }
                        placeholder="Enter a clear and concise reason for your leave request."
                        className="w-full min-h-[110px] text-sm bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 rounded-none"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate(-1)}
                        className="h-9 px-4 text-xs border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100 rounded-none"
                      >
                        Back
                      </Button>
                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            setFormData({
                              leaveType: "",
                              startDate: "",
                              endDate: "",
                              reason: "",
                            })
                          }
                          className="h-9 px-4 text-xs border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100 rounded-none"
                        >
                          Clear
                        </Button>
                        <Button
                          type="submit"
                          disabled={loading}
                          className="h-9 px-5 text-xs font-medium bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-none"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Submitting
                            </>
                          ) : (
                            "Submit Request"
                          )}
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* TABLE + INFO */}
              <div className="xl:col-span-2 space-y-6">
                {/* Leave History Table */}
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-none">
                  <CardHeader className="border-b border-slate-200 dark:border-slate-800 pb-3 flex flex-row items-center justify-between">
                    <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      Leave History
                    </CardTitle>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">
                      Total Requests: {leaveHistory.length}
                    </span>
                  </CardHeader>
                  <CardContent className="p-0">
                    {leaveHistory.length === 0 ? (
                      <div className="px-6 py-6 text-sm text-gray-500 dark:text-gray-400">
                        No leave records found. Submit a new request to see it
                        listed here.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead className="bg-gray-100 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 tracking-wide">
                                #
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 tracking-wide">
                                Type
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 tracking-wide">
                                Start Date
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 tracking-wide">
                                End Date
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 tracking-wide">
                                Status
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 tracking-wide">
                                Updated By
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {leaveHistory.map((leave, index) => (
                              <tr
                                key={leave._id || index}
                                className={
                                  index % 2 === 0
                                    ? "bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800"
                                    : "bg-gray-50 dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800"
                                }
                              >
                                <td className="px-4 py-3 text-xs text-gray-700 dark:text-gray-200">
                                  {index + 1}
                                </td>
                                <td className="px-4 py-3 text-xs text-gray-900 dark:text-gray-100">
                                  {leave.leaveType || "-"}
                                </td>
                                <td className="px-4 py-3 text-xs text-gray-700 dark:text-gray-300">
                                  {formatDate(leave.startDate)}
                                </td>
                                <td className="px-4 py-3 text-xs text-gray-700 dark:text-gray-300">
                                  {formatDate(leave.endDate)}
                                </td>
                                <td className="px-4 py-3">
                                  {getStatusBadge(leave.status)}
                                </td>
                                <td className="px-4 py-3 text-xs text-gray-700 dark:text-gray-300">
                                  {leave.updatedBy || "-"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Info Banner */}
                <Card className="bg-blue-50 border-blue-200 dark:bg-slate-900 dark:border-slate-700 shadow-sm rounded-none">
                  <CardContent className="px-4 py-3">
                    <div className="flex gap-3 items-start">
                      <Clock className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5" />
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                          Processing Information
                        </h3>
                        <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
                          Leave applications are typically processed within
                          24–48 hours. You will be notified once your request
                          has been approved or rejected. Please ensure your
                          contact details are up to date in your profile.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default LeaveApplication;
