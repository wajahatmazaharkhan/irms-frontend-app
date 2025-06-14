import {formatDate, getStatusFromDates} from "@/utils/dateUtils.js";

export const BatchDetails = ({ setIsModalOpen, selectedBatch }) => {

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-xl border border-gray-200 relative">
                <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                    {selectedBatch?.batchName ?? "Batch Details"}
                </h2>

                <div className="text-gray-600 text-sm space-y-2">
                    <p>
                        <strong>Name:</strong> {selectedBatch?.name ?? "N/A"}
                    </p>
                    <p>
                        <strong>Status:</strong>{" "}
                        {getStatusFromDates(
                            selectedBatch?.startDate,
                            selectedBatch?.EndDate
                        )}
                    </p>
                    <p>
                        <strong>Start Date:</strong>{" "}
                        {formatDate(selectedBatch?.startDate)}
                    </p>
                    <p>
                        <strong>End Date:</strong>{" "}
                        {formatDate(selectedBatch?.EndDate)}
                    </p>

                    <p>
                        <strong>Interns:</strong>{" "}
                        {Array.isArray(selectedBatch?.interns)
                            ? selectedBatch.interns.map((intern, idx) => (
                                <span key={intern._id || idx}>
                          {intern.name}
                                    {idx < selectedBatch.interns.length - 1 ? ", " : ""}
                        </span>
                            ))
                            : "N/A"}
                    </p>

                    <p>
                        <strong>HR Personnel:</strong>{" "}
                        {selectedBatch?.hr?.length ?? 0}
                    </p>
                </div>
            </div>
        </div>
    );
};
