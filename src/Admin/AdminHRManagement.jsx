import React, { useState, useEffect } from "react";
import {
  Users,
  Shield,
  UserCheck,
  UserPlus,
  Edit3,
  Trash2,
  Search,
  Filter,
  MoreVertical,
  Settings,
  Crown,
  Briefcase,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import CustomNavbar from "./CustomNavbar";
import useTitle from "@/Components/useTitle";
import Swal from "sweetalert2";

const AdminHRManagement = () => {
  useTitle("Admin & HR Management");

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@company.com",
      phone: "+1 234 567 8900",
      role: "admin",
      status: "active",
      joinDate: "2024-01-15",
      lastLogin: "2024-05-20",
      permissions: [
        "user_management",
        "system_settings",
        "reports",
        "notifications",
      ],
    },
    {
      id: 2,
      name: "Sarah Wilson",
      email: "sarah.wilson@company.com",
      phone: "+1 234 567 8901",
      role: "hr",
      status: "active",
      joinDate: "2024-02-10",
      lastLogin: "2024-05-19",
      permissions: ["employee_management", "leave_approval", "reports"],
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.johnson@company.com",
      phone: "+1 234 567 8902",
      role: "hr",
      status: "inactive",
      joinDate: "2024-03-05",
      lastLogin: "2024-05-10",
      permissions: ["employee_management", "reports"],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "hr",
    permissions: [],
  });

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
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.phone) {
      Swal.fire({
        icon: "error",
        title: "Required Fields Missing",
        text: "Please fill in all required fields",
        confirmButtonColor: "#3B82F6",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const user = {
        ...newUser,
        id: users.length + 1,
        status: "active",
        joinDate: new Date().toISOString().split("T")[0],
        lastLogin: "Never",
      };

      setUsers([...users, user]);
      setNewUser({
        name: "",
        email: "",
        phone: "",
        role: "hr",
        permissions: [],
      });
      setShowAddModal(false);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "User added successfully",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add user",
        confirmButtonColor: "#3B82F6",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleUpdateUser = async () => {
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setUsers(
        users.map((user) => (user.id === selectedUser.id ? selectedUser : user))
      );

      setShowEditModal(false);
      setSelectedUser(null);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "User updated successfully",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update user",
        confirmButtonColor: "#3B82F6",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete user!",
    });

    if (result.isConfirmed) {
      setUsers(users.filter((user) => user.id !== userId));
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "User has been deleted",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const toggleUserStatus = async (userId) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === "active" ? "inactive" : "active",
            }
          : user
      )
    );
  };

  const getRoleIcon = (role) => {
    return role === "admin" ? Crown : Briefcase;
  };

  const getRoleColor = (role) => {
    return role === "admin"
      ? "text-purple-600 bg-purple-100"
      : "text-blue-600 bg-blue-100";
  };

  const getStatusColor = (status) => {
    return status === "active"
      ? "text-green-600 bg-green-100"
      : "text-red-600 bg-red-100";
  };

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
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Admin & HR Management
            </h1>
            <p className="text-gray-600 text-lg">
              Manage administrative users and HR personnel with role-based
              access control
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-nonexl shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {users.length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white rounded-nonexl shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Admins
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {users.filter((u) => u.role === "admin").length}
                  </p>
                </div>
                <Crown className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <div className="bg-white rounded-nonexl shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    HR Personnel
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {users.filter((u) => u.role === "hr").length}
                  </p>
                </div>
                <Briefcase className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white rounded-nonexl shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Active Users
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {users.filter((u) => u.status === "active").length}
                  </p>
                </div>
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Controls Section */}
          <div className="bg-white rounded-nonexl shadow-md p-6 mb-8 border border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-nonelg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-nonelg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="hr">HR</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-nonelg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Add User Button */}
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-nonelg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <UserPlus className="w-5 h-5" />
                <span>Add User</span>
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-nonexl shadow-md border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Join Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Last Login
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => {
                    const RoleIcon = getRoleIcon(user.role);
                    return (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-nonefull flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">
                                {user.name}
                              </p>
                              <p className="text-sm text-gray-500 flex items-center">
                                <Mail className="w-3 h-3 mr-1" />
                                {user.email}
                              </p>
                              <p className="text-sm text-gray-500 flex items-center">
                                <Phone className="w-3 h-3 mr-1" />
                                {user.phone}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div
                            className={`inline-flex items-center space-x-2 px-3 py-1 rounded-nonefull text-sm font-medium ${getRoleColor(
                              user.role
                            )}`}
                          >
                            <RoleIcon className="w-4 h-4" />
                            <span className="capitalize">{user.role}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div
                            className={`inline-flex items-center space-x-2 px-3 py-1 rounded-nonefull text-sm font-medium ${getStatusColor(
                              user.status
                            )}`}
                          >
                            {user.status === "active" ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <XCircle className="w-4 h-4" />
                            )}
                            <span className="capitalize">{user.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {user.joinDate}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {user.lastLogin}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-nonelg transition-colors duration-200"
                              title="Edit User"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => toggleUserStatus(user.id)}
                              className={`p-2 rounded-nonelg transition-colors duration-200 ${
                                user.status === "active"
                                  ? "text-red-600 hover:bg-red-50"
                                  : "text-green-600 hover:bg-green-50"
                              }`}
                              title={
                                user.status === "active"
                                  ? "Deactivate"
                                  : "Activate"
                              }
                            >
                              {user.status === "active" ? (
                                <XCircle className="w-4 h-4" />
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-nonelg transition-colors duration-200"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No users found</p>
                  <p className="text-gray-400">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-nonexl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">Add New User</h3>
              <p className="text-gray-600">
                Create a new admin or HR user account
              </p>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-nonelg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-nonelg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={newUser.phone}
                    onChange={(e) =>
                      setNewUser({ ...newUser, phone: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-nonelg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Role *
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        role: e.target.value,
                        permissions: [],
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-nonelg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="hr">HR Personnel</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              {/* Permissions */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Permissions
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availablePermissions[newUser.role]?.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-start space-x-3 p-3 border border-gray-200 rounded-nonelg"
                    >
                      <input
                        type="checkbox"
                        id={permission.id}
                        checked={newUser.permissions.includes(permission.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewUser({
                              ...newUser,
                              permissions: [
                                ...newUser.permissions,
                                permission.id,
                              ],
                            });
                          } else {
                            setNewUser({
                              ...newUser,
                              permissions: newUser.permissions.filter(
                                (p) => p !== permission.id
                              ),
                            });
                          }
                        }}
                        className="mt-1 rounded focus:ring-blue-500"
                      />
                      <div>
                        <label
                          htmlFor={permission.id}
                          className="text-sm font-medium text-gray-700 cursor-pointer"
                        >
                          {permission.label}
                        </label>
                        <p className="text-xs text-gray-500">
                          {permission.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedUser(null);
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
    </>
  );
};

export default AdminHRManagement;
