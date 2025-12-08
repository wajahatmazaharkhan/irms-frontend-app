import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomNavbar from "./CustomHrNavbar";
import useTitle from "@/Components/useTitle";

const Internleaveapplication = () => {
  useTitle('Leave Management')
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [status, setStatus] = useState("");
  const [adminName, setAdminName] = useState("");
  const [message, setMessage] = useState({text:"",type:""})
  const [loading, setLoading] = useState(true); 
  
  const Loader = () => (
	  <div className="flex justify-center items-center py-20">
		<div className="animate-spin rounded-nonefull h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
	  </div>
	);

useEffect(() => {
  const fetchData = async () => {
    try {
      // Get current HR's user ID from localStorage
      const userId = localStorage.getItem("userId");
      setLoading(true);
      // Fetch batches to get HR's interns
      const batchesResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/batch/get-ids`);
      const hrBatch = batchesResponse.data.data.find(batch => 
        batch.hr.some(hr => hr._id === userId)
      );
      
      const internIds = hrBatch?.interns.map(intern => intern._id) || [];
      
      // Fetch all leaves
      const leavesResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/leave`);
      
      // Filter leaves to show only HR's batch interns
      const filtered = leavesResponse.data.leaves.filter(leave => 
        leave.internid && internIds.includes(leave.internid._id)
      );
      
      setFilteredLeaves(filtered); // Only keep the filtered leaves
    } catch (error) {
      console.log("Error fetching data:", error);
    }
    finally{
      setLoading(false);
    }
  };
  
  fetchData();
}, []);

  const handleUpdateStatus = async () => {
    if (!selectedLeave || !status || !adminName) {
      setMessage({text:"Please fill out all fields before submitting.",type:"error"})
      return;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/leave/${selectedLeave._id}`,
        { status, updatedBy: adminName }
      );
      setMessage({text:"Status updated successfully",type:"success"})
      
      // Update the filtered leaves list
      setFilteredLeaves(prev => prev.map(leave => 
        leave._id === selectedLeave._id 
          ? {...leave, status, updatedBy: adminName} 
          : leave
      ));
      
      setSelectedLeave(null);
      setStatus("");
      setAdminName("");
    } catch (error) {
      console.log("Error updating status:", error);
      setMessage({text:"Failed to update status. Please try again",type:'error'})
    }
  };

return (
  <>
    <CustomNavbar />
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">All Leave Applications</h1>
        
        {message.text && (
          <div className={`mb-6 p-3 rounded-nonelg text-center ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            {message.text}
          </div>
        )}

        {loading ? (
          <Loader />
        ) : (
          <div className="space-y-6">
            {/* Pending Leaves */}
            <div className="bg-white rounded-nonexl shadow-md overflow-hidden">
              <div className="bg-yellow-100 px-6 py-3 border-b border-yellow-200">
                <h2 className="text-lg font-semibold text-yellow-800 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Pending Applications ({filteredLeaves.filter(l => l.status === 'Pending').length})
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {filteredLeaves
                  .filter(leave => leave.status === 'Pending')
                  .map((leave) => (
                    <div key={leave._id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="mb-4 sm:mb-0">
                          <h3 className="text-lg font-medium text-gray-900">{leave.internid?.name || "Deleted user"}</h3>
                          <div className="mt-1 flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-nonefull">
                              {leave.leaveType}
                            </span>
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-nonefull">
                              {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="mt-2 text-gray-600">{leave.reason || "No reason provided"}</p>
                        </div>
                        <button
                          onClick={() => setSelectedLeave(leave)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-nonemd shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Review Application
                        </button>
                      </div>
                    </div>
                  ))}
                {filteredLeaves.filter(l => l.status === 'Pending').length === 0 && (
                  <div className="p-6 text-center text-gray-500">
                    No pending leave applications
                  </div>
                )}
              </div>
            </div>

            {/* Approved Leaves */}
            <div className="bg-white rounded-nonexl shadow-md overflow-hidden">
              <div className="bg-green-100 px-6 py-3 border-b border-green-200">
                <h2 className="text-lg font-semibold text-green-800 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Approved Leaves ({filteredLeaves.filter(l => l.status === 'Approved').length})
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {filteredLeaves
                  .filter(leave => leave.status === 'Approved')
                  .map((leave) => (
                    <div key={leave._id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="mb-4 sm:mb-0">
                          <h3 className="text-lg font-medium text-gray-900">{leave.internid?.name || "Deleted user"}</h3>
                          <div className="mt-1 flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-nonefull">
                              {leave.leaveType}
                            </span>
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-nonefull">
                              {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="mt-2 text-gray-600">{leave.reason || "No reason provided"}</p>
                          {leave.updatedBy && (
                            <p className="mt-1 text-sm text-gray-500">Approved by: {leave.updatedBy}</p>
                          )}
                        </div>
                        <div className="flex items-center">
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-nonefull">
                            Approved
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                {filteredLeaves.filter(l => l.status === 'Approved').length === 0 && (
                  <div className="p-6 text-center text-gray-500">
                    No approved leave applications
                  </div>
                )}
              </div>
            </div>

            {/* Rejected Leaves */}
            <div className="bg-white rounded-nonexl shadow-md overflow-hidden">
              <div className="bg-red-100 px-6 py-3 border-b border-red-200">
                <h2 className="text-lg font-semibold text-red-800 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Rejected Leaves ({filteredLeaves.filter(l => l.status === 'Rejected').length})
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {filteredLeaves
                  .filter(leave => leave.status === 'Rejected')
                  .map((leave) => (
                    <div key={leave._id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="mb-4 sm:mb-0">
                          <h3 className="text-lg font-medium text-gray-900">{leave.internid?.name || "Deleted user"}</h3>
                          <div className="mt-1 flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-nonefull">
                              {leave.leaveType}
                            </span>
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-nonefull">
                              {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="mt-2 text-gray-600">{leave.reason || "No reason provided"}</p>
                          {leave.updatedBy && (
                            <p className="mt-1 text-sm text-gray-500">Rejected by: {leave.updatedBy}</p>
                          )}
                        </div>
                        <div className="flex items-center">
                          <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-nonefull">
                            Rejected
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                {filteredLeaves.filter(l => l.status === 'Rejected').length === 0 && (
                  <div className="p-6 text-center text-gray-500">
                    No rejected leave applications
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Status Update Modal */}
        {selectedLeave && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-nonexl shadow-xl w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Update Leave Status</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-700"><span className="font-medium">Intern:</span> {selectedLeave.internid?.name || "Deleted user"}</p>
                  <p className="text-gray-700"><span className="font-medium">Dates:</span> {new Date(selectedLeave.startDate).toLocaleDateString()} - {new Date(selectedLeave.endDate).toLocaleDateString()}</p>
                  <p className="text-gray-700"><span className="font-medium">Reason:</span> {selectedLeave.reason || "No reason provided"}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-nonemd shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="">Select Status</option>
                    <option value="Approved">Approve</option>
                    <option value="Rejected">Reject</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-nonemd shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    onClick={() => {
                      setSelectedLeave(null);
                      setAdminName("");
                      setStatus("");
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-nonemd shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateStatus}
                    className="px-4 py-2 border border-transparent rounded-nonemd shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Update Status
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </>
);
};

export default Internleaveapplication;