import React, { useState } from "react";
import {
  Bell,
  Send,
  MessageSquare,
  AlertCircle,
  Users,
  CheckCircle,
} from "lucide-react";
import Swal from "sweetalert2";
import CustomNavbar from "./CustomNavbar";
import useTitle from "@/Components/useTitle";

const AdminNotify = () => {
  useTitle("Notification Management");

  const [formData, setFormData] = useState({
    status: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const statusOptions = [
    {
      value: "urgent",
      label: "Urgent",
      color: "text-red-600",
      bgColor: "bg-red-50 border-red-200",
    },
    {
      value: "important",
      label: "Important",
      color: "text-orange-600",
      bgColor: "bg-orange-50 border-orange-200",
    },
    {
      value: "info",
      label: "Information",
      color: "text-blue-600",
      bgColor: "bg-blue-50 border-blue-200",
    },
    {
      value: "reminder",
      label: "Reminder",
      color: "text-green-600",
      bgColor: "bg-green-50 border-green-200",
    },
  ];

  const handleSendNotification = async () => {
    if (!formData.status || !formData.message) {
      Swal.fire({
        icon: "error",
        title: "Required Fields Missing",
        text: "Please fill in all fields",
        confirmButtonColor: "#3B82F6",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/send/notify-all`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Notification sent successfully to all users",
          timer: 2000,
          showConfirmButton: false,
          confirmButtonColor: "#3B82F6",
        });
        setFormData({ status: "", message: "" });
      } else {
        throw new Error("Failed to send notification");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to send notification. Please try again.",
        confirmButtonColor: "#3B82F6",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedStatus = statusOptions.find(
    (option) => option.value === formData.status
  );

  return (
    <>
      <CustomNavbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-nonefull">
                <Bell className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Notification Center
            </h1>
            <p className="text-gray-600 text-lg">
              Send important notifications to all system users
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-nonexl shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Total Recipients
                  </p>
                  <p className="text-2xl font-bold text-blue-600">All Users</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white rounded-nonexl shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Delivery Status
                  </p>
                  <p className="text-2xl font-bold text-green-600">Instant</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white rounded-nonexl shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Notification Type
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    Broadcast
                  </p>
                </div>
                <MessageSquare className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Main Form */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-nonexl shadow-xl border border-gray-200 overflow-hidden">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                <div className="flex items-center space-x-3">
                  <Send className="w-6 h-6 text-white" />
                  <h2 className="text-2xl font-bold text-white">
                    Compose Notification
                  </h2>
                </div>
                <p className="text-blue-100 mt-2">
                  Create and send notifications to all registered users
                </p>
              </div>

              {/* Form Content */}
              <div className="p-8 space-y-8">
                {/* Status Selection */}
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-4">
                    <AlertCircle className="w-5 h-5 inline mr-2" />
                    Notification Priority
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statusOptions.map((option) => (
                      <div
                        key={option.value}
                        onClick={() =>
                          setFormData({ ...formData, status: option.value })
                        }
                        className={`p-4 rounded-nonelg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                          formData.status === option.value
                            ? `${option.bgColor} border-current ${option.color} shadow-md`
                            : "bg-gray-50 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="text-center">
                          <div
                            className={`text-lg font-semibold ${
                              formData.status === option.value
                                ? option.color
                                : "text-gray-700"
                            }`}
                          >
                            {option.label}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {selectedStatus && (
                    <div
                      className={`mt-3 p-3 rounded-nonelg ${selectedStatus.bgColor} border`}
                    >
                      <p
                        className={`text-sm ${selectedStatus.color} font-medium`}
                      >
                        Priority Level: {selectedStatus.label}
                      </p>
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-4">
                    <MessageSquare className="w-5 h-5 inline mr-2" />
                    Message Content
                  </label>
                  <div className="relative">
                    <textarea
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full p-4 border-2 border-gray-200 rounded-nonelg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                      rows="8"
                      placeholder="Type your notification message here... 

This message will be sent to all registered users in the system. Please ensure your message is clear and professional."
                    />
                    <div className="absolute bottom-3 right-3 text-sm text-gray-400">
                      {formData.message.length} characters
                    </div>
                  </div>
                </div>

                {/* Preview Section */}
                {(formData.status || formData.message) && (
                  <div className="bg-gray-50 rounded-nonelg p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                      Preview
                    </h3>
                    <div className="bg-white rounded-nonelg p-4 border border-gray-200 shadow-sm">
                      {formData.status && (
                        <div
                          className={`inline-block px-3 py-1 rounded-nonefull text-sm font-medium mb-3 ${
                            selectedStatus
                              ? `${selectedStatus.bgColor} ${selectedStatus.color} border`
                              : ""
                          }`}
                        >
                          {selectedStatus?.label || formData.status}
                        </div>
                      )}
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {formData.message || "Your message will appear here..."}
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setFormData({ status: "", message: "" })}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-nonelg font-medium hover:bg-gray-50 transition-colors duration-200"
                    disabled={isLoading}
                  >
                    Clear Form
                  </button>
                  <button
                    onClick={handleSendNotification}
                    disabled={
                      isLoading || !formData.status || !formData.message
                    }
                    className={`flex items-center justify-center space-x-2 px-8 py-3 rounded-nonelg font-medium transition-all duration-200 ${
                      isLoading || !formData.status || !formData.message
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-nonefull animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send Notification</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="max-w-4xl mx-auto mt-8">
            <div className="bg-blue-50 rounded-nonexl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">
                📋 Notification Guidelines
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                <div>
                  <strong>Priority Levels:</strong>
                  <ul className="mt-1 space-y-1">
                    <li>
                      • <span className="text-red-600">Urgent:</span> Critical
                      system alerts
                    </li>
                    <li>
                      • <span className="text-orange-600">Important:</span>{" "}
                      Important updates
                    </li>
                  </ul>
                </div>
                <div>
                  <strong>Best Practices:</strong>
                  <ul className="mt-1 space-y-1">
                    <li>
                      • <span className="text-blue-600">Info:</span> General
                      information
                    </li>
                    <li>
                      • <span className="text-green-600">Reminder:</span> Gentle
                      reminders
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminNotify;
