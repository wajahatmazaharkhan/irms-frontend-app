import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomHrNavbar from "./CustomHrNavbar";
import { Loader, useTitle } from "@/Components/compIndex";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import toast from "react-hot-toast";
import { HrAllUsersInterns } from "@/HrHeadAndIntern/HrIndex";

function AllUsers() {
  useTitle("User Management");
  const [users, setUsers] = useState([]);
  const [hrusernames, sethrusernames] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedHrInternId, setSelectedHrInternId] = useState("");
  const [assignedStatus, setAssignedStatus] = useState({});
  const [isAssigned, setIsAssigned] = useState(false);
  const [internIds, setinternIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [ismodalopen, setModalopen] = useState(false);
  const [hrBatchInterns, setHrBatchInterns] = useState([]);

  const togglemodal = () => {
    setModalopen(!ismodalopen);
  };

  const handleassignedto = async (userid) => {
    setSelectedUserId(userid);
    togglemodal();
  };

  const checkAssignedStatus = async () => {
    try {
      if (internIds.length > 0) {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/interns/assigned`,
          { internIds }
        );
        if (response.status === 200) {
          setAssignedStatus(response.data.assignedStatus);
        }
      }
    } catch (error) {
      console.error("Error checking assigned status:", error.message);
    }
  };

  const handleUserAssignedToHr = async (userid) => {
    toast.success("assigning Intern to HR");
    togglemodal();
    setSelectedHrInternId(userid);
    handleassingment();
  };

  const handleassingment = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/assign-intern`,
        { hrId: selectedHrInternId, internId: selectedUserId }
      );
      if (response.status === 400) toast.error(response.message);
      if (response.status === 200) {
        toast.success("user successfully assigned to hr ");
        togglemodal();
        setIsAssigned((prev) => !prev);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Fetch HR's batch data to get intern IDs
  const fetchHrBatchData = async () => {
    try {
      const hrId = localStorage.getItem("userId");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/batch/get-ids`
      );
      const hrBatches = response.data.data.filter((batch) =>
        batch.hr.some((hr) => hr._id === hrId)
      );

      const hrInternIds = hrBatches.flatMap((batch) =>
        batch.interns.map((intern) => intern._id)
      );

      return hrInternIds;
    } catch (error) {
      console.error("Error fetching HR batch data:", error);
      return [];
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      // Get HR's batch intern IDs first
      const hrInternIds = await fetchHrBatchData();

      // Fetch all users
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/allusers`);
      if (!response.ok) {
        throw new Error(`Failed to fetch users (Status: ${response.status})`);
      }
      const result = await response.json();

      // Filter users to only show HR's batch interns
      const filteredUsers = result.data.filter(
        (user) => hrInternIds.includes(user._id) && user.role === "intern"
      );

      setUsers(filteredUsers || []);

      const hrUsernames = result.data
        .filter((user) => user.role === "hr")
        .map((user) => ({ id: user._id, hrname: user.name }));

      const userIds = filteredUsers.map((user) => user._id);
      setinternIds(userIds);
      sethrusernames(hrUsernames);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Rest of your existing functions remain the same...
  const deleteUser = async (userId, userName) => {
    const message =
      `Are you sure you want to delete account of the intern ${userName.toUpperCase()}?` +
      ` This action cannot be undone.` +
      ` Do you want to proceed?`;
    if (window.confirm(message)) {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/delete/${userId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        toast.success(
          `User ${userName.toUpperCase()} has been successfully deleted.`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message ||
              `Failed to delete user (Status: ${response.status})`
          );
        }
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== userId)
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortedUsers = () => {
    let filteredUsers = [...users];
    if (searchTerm) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.department?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (sortConfig.key) {
      filteredUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return filteredUsers;
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    checkAssignedStatus();
  }, [internIds, isAssigned]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <CustomHrNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-900 rounded-nonexl shadow-lg dark:shadow-none overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Header Section */}
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <h1 className="text-2xl font-bold text-white mb-4 md:mb-0">
                My Batch Interns
              </h1>
              <div className="w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search interns..."
                  className="w-full px-4 py-2 rounded-nonemd bg-blue-700 bg-opacity-20 text-white placeholder-blue-200 focus:ring-2 focus:ring-white focus:outline-none dark:bg-blue-900 dark:bg-opacity-40 dark:placeholder-blue-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mx-6 mt-4 dark:bg-red-900/40 dark:border-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="dark:text-red-100">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader />
            </div>
          ) : (
            <div className="p-6">
              {getSortedUsers().length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                    No interns found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {searchTerm
                      ? "Try adjusting your search query"
                      : "There are currently no interns in your batch"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getSortedUsers().map((user) => (
                    <div
                      key={user._id}
                      className="bg-white dark:bg-gray-900 rounded-nonelg shadow-md dark:shadow-none overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="p-5">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="flex-shrink-0">
                            <div className="h-12 w-12 rounded-nonefull bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-lg">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                              {user.name}
                            </h3>
                            <p className="text-sm text-blue-600 dark:text-blue-400">
                              {user.email}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">
                              Role
                            </p>
                            <p className="font-medium capitalize text-gray-900 dark:text-gray-100">
                              {user.role}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">
                              Department
                            </p>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              {user.department || "-"}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">
                              Phone
                            </p>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              {user.mnumber || "-"}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">
                              Start Date
                            </p>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              {formatDate(user.startDate)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex space-x-2">
                          {user.linkedInURL && (
                            <a
                              href={user.linkedInURL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-nonefull text-xs hover:bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300 dark:hover:bg-blue-900/70"
                            >
                              <svg
                                className="h-4 w-4 mr-1"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                              </svg>
                              LinkedIn
                            </a>
                          )}
                          {user.githubURL && (
                            <a
                              href={user.githubURL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-nonefull text-xs hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                            >
                              <svg
                                className="h-4 w-4 mr-1"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                              </svg>
                              GitHub
                            </a>
                          )}
                        </div>

                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={() => {
                              deleteUser(user._id, user.name)
                            }}
                            className="inline-flex items-center px-3 py-1 bg-red-50 text-red-600 rounded-nonemd text-sm hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/60 transition-colors"
                          >
                            <svg
                              className="h-4 w-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllUsers;