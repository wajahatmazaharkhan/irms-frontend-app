import { CheckCircle, BookOpen, Clock, AlertCircle, Loader } from "lucide-react";

export function BatchModal({ isOpen, onClose, batch, type, loading }) {
  if (!isOpen || !batch) return null;

  const formatDatee = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString();
  };

  const getStatusFromDates = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return "Upcoming";
    if (now > end) return "Completed";
    return "Active";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Active": return <CheckCircle className="w-4 h-4" />;
      case "Completed": return <BookOpen className="w-4 h-4" />;
      case "Upcoming": return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-none2xl p-8 max-w-md w-full text-center">
          <Loader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading batch details...</p>
        </div>
      </div>
    );
  }

  return type === "simple" ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-none2xl p-6 max-w-xl w-full shadow-2xl border border-blue-200 relative transition-all">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-blue-400 hover:text-blue-600 text-lg font-bold transition"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-blue-700 mb-6 border-b pb-2 border-blue-100">
          {batch?.batchName ?? "Batch Details"}
        </h2>

        <div className="text-blue-900 text-sm space-y-4">
          <p>
            <strong className="text-blue-600">Name:</strong> {batch?.name ?? "N/A"}
          </p>
          <p>
            <strong className="text-blue-600">Status:</strong>{" "}
            {getStatusFromDates(batch?.startDate, batch?.endDate)}
          </p>
          <p>
            <strong className="text-blue-600">Start Date:</strong>{" "}
            {formatDatee(batch?.startDate)}
          </p>
          <p>
            <strong className="text-blue-600">End Date:</strong>{" "}
            {formatDatee(batch?.endDate)}
          </p>

          <div>
            <strong className="text-blue-600">Interns:</strong>
            <div className="flex flex-wrap gap-2 mt-2">
              {Array.isArray(batch?.interns) && batch.interns.length > 0 ? (
                batch.interns.map((intern) => (
                  <span
                    key={intern._id}
                    className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-nonefull text-sm font-medium"
                  >
                    {intern.name}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">N/A</span>
              )}
            </div>
          </div>

          <div>
            <strong className="text-blue-600">HR Personnel:</strong>
            <div className="flex flex-wrap gap-2 mt-2">
              {Array.isArray(batch?.hr) && batch.hr.length > 0 ? (
                batch.hr.map((entry) => (
                  <span
                    key={entry._id}
                    className="bg-blue-100 text-blue-800 border border-blue-300 px-3 py-1 rounded-nonefull text-sm font-medium"
                  >
                    {entry.hrId?.name || "Unknown"}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">N/A</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn">
      <div className="bg-gradient-to-br from-white via-indigo-50 to-purple-100 rounded-none2xl p-6 max-w-4xl w-full shadow-2xl border border-indigo-200 relative overflow-y-auto max-h-[90vh] transform scale-95 animate-zoomIn transition-transform duration-300">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-rose-500 text-xl transition-colors"
        >
          ✕
        </button>

        <h2 className="text-3xl font-bold text-indigo-800 mb-6 border-b border-indigo-200 pb-3">
          {batch?.name || "Batch Details"}
        </h2>

        <div className="text-gray-900 space-y-6 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-indigo-50 p-4 rounded-nonelg shadow-inner">
            <p>
              <span className="font-semibold text-indigo-700">Status:</span>{" "}
              <span className="text-indigo-900">
                {getStatusFromDates(batch.startDate, batch.EndDate)}
              </span>
            </p>
            <p>
              <span className="font-semibold text-indigo-700">Start Date:</span>{" "}
              {formatDatee(batch.startDate)}
            </p>
            <p>
              <span className="font-semibold text-indigo-700">End Date:</span>{" "}
              {formatDatee(batch.endDate)}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-purple-700 mb-1">
              👨‍🎓 Interns
            </h3>
            <ul className="list-disc ml-6 text-gray-800 space-y-1">
              {Array.isArray(batch.interns) && batch.interns.length > 0 ? (
                batch.interns.map((intern, idx) => (
                  <li key={intern._id || idx}>
                    <span className="font-medium">{intern.name}</span>
                    <span className="text-gray-500"> ({intern.email})</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No interns assigned.</li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-pink-700 mb-1">
              🧑‍💼 HR Personnel
            </h3>
            <ul className="list-disc ml-6 text-gray-800 space-y-1">
              {Array.isArray(batch.hr) && batch.hr.length > 0 ? (
                batch.hr.map((hrEntry, idx) => (
                  <li key={hrEntry._id || idx}>
                    <span className="font-medium">
                      {hrEntry?.hrId?.name || "Unknown"}
                    </span>
                    <span className="text-gray-500">
                      ({hrEntry?.hrId?.email})
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No HR assigned.</li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-emerald-700 mb-2">
              📋 Tasks ({batch.tasks?.length || 0})
            </h3>
            
            {batch.tasks?.length > 0 ? (
              <div className="space-y-4">
                {batch.tasks.map((task) => {
                  const taskDetails = task.details || {};
                  const assignedIntern = batch.interns?.find(
                    intern => intern._id === task.assignedTo
                  ) || { name: 'Unassigned', email: '' };

                  return (
                    <div key={task._id} className="border border-emerald-200 rounded-nonelg p-4 bg-white">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-semibold text-gray-800">
                          {taskDetails.title || `Task ${task._id}`}
                        </h4>
                        <span className={`px-2 py-1 text-xs rounded-nonefull ${
                          taskDetails.status === 'completed' ? 'bg-green-100 text-green-800' :
                          taskDetails.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {taskDetails.status || 'not started'}
                        </span>
                      </div>

                      {taskDetails.description && (
                        <p className="text-sm text-gray-600 mb-3">
                          {taskDetails.description}
                        </p>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-gray-500">Assigned to</p>
                          <p className="font-medium">{assignedIntern.name}</p>
                        </div>
                        
                        {taskDetails.startDate && (
                          <div>
                            <p className="text-xs text-gray-500">Start Date</p>
                            <p className="font-medium">
                              {new Date(taskDetails.startDate).toLocaleDateString()}
                            </p>
                          </div>
                        )}

                        {taskDetails.endDate && (
                          <div>
                            <p className="text-xs text-gray-500">Due Date</p>
                            <p className="font-medium">
                              {new Date(taskDetails.endDate).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 py-4 text-center">No tasks assigned to this batch</p>
            )}
          </div>

          <div>
            <h3 className="text-xl font-semibold text-indigo-600 mb-2">
              📊 Progress
            </h3>
            {batch.completedTasks !== undefined && batch.allTasks > 0 ? (
              <div>
                <p className="mb-1 text-sm text-gray-700">
                  {batch.completedTasks} / {batch.allTasks} Tasks Completed
                </p>
                <div className="w-full bg-indigo-100 rounded-nonefull h-3">
                  <div
                    className="bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 h-3 rounded-nonefull transition-all duration-300"
                    style={{
                      width: `${Math.round(
                        (batch.completedTasks / batch.allTasks) * 100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No progress data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}