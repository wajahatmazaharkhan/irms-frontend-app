import { Calendar, Users, UserCheck, CheckCircle, Eye, Edit3, Trash2, Loader } from "lucide-react";
import { getStatusColor, getStatusIcon } from "@/lib/batchUtils";
import { useState, useEffect } from "react";

export function BatchCard({ 
  batch, 
  handleView, 
  handleEditClick, 
  handleDeleteBatch, 
  deleteLoading,
}) {
	const [hideActions, setHideActions] = useState(true);
	useEffect(() => {
    // Check if user is admin from localStorage
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    setHideActions(!isAdmin); // Hide actions if not admin
  }, []);
	console.log("hideActions: ",hideActions);
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {batch.batchName}
          </h3>
          <div
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
              batch.status
            )}`}
          >
            {getStatusIcon(batch.status)}
            {batch.status}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            onClick={() => handleView(batch.id, "simple")}
          >
            <Eye className="w-4 h-4" />
          </button>
          
          {/* Only show edit/delete buttons if hideActions is false */}
          {!hideActions && (
            <>
              <button
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                onClick={() => handleEditClick(batch)}
              >
                <Edit3 className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleDeleteBatch(batch.id, batch.batchName)}
                disabled={deleteLoading === batch.id}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              >
                {deleteLoading === batch.id ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Rest of the component remains exactly the same */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          {batch.startDate} to {batch.endDate}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          {batch.totalInterns} Total Interns
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <UserCheck className="w-4 h-4" />
          {batch.totalHR} HR Personnel
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CheckCircle className="w-4 h-4" />
          {batch.completedInterns} Completed
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            Progress
          </span>
          <span className="text-sm font-medium text-gray-800">
            {batch.progress}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${batch.progress}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-medium">Month:</span> {batch.month}
        </p>
        {batch.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {batch.technologies.map((tech, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => handleView(batch.id, "deep")}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
        >
          View Details
        </button>
      </div>
    </div>
  );
}