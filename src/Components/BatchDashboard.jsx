import React, { useState, useEffect } from 'react';
import { Users, Calendar, BookOpen, Star, TrendingUp, Award } from 'lucide-react';
import { Navbar, SideNav, Wrapper, useTitle } from "@/Components/compIndex";

const BatchDashboard = () => {
  useTitle('My Batch');
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tasksWithDetails, setTasksWithDetails] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
	const fetchBatchData = async () => {
	  try {
		setLoading(true);
		
		// Step 1: Get userId from localStorage
		const userId = localStorage.getItem("userId");
		if (!userId) {
		  throw new Error("User ID not found in localStorage");
		}

		// Step 2: Fetch user data to get batch ID
		const usersResponse = await fetch(`${baseUrl}/allusers`);
		if (!usersResponse.ok) {
		  throw new Error('Failed to fetch user data');
		}
		const usersData = await usersResponse.json();
		
		const currentUser = usersData.data.find(user => user._id === userId);
		if (!currentUser) {
		  throw new Error('User not found');
		}
		
		const batchId = currentUser.batch;
		if (!batchId) {
		  // Instead of throwing an error, we'll set a special state
		  setError('NO_BATCH_ASSIGNED');
		  setLoading(false);
		  return;
		}

		// Step 3: Fetch batch details
		const batchResponse = await fetch(`${baseUrl}/batches/${batchId}`);
		if (!batchResponse.ok) {
		  throw new Error('Failed to fetch batch data');
		}
		const batchData = await batchResponse.json();
		setBatch(batchData);
		
		// Fetch task details if tasks exist
		if (batchData.tasks?.length > 0) {
		  await fetchTaskDetails(batchData.tasks);
		}
		
		setLoading(false);
	  } catch (err) {
		setError(err.message);
		setLoading(false);
	  }
	};

    const fetchTaskDetails = async (tasks) => {
      try {
        setTasksLoading(true);
        const tasksWithDetails = await Promise.all(
          tasks.map(async (task) => {
            try {
              const response = await fetch(`${baseUrl}/task/get-task/${task.taskId}`);
              if (!response.ok) throw new Error('Failed to fetch task');
              const data = await response.json();
              return {
                ...task,
                details: data.taskDetails
              };
            } catch (err) {
              console.error(`Error fetching task ${task.taskId}:`, err);
              return {
                ...task,
                details: null
              };
            }
          })
        );
        setTasksWithDetails(tasksWithDetails);
      } catch (err) {
        console.error("Error fetching task details:", err);
      } finally {
        setTasksLoading(false);
      }
    };

    fetchBatchData();
  }, [baseUrl]);

  const getStatusColor = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) return 'bg-gradient-to-r from-blue-400 to-blue-600 text-white';
    if (now > end) return 'bg-gradient-to-r from-purple-400 to-purple-600 text-white';
    return 'bg-gradient-to-r from-green-400 to-green-600 text-white';
  };

  const getStatusText = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) return 'Upcoming';
    if (now > end) return 'Completed';
    return 'Active';
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'from-green-400 to-green-600';
    if (percentage >= 70) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-red-600';
  };

  const calculateCompletionPercentage = () => {
    if (!batch || batch.allTasks === 0) return 0;
    return Math.round((batch.completedTasks / batch.allTasks) * 100);
  };

  if (loading) {
    return (
      <>
        <SideNav />
        <Navbar />
        <Wrapper>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-700">Loading your batch details...</p>
            </div>
          </div>
        </Wrapper>
      </>
    );
  }

if (error === 'NO_BATCH_ASSIGNED') {
  return (
    <>
      <SideNav />
      <Navbar />
      <Wrapper>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
            <div className="text-blue-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Batch Assigned</h3>
            <p className="text-gray-600 mb-4">You are not currently assigned to any batch.</p>
            <p className="text-sm text-gray-500">
              Kindly contact your respective HR for assistance.
            </p>
            <div className="mt-6">
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Refresh Status
              </button>
            </div>
          </div>
        </div>
      </Wrapper>
    </>
  );
}

