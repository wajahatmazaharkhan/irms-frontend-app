"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card"
import { Navbar, SideNav, Footer, useTitle } from "@/Components/compIndex"
import { Loader2, Users, Clock } from "lucide-react"
import CustomHrNavbar from "../HrHeadAndIntern/CustomHrNavbar"

const InternRanking = () => {
  useTitle("Intern Rankings")

  const [interns, setInterns] = useState([])
  const [activeUsers, setActiveUsers] = useState([])
  const [timeSpent, setTimeSpent] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeUsersLoading, setActiveUsersLoading] = useState(false)
  const [timeSpentLoading, setTimeSpentLoading] = useState(false)
  const [isIntern, setIsIntern] = useState(true)
  const [userRole, setUserRole] = useState("")
  const [errors, setErrors] = useState({})

  const loggedInUserId = localStorage.getItem("userId")
  const token = localStorage.getItem("token")

  const fetchActiveUsers = async () => {
    setActiveUsersLoading(true)
    try {
      const headers = {}
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/dashboard/active-users`, {
        headers,
        timeout: 10000,
      })

      console.log("Response from active users:", response.data)
      setActiveUsers(response.data || [])
      setErrors((prev) => ({ ...prev, activeUsers: null }))
      console.log("Active users fetched successfully:", response.data)
    } catch (error) {
      console.error("Error fetching active users:", error)
      setErrors((prev) => ({ ...prev, activeUsers: error.message }))
      setActiveUsers([])
    } finally {
      setActiveUsersLoading(false)
    }
  }

  // Choose navbar based on userRole
  const getNavbar = () => {
    if (userRole === "hr" || userRole === "admin") {
      // Lazy import or import at top: import { CustomHrNavbar } from "@/Components/compIndex"
      return <CustomHrNavbar />
    }
    return (
      <>
        <Navbar />
        <SideNav />
      </>
    )
  }

  const fetchTimeSpent = async () => {
    setTimeSpentLoading(true)
    try {
      const headers = {}
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/dashboard/time-spent`, {
        headers,
        timeout: 10000,
      })

      setTimeSpent(response.data || [])
      setErrors((prev) => ({ ...prev, timeSpent: null }))
      console.log("Time spent data fetched successfully:", response.data)
    } catch (error) {
      console.error("Error fetching time spent:", error)
      setErrors((prev) => ({ ...prev, timeSpent: error.message }))
      setTimeSpent([])
    } finally {
      setTimeSpentLoading(false)
    }
  }

  const checkIfIntern = async () => {
    try {
      const userId = localStorage.getItem("userId")
      if (!userId) {
        console.log("No userId found in localStorage")
        setIsIntern(false)
        setUserRole("")
        return
      }

      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/auth/user/${userId}`)
      const data = response.data
      const role = data?.role || ""

      console.log("User data from API:", { data, role, userId })

      setIsIntern(role.toLowerCase() === "intern")
      setUserRole(role.toLowerCase())
    } catch (error) {
      console.error(`Error fetching user details and checking if intern: ${error}`)
      setIsIntern(false)
      setUserRole("")
    }
  }

  useEffect(() => {
    const fetchInternRankings = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/intern-rankings`)

        setInterns(res.data?.interns || [])
        console.log("Intern Rankings:", res.data?.interns)

        await checkIfIntern()
        await fetchActiveUsers()
        await fetchTimeSpent()
      } catch (error) {
        console.error("Error fetching rankings:", error)
        setInterns([])
      } finally {
        setLoading(false)
      }
    }

    fetchInternRankings()
  }, [])

  const getMedal = (index) => {
    if (index === 0) return "🥇"
    if (index === 1) return "🥈"
    if (index === 2) return "🥉"
    return null
  }

  const getUserTimeSpent = (userId) => {
    if (!timeSpent || !Array.isArray(timeSpent)) return null
    return timeSpent.find((ts) => ts?._id === userId)
  }

  const formatTimeSpent = (timeInMinutes) => {
    if (!timeInMinutes || timeInMinutes === 0) return "0 min"

    const hours = Math.floor(timeInMinutes / 60)
    const minutes = timeInMinutes % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const renderIntern = (intern, index, highlight = false) => {
    if (!intern) return null

    const userTimeData = getUserTimeSpent(intern._id)

    return (

      <div
        key={intern._id || index}
        className={`flex items-center justify-between border p-4 rounded-xl transition-all duration-300 transform hover:scale-[1.015] ${highlight
          ? "bg-yellow-100 border-yellow-300 shadow-lg"
          : index < 3
            ? "bg-gradient-to-r from-indigo-100 via-white to-indigo-50 border-indigo-300 shadow-md"
            : "bg-white hover:shadow-md border-gray-300 shadow-md"
          }`}
      >
        <div className="flex items-center space-x-4">
          <div className="text-lg font-bold text-gray-600 w-6 text-right">{index + 1}</div>
          <div>
            <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
              {getMedal(index)} {intern.name || "Unknown"}
            </h3>
            <p className="text-sm text-gray-500">{intern.email || "N/A"}</p>
            <p className="text-sm text-gray-500">Dept: {intern.department || "N/A"}</p>

            {/* Show time spent if available */}
            {(userTimeData?.totalTimeSpent || intern.totalTimeSpent) && (
              <div className="text-xs text-purple-600 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Time Spent: {formatTimeSpent(userTimeData?.totalTimeSpent || intern.totalTimeSpent)}
              </div>
            )}
          </div>
        </div>
        <div className="text-xl font-bold text-blue-600">{intern.totalPoints || 0} pts</div>
      </div>
    )
  }

  const getActiveUserCount = () => {
    // Handle the case where activeUsers is an object with activeUsers property
    if (activeUsers && typeof activeUsers === "object") {
      return activeUsers.activeUsers || 0
    }
    // Fallback for array format (if API changes)
    if (Array.isArray(activeUsers)) {
      return activeUsers.length
    }
    return 0
  }

  const getActiveUsersSince = () => {
    if (activeUsers && typeof activeUsers === "object" && activeUsers.since) {
      try {
        return new Date(activeUsers.since).toLocaleString()
      } catch (error) {
        return "Invalid Date"
      }
    }
    return null
  }

  return (
    <>
      {getNavbar()}
      <div className="min-h-screen ml-0 md:ml-32 bg-gradient-to-br from-blue-50 to-white">
        <div className="p-6 max-w-5xl mx-auto">
          {/* Active Users Count Card */}
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

          {/* Main Rankings Card */}
          <Card className="shadow-2xl border border-gray-200 rounded-xl">
            <CardHeader className="border-b bg-white rounded-t-xl">
              <CardTitle className="text-3xl font-bold text-blue-700">🌟 Intern Rankings</CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-white rounded-b-xl">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
                  <span className="ml-2 text-gray-500">Loading rankings...</span>
                </div>
              ) : !interns || interns.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No intern data available.</p>
              ) : (
                <div className="space-y-4">
                  {(isIntern ? interns.slice(0, 3) : interns).map((intern, index) => renderIntern(intern, index))}
                  {(() => {
                    if (!loggedInUserId || !interns || interns.length === 0) {
                      return null
                    }

                    const myIndex = interns.findIndex((i) => i?._id === loggedInUserId)

                    if (myIndex >= 3) {
                      return (
                        <>
                          <div className="text-center text-gray-300 text-3xl font-extrabold">⋮</div>
                          {renderIntern(interns[myIndex], myIndex, true)}
                        </>
                      )
                    }
                    return null
                  })()}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      {(userRole !== "hr" && userRole !== "admin") && <Footer />}
    </>
  )
}

export default InternRanking
