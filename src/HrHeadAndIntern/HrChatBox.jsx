"use client";

import { useState, useEffect } from "react";
import { UserList } from "./UserList";
import RealtimeChat from "./RealTimeChat";
import CustomHrNavbar from "./CustomHrNavbar";
import axios from "axios";
import { useParams } from "react-router-dom";

/**
 * HRChatDashboard
 * - Responsive layout: sidebar visible on md+; toggleable drawer on small screens.
 * - Keeps all API calls, useEffect, state logic intact.
 */

export default function HRChatDashboard() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUserId] = useState(localStorage.getItem("userId") || null);
  const [users, setUsers] = useState([]);
  const { receiverId } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchHrBatchData = async () => {
    try {
      const hrId = localStorage.getItem("userId");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/batch/get-ids`
      );
      const hrBatches = (response?.data?.data || []).filter(
        (batch) =>
          Array.isArray(batch.hr) && batch.hr.some((hr) => hr._id === hrId)
      );

      const hrInternIds = hrBatches.flatMap((batch) =>
        Array.isArray(batch.interns)
          ? batch.interns.map((intern) => intern._id)
          : []
      );

      return hrInternIds;
    } catch (error) {
      console.error("Error fetching HR batch data:", error);
      return [];
    }
  };

  const fetchUsers = async () => {
    try {
      const hrInternIds = await fetchHrBatchData();
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/allusers`);
      if (!response.ok) {
        throw new Error(`Failed to fetch users (Status: ${response.status})`);
      }
      const result = await response.json();
      const filteredUsers = (result?.data || []).filter(
        (user) => hrInternIds.includes(user._id) && user.role === "intern"
      );
      setUsers(filteredUsers || []);
      // If a receiverId param exists, set selectedUser from users if available
      if (receiverId) {
        const match = filteredUsers.find((u) => u._id === receiverId);
        if (match) setSelectedUser(match);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // close sidebar on desktop when user navigates
  useEffect(() => {
    setSidebarOpen(false);
  }, [receiverId]);

  return (
    <>
      <CustomHrNavbar />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar (md+: visible, sm: toggled) */}
          <div
            className={`fixed inset-y-0 left-0 z-30 w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 md:static md:translate-x-0 ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full md:translate-x-0"
            }`}
            aria-hidden={!sidebarOpen && window && window.innerWidth < 768}
          >
            <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Interns
              </h3>
              <button
                className="md:hidden px-2 py-1 text-sm text-gray-600 dark:text-gray-300"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                ✕
              </button>
            </div>

            <div className="h-[calc(100vh-56px)] overflow-auto">
              <UserList
                users={users}
                selectedUser={selectedUser}
                setSelectedUser={(user) => {
                  setSelectedUser(user);
                }}
              />
            </div>
          </div>

          {/* Backdrop for mobile when sidebar open */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-20 bg-black/40 md:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
          )}

          {/* Main area */}
          <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-950">
            {/* Top bar for small screens: show toggle */}
            <div className="md:hidden flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="px-3 py-2 text-sm font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 rounded-none"
                  aria-label="Open sidebar"
                >
                  ☰
                </button>
                <div className="text-sm font-semibold">HR Chat</div>
              </div>
            </div>

            {/* Realtime Chat area */}
            <RealtimeChat ReceiverId={receiverId} />
          </div>
        </div>
      </div>
    </>
  );
}