if (error) {
  // This handles all other errors
  return (
    <>
      <SideNav />
      <Navbar />
      <Wrapper>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
            <div className="text-red-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading batch data</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </Wrapper>
    </>
  );
}

  const completionPercentage = calculateCompletionPercentage();
  const status = getStatusText(batch.startDate, batch.endDate);

  return (
		<>
		  <SideNav />
		  <Navbar />
		  <Wrapper>
			<div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
			  {/* Enhanced Header with more vibrant gradient */}
			  <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white shadow-lg">
				<div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
				  <div className="text-center">
					<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
					  My Batch Dashboard
					</h1>
					<p className="text-blue-100 text-lg sm:text-xl max-w-2xl mx-auto font-light">
					  Track your internship progress and stay updated with your batch
					</p>
				  </div>
				</div>
			  </div>

			  <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-16">
				{/* Stats Cards with improved design */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
				  <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-blue-100 hover:border-blue-300 transform hover:-translate-y-1.5">
					<div className="flex items-center justify-between">
					  <div>
						<p className="text-sm font-medium text-blue-600 mb-1">Batch Status</p>
						<p className="text-3xl font-bold text-gray-800 capitalize">{status}</p>
						<p className="text-xs text-gray-500 mt-1">Current program phase</p>
					  </div>
					  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-md">
						<BookOpen className="h-6 w-6 text-white" />
					  </div>
					</div>
				  </div>

				  <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-green-100 hover:border-green-300 transform hover:-translate-y-1.5">
					<div className="flex items-center justify-between">
					  <div>
						<p className="text-sm font-medium text-green-600 mb-1">Total Interns</p>
						<p className="text-3xl font-bold text-gray-800">{batch.interns?.length || 0}</p>
						<p className="text-xs text-gray-500 mt-1">In your batch</p>
					  </div>
					  <div className="p-3 bg-gradient-to-br from-green-500 to-green-700 rounded-xl shadow-md">
						<Users className="h-6 w-6 text-white" />
					  </div>
					</div>
				  </div>

				  <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-purple-100 hover:border-purple-300 transform hover:-translate-y-1.5">
					<div className="flex items-center justify-between">
					  <div>
						<p className="text-sm font-medium text-purple-600 mb-1">Total Tasks</p>
						<p className="text-3xl font-bold text-gray-800">{batch.allTasks || 0}</p>
						<p className="text-xs text-gray-500 mt-1">Assigned to batch</p>
					  </div>
					  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl shadow-md">
						<TrendingUp className="h-6 w-6 text-white" />
					  </div>
					</div>
				  </div>

				  <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-orange-100 hover:border-orange-300 transform hover:-translate-y-1.5">
					<div className="flex items-center justify-between">
					  <div>
						<p className="text-sm font-medium text-orange-600 mb-1">Completion</p>
						<p className="text-3xl font-bold text-gray-800">{completionPercentage}%</p>
						<p className="text-xs text-gray-500 mt-1">Tasks completed</p>
					  </div>
					  <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl shadow-md">
						<Award className="h-6 w-6 text-white" />
					  </div>
					</div>
				  </div>
				</div>

				{/* Enhanced Batch Card */}
				<div className="bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 border border-gray-200 hover:border-blue-300 transform hover:-translate-y-1 overflow-hidden max-w-5xl mx-auto">
				  <div className="p-8">
					<div className="flex justify-between items-start mb-6">
					  <div>
						<h3 className="text-2xl font-bold text-gray-900 leading-tight">
						  {batch.name}
						</h3>
						<p className="text-blue-600 text-sm mt-1">
						  {new Date(batch.startDate).toLocaleDateString('en-US', { 
							month: 'long', 
							day: 'numeric', 
							year: 'numeric' 
						  })} - {new Date(batch.endDate).toLocaleDateString('en-US', { 
							month: 'long', 
							day: 'numeric', 
							year: 'numeric' 
						  })}
						</p>
					  </div>
					  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(batch.startDate, batch.endDate)} shadow-md`}>
						{status}
					  </span>
					</div>

					{/* Progress Bar with better styling */}
					<div className="mb-8">
					  <div className="flex justify-between items-center mb-3">
						<span className="text-sm font-medium text-gray-700">
						  Overall Progress
						</span>
						<span className="text-sm font-bold text-blue-600">
						  {completionPercentage}% Complete
						</span>
					  </div>
					  <div className="w-full bg-gray-100 rounded-full h-3">
						<div 
						  className={`bg-gradient-to-r ${getProgressColor(completionPercentage)} h-3 rounded-full transition-all duration-700`}
						  style={{ width: `${completionPercentage}%` }}
						></div>
					  </div>
					  <div className="flex justify-between mt-2">
						<span className="text-xs text-gray-500">
						  {batch.completedTasks || 0} completed
						</span>
						<span className="text-xs text-gray-500">
						  {batch.allTasks || 0} total tasks
						</span>
					  </div>
					</div>

					{/* Enhanced Sections */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
					  {/* HR Contacts */}
					  {batch.hr?.length > 0 && (
						<div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
						  <div className="flex items-center justify-between mb-4">
							<h4 className="text-lg font-semibold text-gray-800">
							  Mentor Contacts
							</h4>
							<span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
							  {batch.hr.length} available
							</span>
						  </div>
						  <div className="space-y-3">
							{batch.hr.map((hrContact, index) => (
							  <div key={index} className="flex items-center gap-4 p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors border border-gray-100">
								<div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-medium shadow-sm">
								  {hrContact.hrId?.name?.charAt(0) || 'H'}
								</div>
								<div className="flex-1">
								  <div className="font-medium text-gray-800">
									{hrContact.hrId?.name || 'HR Contact'}
								  </div>
								  <div className="text-xs text-gray-500 flex items-center mt-1">
									<svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
									</svg>
									{hrContact.hrId?.email || 'No email provided'}
								  </div>
								</div>
								<button className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-100 transition-colors">
								  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
								  </svg>
								</button>
							  </div>
							))}
						  </div>
						</div>
					  )}

					  {/* Fellow Interns */}
					  {batch.interns?.length > 0 && (
						<div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
						  <div className="flex items-center justify-between mb-4">
							<h4 className="text-lg font-semibold text-gray-800">
							  Fellow Interns
							</h4>
							<span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
							  {batch.interns.length} in batch
							</span>
						  </div>
						  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							{batch.interns.map((intern, index) => (
							  <div key={index} className="flex items-center p-3 bg-white rounded-lg hover:bg-green-50 transition-colors border border-gray-100">
								<div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-medium shadow-sm mr-3">
								  {intern.name.charAt(0)}
								</div>
								<div className="flex-1 min-w-0">
								  <div className="font-medium text-gray-800 truncate">
									{intern.name}
								  </div>
								  <div className="text-xs text-gray-500 flex items-center mt-1 truncate">
									<svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
									</svg>
									{intern.email}
								  </div>
								</div>
							  </div>
							))}
						  </div>
						</div>
					  )}
					</div>

					{/* Enhanced Tasks Section */}
					{tasksLoading ? (
					  <div className="flex justify-center py-8">
						<div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
					  </div>
					) : tasksWithDetails.length > 0 ? (
					  <div className="mb-6">
						<div className="flex justify-between items-center mb-6">
						  <h4 className="text-xl font-semibold text-gray-800">
							Activities
						  </h4>
						  <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
							{tasksWithDetails.length} assigned
						  </span>
						</div>
						<div className="space-y-4">
						  {tasksWithDetails.map((task, index) => {
							const assignedIntern = batch.interns?.find(intern => intern._id === task.assignedTo) || 
												  { name: 'Unassigned', email: '' };
							
							return (
							  <div key={index} className="p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-colors shadow-sm hover:shadow-md">
								<div className="flex justify-between items-start mb-3">
								  <div className="font-medium text-lg text-gray-900">
									{task.details?.title || `Task ${index + 1}`}
								  </div>
								  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
									task.details?.status === 'completed' 
									  ? 'bg-green-100 text-green-800 border border-green-200'
									  : task.details?.status === 'in-progress'
									  ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
									  : 'bg-gray-100 text-gray-800 border border-gray-200'
								  }`}>
									{task.details?.status || 'not started'}
								  </span>
								</div>

								{task.details?.description && (
								  <div className="text-sm text-gray-600 mb-4">
									{task.details.description}
								  </div>
								)}

								<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
								  <div className="flex items-center">
									<div className="p-2 bg-blue-50 rounded-full mr-3">
									  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
									  </svg>
									</div>
									<div>
									  <div className="text-xs text-gray-500">Assigned to</div>
									  <div className="font-medium text-gray-800">{assignedIntern.name}</div>
									</div>
								  </div>

								  <div className="flex items-center">
									<div className="p-2 bg-purple-50 rounded-full mr-3">
									  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
									  </svg>
									</div>
									<div>
									  <div className="text-xs text-gray-500">Due Date</div>
									  <div className="font-medium text-gray-800">
										{task.details?.endDate 
										  ? new Date(task.details.endDate).toLocaleDateString('en-US', { 
											  month: 'short', 
											  day: 'numeric', 
											  year: 'numeric' 
											})
										  : 'Not set'}
									  </div>
									</div>
								  </div>

								  {task.details?.startDate && (
									<div className="flex items-center">
									  <div className="p-2 bg-green-50 rounded-full mr-3">
										<svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
									  </div>
									  <div>
										<div className="text-xs text-gray-500">Start Date</div>
										<div className="font-medium text-gray-800">
										  {new Date(task.details.startDate).toLocaleDateString('en-US', { 
											month: 'short', 
											day: 'numeric', 
											year: 'numeric' 
										  })}
										</div>
									  </div>
									</div>
								  )}
								</div>
							  </div>
							);
						  })}
						</div>
					  </div>
					) : batch.tasks?.length > 0 ? (
					  <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-200">
						<svg className="w-10 h-10 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<p className="text-gray-600">Couldn't load task details</p>
						<button 
						  onClick={() => window.location.reload()}
						  className="mt-3 text-sm text-blue-600 hover:text-blue-800"
						>
						  Try again
						</button>
					  </div>
					) : null}
				  </div>
				</div>
			  </div>
			</div>
		  </Wrapper>
		</>
  );
};

export default BatchDashboard;