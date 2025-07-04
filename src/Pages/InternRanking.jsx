import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import { Navbar, SideNav, Footer, useTitle } from "@/Components/compIndex";
import { Loader2, Users, Clock } from "lucide-react";
import CustomHrNavbar from "../HrHeadAndIntern/CustomHrNavbar";

const InternRanking = () => {
  useTitle("Intern Rankings");

  const [interns, setInterns] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [timeSpent, setTimeSpent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeUsersLoading, setActiveUsersLoading] = useState(false);
  const [timeSpentLoading, setTimeSpentLoading] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [errors, setErrors] = useState({});

  const loggedInUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const isIntern = userRole === "intern";
  const isAdminOrHr = userRole === "admin" || userRole === "hr";

  const getNavbar = () => {
    return isAdminOrHr ? <CustomHrNavbar /> : (
      <>
        <Navbar />
        <SideNav />
      </>
    );
  };

  const fetchActiveUsers = async () => {
    setActiveUsersLoading(true);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/dashboard/active-users`, {
        headers,
        timeout: 10000
      });
      setActiveUsers(res.data || []);
    } catch (error) {
      console.error("Error fetching active users:", error);
      setErrors(prev => ({ ...prev, activeUsers: error.message }));
    } finally {
      setActiveUsersLoading(false);
    }
  };

  const fetchTimeSpent = async () => {
    setTimeSpentLoading(true);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/dashboard/time-spent`, {
        headers,
        timeout: 10000
      });
      // ✅ Corrected line
      setTimeSpent(res.data.timeSpent || []);
    } catch (error) {
      console.error("Error fetching time spent:", error);
      setErrors(prev => ({ ...prev, timeSpent: error.message }));
    } finally {
      setTimeSpentLoading(false);
    }
  };

  const fetchInternRankings = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/intern-rankings`);
      setInterns(res.data?.interns || []);
    } catch (error) {
      console.error("Error fetching intern rankings:", error);
      setInterns([]);
    }
  };

  const checkUserRole = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/auth/user/${loggedInUserId}`);
      const role = res.data?.role?.toLowerCase() || "";
      setUserRole(role);
    } catch (error) {
      console.error("Error fetching user role:", error);
      setUserRole("");
    }
  };

  // First get the user role
  useEffect(() => {
    checkUserRole();
  }, []);

  // Then fetch everything else when role is known
  useEffect(() => {
    if (!userRole) return;

    const fetchData = async () => {
      setLoading(true);
      await fetchInternRankings();
      await fetchTimeSpent();
      if (isAdminOrHr) {
        await fetchActiveUsers();
      }
      setLoading(false);
    };

    fetchData();
  }, [userRole]);

  const getMedal = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return null;
  };

  const getUserTimeSpent = (userId) => {
    if (!Array.isArray(timeSpent)) return null;
    return timeSpent.find((ts) => ts?._id === userId);
  };

  const formatTimeSpent = (timeInMinutes) => {
    if (!timeInMinutes || timeInMinutes === 0) return "0 min";
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const renderIntern = (intern, index, highlight = false) => {
    const userTime = getUserTimeSpent(intern._id);

    return (
      <div key={intern._id} className={`flex justify-between items-center border p-4 rounded-xl shadow-md
        ${highlight ? "bg-yellow-100 border-yellow-300" : index < 3 ? "bg-indigo-50" : "bg-white"}`}>
        <div className="flex space-x-4">
          <div className="font-bold text-gray-600 w-6 text-right">{index + 1}</div>
          <div>
            <h3 className="font-semibold text-lg flex gap-2">{getMedal(index)} {intern.name}</h3>
            <p className="text-sm text-gray-500">{intern.email}</p>
            <p className="text-sm text-gray-500">Dept: {intern.department}</p>
            {(userTime?.totalTimeSpent || intern.totalTimeSpent) && (
              <div className="text-xs text-purple-600 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Time Spent: {formatTimeSpent(userTime?.totalTimeSpent || intern.totalTimeSpent)}
              </div>
            )}
          </div>
        </div>
        <div className="text-xl font-bold text-blue-600">{intern.totalPoints || 0} pts</div>
      </div>
    );
  };

  const getActiveUserCount = () => {
    if (Array.isArray(activeUsers)) return activeUsers.length;
    if (typeof activeUsers === "object") return activeUsers.activeUsers || 0;
    return 0;
  };

  return (
    <>
      {getNavbar()}
      <div className="min-h-screen ml-0 md:ml-32 bg-gradient-to-br from-blue-50 to-white">
        <div className="p-6 max-w-5xl mx-auto">

          {/* Show Active Users Only to Admin or HR */}
          {isAdminOrHr && (
            <Card className="shadow-lg border border-gray-200 rounded-xl mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Active Users</h3>
                      <p className="text-sm text-gray-500">Currently online</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {activeUsersLoading ? (
                      <Loader2 className="animate-spin w-5 h-5 text-gray-500" />
                    ) : (
                      <div className="text-2xl font-bold text-green-600">{getActiveUserCount()}</div>
                    )}
                    {errors.activeUsers && <p className="text-xs text-red-500 mt-1">Failed to load</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Intern Rankings */}
          <Card className="shadow-2xl border border-gray-200 rounded-xl">
            <CardHeader className="border-b bg-white rounded-t-xl">
              <CardTitle className="text-3xl font-bold text-blue-700">🌟 Intern Rankings</CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-white rounded-b-xl">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
                  <span className="ml-2 text-gray-500">Loading rankings...</span>
                </div>
              ) : !interns.length ? (
                <p className="text-center text-gray-500 py-8">No intern data available.</p>
              ) : (
                <div className="space-y-4">
                  {(isIntern ? interns.slice(0, 3) : interns).map((intern, index) => renderIntern(intern, index))}
                  {(() => {
                    const myIndex = interns.findIndex((i) => i?._id === loggedInUserId);
                    if (isIntern && myIndex >= 3) {
                      return (
                        <>
                          <div className="text-center text-gray-300 text-3xl font-extrabold">⋮</div>
                          {renderIntern(interns[myIndex], myIndex, true)}
                        </>
                      );
                    }
                    return null;
                  })()}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      {!isAdminOrHr && <Footer />}
    </>
  );
};

export default InternRanking;
