import { X, Save, Loader } from "lucide-react";

export function BatchForm({
  isOpen,
  onClose,
  formData,
  setFormData,
  handleInputChange,
  handleMultiSelectChange,
  availableInterns,
  availableHR,
  usersLoading,
  isEditing,
  editBatchId,
  formLoading,
  handleCreateBatch,
  handleUpdateBatch
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-nonexl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {isEditing ? "Edit Batch" : "Create New Batch"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-nonelg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {usersLoading ? (
            <div className="text-center py-8">
              <Loader className="w-8 h-8 text-blue-600 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">Loading users...</p>
            </div>
          ) : (
            <form
              onSubmit={isEditing ? handleUpdateBatch : handleCreateBatch}
              className="space-y-6"
            >
              {/* Batch Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Batch Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Web Dev Internship Batch 2025"
                  className="w-full px-4 py-2 border border-gray-300 rounded-nonelg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-nonelg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-nonelg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Interns Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Interns *
                </label>
                {
                  console.log(availableInterns)
                }
                {availableInterns.length === 0 ? (
                  <div className="border border-gray-300 rounded-nonelg p-4 text-center text-gray-500">
                    No interns available. Make sure users with "intern" role
                    exist in the system.
                  </div>
                ) : (
                  <div className="border border-gray-300 rounded-nonelg p-4 max-h-40 overflow-y-auto">
                    {availableInterns.map((intern) => (
                      <div
                        key={intern.id}
                        className="flex items-center mb-2"
                      >
                        <input
                          type="checkbox"
                          id={`intern-${intern.id}`}
                          checked={formData.interns.includes(intern.id)}
                          onChange={() =>
                            handleMultiSelectChange("interns", intern.id)
                          }
                          className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`intern-${intern.id}`}
                          className="text-sm text-gray-700 flex-1"
                        >
                          <span className="font-medium">{intern.name}</span>
                          <span className="text-gray-500 ml-2">
                            ({intern.email})
                          </span>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded ml-2">
                            {intern.role}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Selected: {formData.interns.length} intern(s)
                </p>
              </div>

              {/* HR Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select HR Personnel *
                </label>
                {availableHR.length === 0 ? (
                  <div className="border border-gray-300 rounded-nonelg p-4 text-center text-gray-500">
                    No HR personnel available. Make sure users with "hr" role exist in the system.
                  </div>
                ) : (
                  <div className="border border-gray-300 rounded-nonelg p-4 max-h-40 overflow-y-auto">
                    {availableHR.map((hr) => {
                      const isChecked = formData.hr.includes(hr.id);
                      return (
                        <div key={hr.id} className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id={`hr-${hr.id}`}
                            checked={isChecked}
                            onChange={() => handleMultiSelectChange("hr", hr.id)}
                            className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`hr-${hr.id}`}
                            className="text-sm text-gray-700 flex-1"
                          >
                            <span className="font-medium">{hr.name}</span>
                            <span className="text-gray-500 ml-2">({hr.email})</span>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded ml-2">
                              {hr.role}
                            </span>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Selected: {formData.hr.length} HR personnel
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-nonelg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    formLoading ||
                    availableInterns.length === 0 ||
                    availableHR.length === 0
                  }
                  className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-nonelg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formLoading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      {isEditing ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {isEditing ? "Update Batch" : "Create Batch"}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}