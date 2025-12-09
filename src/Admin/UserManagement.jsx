"use client"

import { useState, useEffect } from "react"
import {
    Users,
    Shield,
    UserCheck,
    Edit3,
    Trash2,
    Search,
    Crown,
    Briefcase,
    Mail,
    Phone,
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
} from "lucide-react"
import axios from "axios"
import CustomNavbar from "./CustomNavbar"

const UserManagement = () => {
    const isAdmin = localStorage.getItem("isAdmin") === "true"
    const [users, setUsers] = useState([])
    const [availableInterns, setAvailableInterns] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [filterRole, setFilterRole] = useState("all")
    const [filterStatus, setFilterStatus] = useState("all")
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedUser, setSelectedUser] = useState()
    const [isLoading, setIsLoading] = useState(false)

    const GetAllUser = () => {
        axios
            .get(`${import.meta.env.VITE_BASE_URL}/allusers`)
            .then((response) => {
                setUsers(response.data.data)
                console.log("Users fetched successfully:", response.data.data)
            })
            .catch((error) => {
                console.error("Error fetching users:", error)
            })
    }

    const GetAvailableInterns = () => {
        axios
            .get(`${import.meta.env.VITE_BASE_URL}/available-interns`)
            .then((response) => {
                setAvailableInterns(response.data.data || response.data)
                console.log("Available interns fetched successfully:", response.data)
            })
            .catch((error) => {
                console.error("Error fetching available interns:", error)
            })
    }

    useEffect(() => {
        GetAllUser()
        GetAvailableInterns()
    }, [])

    // Separate users into verified and unverified
    const verifiedUsers = users.filter((user) => user.isVerified === true)
    const unverifiedUsers = users.filter((user) => user.isVerified === false || user.isVerified === undefined)

    const availablePermissions = {
        admin: [
            {
                id: "user_management",
                label: "User Management",
                description: "Manage all users and roles",
            },
            {
                id: "system_settings",
                label: "System Settings",
                description: "Configure system settings",
            },
            {
                id: "reports",
                label: "Reports & Analytics",
                description: "Access all reports and analytics",
            },
            {
                id: "notifications",
                label: "Send Notifications",
                description: "Send system-wide notifications",
            },
            {
                id: "leave_approval",
                label: "Leave Approval",
                description: "Approve/reject leave applications",
            },
            {
                id: "attendance",
                label: "Attendance Management",
                description: "Manage employee attendance",
            },
            {
                id: "data_export",
                label: "Data Export",
                description: "Export system data",
            },
        ],
        hrHead: [
            {
                id: "user_management",
                label: "User Management",
                description: "Manage all users and roles",
            },
            {
                id: "system_settings",
                label: "System Settings",
                description: "Configure system settings",
            },
            {
                id: "reports",
                label: "Reports & Analytics",
                description: "Access all reports and analytics",
            },
            {
                id: "notifications",
                label: "Send Notifications",
                description: "Send system-wide notifications",
            },
            {
                id: "leave_approval",
                label: "Leave Approval",
                description: "Approve/reject leave applications",
            },
            {
                id: "attendance",
                label: "Attendance Management",
                description: "Manage employee attendance",
            },
            {
                id: "data_export",
                label: "Data Export",
                description: "Export system data",
            },
        ],
        hr: [
            {
                id: "employee_management",
                label: "Employee Management",
                description: "Manage employee records",
            },
            {
                id: "leave_approval",
                label: "Leave Approval",
                description: "Approve/reject leave applications",
            },
            {
                id: "reports",
                label: "HR Reports",
                description: "Access HR reports and analytics",
            },
            {
                id: "attendance",
                label: "Attendance Management",
                description: "Manage employee attendance",
            },
            {
                id: "recruitment",
                label: "Recruitment",
                description: "Manage recruitment processes",
            },
        ],
        user: [],
    }

    const filteredVerifiedUsers = verifiedUsers.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesRole = filterRole === "all" || user.role === filterRole
        const matchesStatus = filterStatus === "all" || user.status === filterStatus
        return matchesSearch && matchesRole && matchesStatus
    })

    const filteredUnverifiedUsers = unverifiedUsers.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesSearch
    })

    // Accept/Verify user function
    const handleAcceptUser = async (userId) => {
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/accept/${userId}`)
            // Refresh the user list after accepting
            GetAllUser()
            alert("User verified successfully!")
        } catch (error) {
            console.error("Error accepting user:", error)
            alert("Failed to verify user")
        }
    }

    const handleEditUser = (user) => {
        setSelectedUser({ ...user })
        setShowEditModal(true)
    }

    const handleUpdateUser = async () => {
        const userid = localStorage.getItem("userId")
        setIsLoading(true)
        try {
            const permissions =
                selectedUser.role === "intern"
                    ? []
                    : selectedUser.permissions
                        .map((permId) => availablePermissions[selectedUser.role].find((p) => p.id === permId)?.id)
                        .filter(Boolean)

            const payload = {
                role: selectedUser.role,
                name: selectedUser.name,
                email: selectedUser.email,
                isAdmin: selectedUser.role === "admin" ? true : false,
                mnumber: selectedUser.mnumber,
                permissions,
            }

            if (selectedUser._id === userid) {
                localStorage.setItem("permissions", JSON.stringify(permissions))
                localStorage.setItem("isAdmin", (selectedUser.role === "admin" || selectedUser.role === "hrHead") ? "true" : "false")
            }

            Object.keys(payload).forEach((key) => payload[key] == null && delete payload[key])

            await axios.put(`${import.meta.env.VITE_BASE_URL}/update/${selectedUser._id}`, payload)

            setUsers(users.map((user) => (user._id === selectedUser._id ? { ...selectedUser, permissions } : user)))

            setShowEditModal(false)
            setSelectedUser(null)
            alert("User updated successfully!")
        } catch (error) {
            alert("Failed to update user")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await axios.delete(`${import.meta.env.VITE_BASE_URL}/delete/${userId}`)
                setUsers(users.filter((user) => user._id !== userId))
                alert("User deleted successfully!")
            } catch (error) {
                console.error("Error deleting user:", error)
                alert("Failed to delete user")
            }
        }
    }

    const promoteUser = async (userId, newRole) => {
        const userToPromote = users.find((user) => user._id === userId)
        if (!userToPromote) return

        const newPermissions = newRole === "intern" ? [] : availablePermissions[newRole].map((p) => p.id)

        try {
            await axios.put(`${import.meta.env.VITE_BASE_URL}/update/${userId}`, {
                role: newRole,
                isAdmin: (newRole === "admin" || newRole === "hrHead") ? true : false,
                permissions: newPermissions,
            })

            const userid = localStorage.getItem("userId")
            if (userId === userid) {
                localStorage.setItem("permissions", JSON.stringify(newPermissions))
                localStorage.setItem("isAdmin", (newRole === "admin" || newRole === "hrHead") ? "true" : "false")
            }

            const updatedUser = {
                ...userToPromote,
                role: newRole,
                isAdmin: (newRole === "admin" || newRole === "hrHead") ? true : false,
                permissions: newPermissions,
            }

            setUsers(users.map((user) => (user._id === userId ? updatedUser : user)))

            alert(`User promoted to ${newRole} successfully!`)
        } catch (error) {
            alert("Failed to promote user")
        }
    }

    const getRoleIcon = (role) => {
        switch (role) {
            case "admin":
                return Crown
            case "hrHead":
                return Crown  // Same as admin since they have same permissions
            case "hr":
                return Briefcase
            default:
                return Users
        }
    }

    const getRoleColor = (role) => {
        switch (role) {
            case "admin":
                return "text-purple-600 bg-purple-100"
            case "hrHead":
                return "text-indigo-600 bg-indigo-100"  // Different color to distinguish from admin
            case "hr":
                return "text-blue-600 bg-blue-100"
            default:
                return "text-gray-600 bg-gray-100"
        }
    }

    const getStatusColor = (status) => {
        return status === "active" ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"
    }

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "short", day: "numeric" }
        return new Date(dateString).toLocaleDateString(undefined, options)
    }

    const UserTable = ({ users, isVerified = true, title }) => (
        <div className="bg-white rounded-nonexl shadow-md border border-gray-200 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                        {isVerified ? (
                            <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                        ) : (
                            <Clock className="w-6 h-6 text-orange-600 mr-2" />
                        )}
                        {title}
                    </h2>
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-nonefull">
                        {users.length} users
                    </span>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">User</th>
                            {isVerified && <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Role</th>}
                            {!isVerified && <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">For Role</th>}
                            {isVerified && <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>}
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Join Date</th>
                            {isVerified && <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Permissions</th>}
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map((user) => {
                            const RoleIcon = getRoleIcon(user.role)
                            return (
                                <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-200">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div
                                                className={`w-10 h-10 rounded-nonefull flex items-center justify-center ${isVerified
                                                    ? "bg-gradient-to-br from-blue-500 to-blue-600"
                                                    : "bg-gradient-to-br from-orange-500 to-orange-600"
                                                    }`}
                                            >
                                                <span className="text-white font-semibold text-sm">
                                                    {user.name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">{user.name}</p>
                                                <p className="text-sm text-gray-500 flex items-center">
                                                    <Mail className="w-3 h-3 mr-1" />
                                                    {user.email}
                                                </p>
                                                <p className="text-sm text-gray-500 flex items-center">
                                                    <Phone className="w-3 h-3 mr-1" />
                                                    {user.mnumber}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    {isVerified && (
                                        <td className="px-6 py-4">
                                            <div className="space-y-2">
                                                <div
                                                    className={`inline-flex items-center space-x-2 px-3 py-1 rounded-nonefull text-sm font-medium ${getRoleColor(
                                                        user.role,
                                                    )}`}
                                                >
                                                    <RoleIcon className="w-4 h-4" />
                                                    <span className="capitalize">{user.role === "development" ? "intern" : user.role}</span>
                                                </div>
                                                {user.role === "intern" && (
                                                    <div className="flex space-x-1">
                                                        <button
                                                            onClick={() => promoteUser(user._id, "hr")}
                                                            className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                                                        >
                                                            Promote to HR
                                                        </button>
                                                        {isAdmin && (
                                                            <>
                                                                <button
                                                                    onClick={() => promoteUser(user._id, "hrHead")}
                                                                    className="text-xs bg-indigo-500 text-white px-2 py-1 rounded hover:bg-indigo-600 transition-colors"
                                                                >
                                                                    Promote to HR Head
                                                                </button>
                                                                <button
                                                                    onClick={() => promoteUser(user._id, "admin")}
                                                                    className="text-xs bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600 transition-colors"
                                                                >
                                                                    Promote to Admin
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                    {!isVerified && (
                                        <td className="px-6 py-4">
                                            <div className="space-y-2">
                                                <div
                                                    className={`inline-flex items-center space-x-2 px-3 py-1 rounded-nonefull text-sm font-medium ${getRoleColor(
                                                        user.role,
                                                    )}`}
                                                >
                                                    <RoleIcon className="w-4 h-4" />
                                                    <span className="capitalize">{user.role === "development" ? "intern" : user.role}</span>
                                                </div>


                                            </div>
                                        </td>
                                    )}
                                    {isVerified && (
                                        <td className="px-6 py-4">
                                            {(() => {
                                                const today = new Date()
                                                const endDate = user.enddate ? new Date(user.enddate) : null
                                                const isActive = endDate ? today <= endDate : true
                                                const status = isActive ? "active" : "inactive"
                                                return (
                                                    <div
                                                        className={`inline-flex items-center space-x-2 px-3 py-1 rounded-nonefull text-sm font-medium ${getStatusColor(status)}`}
                                                    >
                                                        {isActive ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                                        <span className="capitalize">{status}</span>
                                                    </div>
                                                )
                                            })()}
                                        </td>
                                    )}
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            {formatDate(user.startDate)}
                                        </div>
                                    </td>
                                    {isVerified && (
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {user?.permissions?.length > 0 ? (
                                                    user?.permissions.slice(0, 2).map((permission) => (
                                                        <span key={permission} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                                            {permission?.replace("_", " ")}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-gray-400">No permissions</span>
                                                )}
                                                {user?.permissions?.length > 2 && (
                                                    <span className="text-xs text-gray-500">+{user?.permissions?.length - 2} more</span>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            {!isVerified ? (
                                                <button
                                                    onClick={() => handleAcceptUser(user._id)}
                                                    className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors duration-200 flex items-center space-x-1"
                                                    title="Accept User"
                                                >
                                                    <UserCheck className="w-4 h-4" />
                                                    <span>Accept</span>
                                                </button>
                                            ) : (

                                                <button
                                                    disabled={isAdmin === false && user.role === "admin"}
                                                    onClick={() => handleEditUser(user)}
                                                    className={`p-2 text-blue-600 hover:bg-blue-50 rounded-nonelg transition-colors duration-200${isAdmin === false && user.role === "admin" ? " cursor-not-allowed" : ""}`}
                                                    title="Edit User"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                            )}
                                            {isAdmin &&
                                                <button
                                                    onClick={() => handleDeleteUser(user._id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-nonelg transition-colors duration-200"
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            }
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {users?.length === 0 && (
                    <div className="text-center py-12">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No users found</p>
                        <p className="text-gray-400">
                            {isVerified ? "No verified users available" : "No pending verification requests"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )

    return (
        <>
            <CustomNavbar />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="container mx-auto px-4 py-8">
                    {/* Header Section */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center mb-4">
                            <div className="p-3 bg-blue-100 rounded-nonefull">
                                <Shield className="w-8 h-8 text-blue-600" />
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">User Management</h1>
                        <p className="text-gray-600 text-lg">Manage users and promote them to admin or HR roles with permissions</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
                        <div className="bg-white rounded-nonexl shadow-md p-6 border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">Total Users</p>
                                    <p className="text-2xl font-bold text-blue-600">{users.length}</p>
                                </div>
                                <Users className="w-8 h-8 text-blue-600" />
                            </div>
                        </div>
                        <div className="bg-white rounded-nonexl shadow-md p-6 border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">Verified</p>
                                    <p className="text-2xl font-bold text-green-600">{verifiedUsers.length}</p>
                                </div>
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                        </div>
                        <div className="bg-white rounded-nonexl shadow-md p-6 border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
                                    <p className="text-2xl font-bold text-orange-600">{unverifiedUsers.length}</p>
                                </div>
                                <Clock className="w-8 h-8 text-orange-600" />
                            </div>
                        </div>
                        <div className="bg-white rounded-nonexl shadow-md p-6 border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">Admins</p>
                                    <p className="text-2xl font-bold text-purple-600">
                                        {verifiedUsers.filter((u) => u.role === "admin")?.length}
                                    </p>
                                </div>
                                <Crown className="w-8 h-8 text-purple-600" />
                            </div>
                        </div>
                        <div className="bg-white rounded-nonexl shadow-md p-6 border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">HR Personnel</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {verifiedUsers.filter((u) => u.role === "hr")?.length}
                                    </p>
                                </div>
                                <Briefcase className="w-8 h-8 text-blue-600" />
                            </div>
                        </div>
                        <div className="bg-white rounded-nonexl shadow-md p-6 border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">HR Heads</p>
                                    <p className="text-2xl font-bold text-indigo-600">
                                        {verifiedUsers.filter((u) => u.role === "hrHead")?.length}
                                    </p>
                                </div>
                                <Crown className="w-8 h-8 text-indigo-600" />
                            </div>
                        </div>
                    </div>

                    {/* Controls Section */}
                    <div className="bg-white rounded-nonexl shadow-lg p-6 mb-8 border border-gray-200">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                            <div className="flex flex-col sm:flex-row gap-4 flex-1">
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Search users by name or email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-nonelg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                    />
                                </div>
                                <style jsx>{`
                                .select-wrapper {
                                  position: relative;
                                }
                                .select-wrapper::after {
                                  content: '';
                                  position: absolute;
                                  right: 12px;
                                  top: 50%;
                                  transform: translateY(-50%);
                                  width: 0;
                                  height: 0;
                                  border-left: 5px solid transparent;
                                  border-right: 5px solid transparent;
                                  border-top: 5px solid #6b7280;
                                  pointer-events: none;
                                }
                              `}</style>
                                <div className="select-wrapper">
                                    <select
                                        value={filterRole}
                                        onChange={(e) => setFilterRole(e.target.value)}
                                        className="px-4 pr-8 py-3 border border-gray-300 rounded-nonelg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white appearance-none"
                                    >
                                        <option value="all">All Roles</option>
                                        <option value="admin">Admin</option>
                                        <option value="hrHead">HR Head</option>
                                        <option value="hr">HR</option>
                                        <option value="intern">Intern</option>
                                    </select>
                                </div>
                                <div className="select-wrapper">
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="px-4 pr-8 py-3 border border-gray-300 rounded-nonelg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white appearance-none"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-nonelg">
                                Showing {filteredVerifiedUsers.length + filteredUnverifiedUsers.length} of {users?.length} users
                            </div>
                        </div>
                    </div>

                    {/* Unverified Users Section */}
                    {unverifiedUsers.length > 0 && (
                        <UserTable users={filteredUnverifiedUsers} isVerified={false} title="Pending Verification" />
                    )}

                    {/* Verified Users Section */}
                    <UserTable users={filteredVerifiedUsers} isVerified={true} title="Verified Users" />
                </div>

                {/* Edit User Modal */}
                {showEditModal && selectedUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-nonexl max-w-2xl w-full max-h-screen overflow-y-auto">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-xl font-bold text-gray-800">Edit User</h3>
                                <p className="text-gray-600">Update user information and permissions</p>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                                        <input
                                            type="text"
                                            value={selectedUser.name}
                                            onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                                            className="w-full p-3 border border-gray-300 rounded-nonelg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter full name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                                        <input
                                            type="email"
                                            value={selectedUser.email}
                                            onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                                            className="w-full p-3 border border-gray-300 rounded-nonelg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter email address"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                                        <input
                                            type="tel"
                                            value={selectedUser.mnumber}
                                            onChange={(e) => setSelectedUser({ ...selectedUser, mnumber: e.target.value })}
                                            className="w-full p-3 border border-gray-300 rounded-nonelg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter phone number"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Role *</label>
                                        <select
                                            value={selectedUser.role}
                                            onChange={(e) =>
                                                setSelectedUser({
                                                    ...selectedUser,
                                                    role: e.target.value,
                                                    permissions: e.target.value === "intern" ? [] : selectedUser?.permissions,
                                                })
                                            }
                                            className="w-full p-3 border border-gray-300 rounded-nonelg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="intern">Intern</option>
                                            <option value="hr">HR Personnel</option>
                                            <option value="hrHead">HR Head</option>
                                            {isAdmin && <option value="admin">Administrator</option>}
                                        </select>
                                    </div>
                                </div>
                                {selectedUser.role !== "user" && (
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-4">Permissions</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {availablePermissions[selectedUser.role]?.map((permission) => (
                                                <div
                                                    key={permission.id}
                                                    className="flex items-start space-x-3 p-3 border border-gray-200 rounded-nonelg"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        id={`edit-${permission.id}`}
                                                        checked={selectedUser?.permissions.includes(permission.id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedUser({
                                                                    ...selectedUser,
                                                                    permissions: [...selectedUser.permissions, permission.id],
                                                                })
                                                            } else {
                                                                setSelectedUser({
                                                                    ...selectedUser,
                                                                    permissions: selectedUser.permissions.filter((p) => p !== permission.id),
                                                                })
                                                            }
                                                        }}
                                                        className="mt-1 rounded focus:ring-blue-500"
                                                    />
                                                    <div>
                                                        <label
                                                            htmlFor={`edit-${permission.id}`}
                                                            className="text-sm font-medium text-gray-700 cursor-pointer"
                                                        >
                                                            {permission.label}
                                                        </label>
                                                        <p className="text-xs text-gray-500">{permission.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
                                <button
                                    onClick={() => {
                                        setShowEditModal(false)
                                        setSelectedUser(null)
                                    }}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-nonelg hover:bg-gray-50 transition-colors duration-200"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateUser}
                                    disabled={isLoading}
                                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-nonelg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? "Updating..." : "Update User"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default UserManagement
