import { Calendar, Users, UserCheck, CheckCircle, Eye, Edit3, Trash2, Loader } from "lucide-react";
import { getStatusColor, getStatusIcon } from "@/lib/batchUtils";
import { useState, useEffect } from "react";

export function BatchCard({
  batch,
  handleView,
  handleEditClick,
  handleDeleteBatch,
  deleteLoading,
  viewLoading,
  editLoading,
}) {
  const [hideActions, setHideActions] = useState(true);

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin") === "true" || localStorage.getItem("role") === "hrHead";
    setHideActions(!isAdmin);
  }, []);

  return (
    <div className="bg-white rounded-nonexl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300 relative">
      {/* Loading Overlay */}
      {(viewLoading || editLoading || deleteLoading) && (
        <div className="absolute inset-0 bg-white bg-opacity-70 rounded-nonexl z-10 flex items-center justify-center">
          <Loader className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {batch.batchName}
          </h3>
          <div
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-nonefull text-sm font-medium border ${getStatusColor(
              batch.status
            )}`}
          >
            {getStatusIcon(batch.status)}
            {batch.status}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-nonelg transition-colors"
            onClick={() => handleView(batch.id, "simple")}
            disabled={viewLoading === batch.id}
          >
            {viewLoading === batch.id ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>

          {!hideActions && (
            <>
              <button
                className="p-2 text-green-600 hover:bg-green-50 rounded-nonelg transition-colors"
                onClick={() => handleEditClick(batch)}
                disabled={editLoading === batch.id}
              >
                {editLoading === batch.id ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Edit3 className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={() => handleDeleteBatch(batch.id, batch.batchName)}
                disabled={deleteLoading === batch.id}
                className="p-2 text-red-600 hover:bg-red-50 rounded-nonelg transition-colors disabled:opacity-50"
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
          <span className="text-sm font-medium text-gray-600">Progress</span>
          <span className="text-sm font-medium text-gray-800">
            {batch.progress}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-nonefull h-2">
          <div
            className="bg-blue-600 h-2 rounded-nonefull transition-all duration-300"
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
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-nonemd"
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
          disabled={viewLoading === batch.id}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-nonelg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium disabled:opacity-70"
        >
          {viewLoading === batch.id ? (
            <Loader className="w-4 h-4 animate-spin mx-auto" />
          ) : (
            "View Details"
          )}
        </button>
      </div>
    </div>
  );
}