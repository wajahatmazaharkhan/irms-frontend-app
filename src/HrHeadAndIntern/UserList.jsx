import { useState } from "react"
import { useNavigate } from "react-router-dom"

export function UserList({ users, selectedUser, setSelectedUser }) {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedDepartment, setSelectedDepartment] = useState("all")
    const navigate = useNavigate()

    const departments = ["all", ...new Set(users.map((user) => user?.department))]

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user?.role.toLowerCase().includes(searchQuery.toLowerCase())
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
        <div className="flex max-h-screen flex-col h-full bg-white">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">


                <div className="space-y-3">
                    {/* Search Input */}
                    <div className="relative">
                        <svg
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search employees..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Department Filter */}
                    <select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        {departments.map((dept) => (
                            <option key={dept} value={dept}>
                                {dept === "all" ? "All Departments" : dept}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* User List */}
            <div className="flex-1 h-full overflow-hidden">
                <div className="px-4 py-2 flex items-center gap-2 border-b border-gray-100">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                        />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Interns ({filteredUsers.length})</span>
                </div>

                <div className="flex-1 h-full overflow-y-scroll">
                    <div className="space-y-1 p-2">
                        {filteredUsers.map((user) => (
                            <div
                                key={user?._id}
                                onClick={() => {
                                    setSelectedUser(user)
                                    navigate(`/hrchat/${user?._id}`)
                                }}
                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${selectedUser?._id === user?._id ? "bg-blue-50 border-l-4 border-blue-500" : ""
                                    }`}
                            >
                                <div className="relative flex-shrink-0">
                                    <img
                                        src={user?.avatar}
                                        alt={user?.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div
                                        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(user?.status)}`}
                                    />
                                </div>

                                <div className="flex-1 min-w-0">
                                    {/* <div className="flex items-center justify-between">
                                        <h3 className="font-medium text-gray-900 truncate">{user?.name}</h3>
                                        {user?.unreadCount || 2 > 0 && (
                                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                                                {user?.unreadCount || 2}
                                            </span>
                                        )}
                                    </div> */}
                                    <p className="text-xs text-gray-500 truncate">{user?.role}</p>
                                    {/* <p className="text-xs text-gray-400 truncate mt-1">{user?.lastMessage}</p> */}
                                    {/* <p className="text-xs text-gray-400">{user?.lastMessageTime}</p> */}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
