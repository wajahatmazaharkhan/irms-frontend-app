export const BatchDetails = ({ batch, onClose }) => {
    if (!batch) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">{batch.batchName}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-medium text-gray-700">Duration</h3>
                            <p>{batch.startDate} - {batch.endDate}</p>
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-700">Status</h3>
                            <p>{batch.status}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-medium text-gray-700 mb-2">Progress</h3>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-blue-600 h-2.5 rounded-full"
                                style={{ width: `${batch.progress}%` }}
                            ></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{batch.progress}% Complete</p>
                    </div>

                    <div>
                        <h3 className="font-medium text-gray-700 mb-2">Task Completion</h3>
                        <p>{batch.completedInterns} tasks completed</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-medium text-gray-700">Total Interns</h3>
                            <p>{batch.totalInterns}</p>
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-700">Total HR</h3>
                            <p>{batch.totalHR}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
