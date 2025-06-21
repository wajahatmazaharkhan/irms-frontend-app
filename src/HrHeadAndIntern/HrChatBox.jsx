"use client"

import { useState } from "react"
import { UserList } from "./UserList"
import RealtimeChat from "./RealTimeChat"
import CustomHrNavbar from "./CustomHrNavbar"
import { useEffect } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"




export default function HRChatDashboard() {
    const [selectedUser, setSelectedUser] = useState(null)
    const [currentUserId] = useState(localStorage.getItem("userId") || null) // Mock HR user ID
    const [users, setUsers] = useState([])
    const { receiverId } = useParams();

    console.log("Current User ID:", currentUserId);



    const fetchHrBatchData = async () => {
        try {
            const hrId = localStorage.getItem("userId");
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/batch/get-ids`);
            const hrBatches = response.data.data.filter(batch =>
                batch.hr.some(hr => hr._id === hrId)
            );

            const hrInternIds = hrBatches.flatMap(batch =>
                batch.interns.map(intern => intern._id)
            );

            return hrInternIds;
        } catch (error) {
            console.error("Error fetching HR batch data:", error);
            return [];
        }
    };

    const fetchUsers = async () => {
        try {


            // Get HR's batch intern IDs first
            const hrInternIds = await fetchHrBatchData();

            // Fetch all users
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/allusers`);
            if (!response.ok) {
                throw new Error(`Failed to fetch users (Status: ${response.status})`);
            }
            const result = await response.json();

            // Filter users to only show HR's batch interns
            const filteredUsers = result.data.filter(user =>
                hrInternIds.includes(user._id) && user.role === "intern"
            );

            setUsers(filteredUsers || []);
            console.log(filteredUsers);


        } catch (err) {
            console.log("Error fetching users:", err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Use `users` as mockUsers for UserList and ChatArea


    return (
        <>
            <CustomHrNavbar />
            <div className="h-full max-h-screen bg-gray-50 flex overflow-hidden">
                {/* Custom Sidebar */}
                <div
                    className={`w-80 transition-all duration-300 bg-white border-r border-gray-200 flex-shrink-0 overflow-hidden md:w-80 md:block block`}
                >
                    <UserList
                        users={users}
                        selectedUser={selectedUser}
                        setSelectedUser={setSelectedUser}
                    />
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col min-w-0">
                    <RealtimeChat ReceiverId={receiverId} />
                </div>
            </div>
        </>
    )
}
