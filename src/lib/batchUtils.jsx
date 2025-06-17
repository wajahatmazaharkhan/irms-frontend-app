import { CheckCircle, BookOpen, Clock, AlertCircle } from "lucide-react";
import { batchService } from "@/services/batchService";

export const formatDate = (dateString) => {
  return new Date(dateString).toISOString().split("T")[0];
};

export const formatMonth = (dateString) => {
  const date = new Date(dateString);
  return `${date.toLocaleDateString("en-US", {
    month: "long",
  })} ${date.getFullYear()}`;
};

export const getStatusFromDates = (startDate, endDate) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) {
    return "Upcoming";
  } else if (now > end) {
    return "Completed";
  } else {
    return "Active";
  }
};

export const getStatusColor = (status) => {
  switch (
    status.toLowerCase() // Convert to lowercase for case-insensitive comparison
  ) {
    case "active":
      return "bg-green-100 text-green-800 border-green-200";
    case "completed":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "upcoming":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const getStatusIcon = (status) => {
  switch (
    status.toLowerCase() // Convert to lowercase for case-insensitive comparison
  ) {
    case "active":
      return <CheckCircle className="w-4 h-4" />;
    case "completed":
      return <BookOpen className="w-4 h-4" />;
    case "upcoming":
      return <Clock className="w-4 h-4" />;
    default:
      return <AlertCircle className="w-4 h-4" />;
  }
};

export const getMatchingBatchedByUserId = async ({ userId }) => {
  try {
    const batchIds = await batchService.fetchBatchIds();

    // Filter data where HR is assigned
    const userBatches = batchIds.data.filter((item) =>
      item.hr.some((hrMember) => hrMember._id === userId)
    );

    // Extract batch IDs - returns empty array if no matches
    return userBatches.map((item) => item._id);
  } catch (error) {
    console.error(`Error filtering data: ${error}`);
    return []; // Return empty array instead of undefined
  }
};