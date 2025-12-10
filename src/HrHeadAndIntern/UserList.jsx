import { useState } from "react"
import { useNavigate } from "react-router-dom"

/**
 * UserList
 * - Fixed: class typos fixed.
 * - Responsive: fits inside sidebar and mobile drawer.
 * - Keeps logic for filtering, search, navigation intact.
 * - All rounded corners removed (rounded-none).
 */

export function UserList({ users = [], selectedUser, setSelectedUser }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const navigate = useNavigate()

  const departments = ["all", ...new Set(users.map((user) => user?.department).filter(Boolean))]

  const filteredUsers = users.filter((user) => {
    const name = (user?.name || "").toLowerCase()
    const role = (user?.role || "").toLowerCase()
    const q = searchQuery.toLowerCase()
    const matchesSearch = name.includes(q) || role.includes(q)
    const matchesDepartment = selectedDepartment === "all" || user?.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "offline":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  return (
    <div className="flex h-full flex-col bg-white dark:bg-gray-900 rounded-none">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="space-y-3">
          {/* Search */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-blue-400 text-sm"
            />
          </div>

          {/* Department */}
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-none text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 dark:focus:ring-blue-400"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept === "all" ? "All Departments" : dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* User count header */}
      <div className="px-4 py-2 flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm">
        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
        <span className="font-medium text-gray-700 dark:text-gray-200">Interns ({filteredUsers.length})</span>
      </div>

      {/* List */}
      <div className="flex-1 h-full overflow-y-auto">
        <div className="space-y-1 p-2">
          {filteredUsers.length === 0 ? (
            <div className="p-4 text-sm text-gray-600 dark:text-gray-400">No interns found.</div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user?._id}
                onClick={() => {
                  setSelectedUser(user)
                  navigate(`/hrchat/${user?._id}`)
                }}
                className={`flex items-center gap-3 p-3 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  selectedUser?._id === user?._id ? "bg-blue-50 border-l-4 border-blue-500 dark:bg-blue-900/40" : ""
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={`https://cdn-icons-png.flaticon.com/512/3177/3177440.png`}
                    alt={user?.name}
                    className="w-10 h-10 object-cover rounded-none"
                  />
                  <div
                    className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${getStatusColor(
                      user?.status
                    )}`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h6 className="text-base text-black dark:text-gray-400 truncate">{user?.name}</h6>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.role}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}