import { TrendingUp, CheckCircle, Calendar, AlertCircle } from "lucide-react";
import { batchService } from "@/services/batchService";

export const getStatusIcon = (status) => {
  switch (status.toLowerCase()) {
    case "ongoing":
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    case "completed":
      return <CheckCircle className="w-4 h-4 text-blue-600" />;
    case "upcoming":
      return <Calendar className="w-4 h-4 text-orange-600" />;
    default:
      return <AlertCircle className="w-4 h-4 text-gray-600" />;
  }
};

export const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "ongoing":
      return "border-green-200 bg-green-50 text-green-700";
    case "completed":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "upcoming":
      return "border-orange-200 bg-orange-50 text-orange-700";
    default:
      return "border-gray-200 bg-gray-50 text-gray-700";
  }
};

export const getMatchingBatchedByUserId = async ({ userId }) => {
  try {
    const batchIds = await batchService.fetchBatchIds();

    // Filter data where HR is assigned
    const userBatches = batchIds.data.filter((item) =>
      item.hr.some((hrMember) => hrMember._id === userId)
    );

    if (userBatches.length === 0) {
      return {
        hrBatchIds: [],
        filteredData: [],
      };
    }

    // Extract batch IDs
    const hrBatchIds = userBatches.map((item) => item._id);
    
    return hrBatchIds

  } catch (error) {
    console.error(`Error filtering data: ${error}`);
  }
};
