import { useEffect, useState } from "react";
import axios from "axios";
import useTitle from "@/Components/useTitle";
import NavBar from "./CustomCommNavbar";
const baseUrl = import.meta.env.VITE_BASE_URL;
const userId = localStorage.getItem("userId");

const statusOptions = ["All", "Open", "In Progress", "Pending Confirmation", "Closed"];

const CommTeamDashboard = () => {
  useTitle("Handle Tickets");

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("All");

  const fetchAllTickets = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseUrl}/ticket/getall`);
      setTickets(res.data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTickets();
  }, []);

  const handleMarkInProgress = async (ticketId) => {
    try {
      await axios.patch(`${baseUrl}/ticket/updatestatus/${ticketId}`, {
        newStatus: "In Progress",
        userId: userId,
      });
      fetchAllTickets();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleSelfAssign = async (ticketId) => {
    try {
      await axios.patch(`${baseUrl}/ticket/assign/${ticketId}`, {
        userId: userId,
      });
      fetchAllTickets();
    } catch (error) {
      console.error("Error assigning ticket:", error);
    }
  };

  const countByStatus = (status) => {
    if (status === "All") return tickets.length;
    return tickets.filter((t) => t.status === status).length;
  };

  const filteredTickets =
    selectedTab === "All"
      ? tickets
      : tickets.filter((t) => t.status === selectedTab);

  return (
  <>
	<NavBar />
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Communication Team Dashboard</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {statusOptions.map((status) => (
          <div
            key={status}
            className={`rounded-nonexl shadow-sm p-4 ${
              selectedTab === status ? "bg-blue-100" : "bg-white"
            } hover:shadow-md cursor-pointer border`}
            onClick={() => setSelectedTab(status)}
          >
            <p className="text-sm text-gray-500">{status}</p>
            <h2 className="text-2xl font-semibold">{countByStatus(status)}</h2>
          </div>
        ))}
      </div>

      {/* Ticket List */}
      <div>
        {loading ? (
          <p>Loading tickets...</p>
        ) : Array.isArray(filteredTickets) && filteredTickets.length === 0 ? (
          <p className="text-gray-600">No tickets found in "{selectedTab}"</p>
        ) : Array.isArray(filteredTickets) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket._id}
                className="border rounded-nonexl p-5 shadow-sm bg-white hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">{ticket.title}</h3>
                  <span
                    className={`px-3 py-1 rounded-nonefull text-sm ${
                      ticket.status === "Open"
                        ? "bg-green-100 text-green-700"
                        : ticket.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-700"
                        : ticket.status === "Pending Confirmation"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>

                <p className="text-gray-600 mb-3">{ticket.description}</p>

                <div className="text-sm text-gray-500 mb-1">
                  <strong>Raised By:</strong>{" "}
                  {ticket.createdBy?.name || "Unknown"} (
                  {ticket.createdBy?.email || "No Email"})
                </div>

                <div className="text-sm text-gray-500 mb-1">
                  <strong>Assigned To:</strong>{" "}
                  {ticket.assignedTo?.name
                    ? `${ticket.assignedTo.name} (${ticket.assignedTo.email})`
                    : "Unassigned"}
                </div>

                <div className="text-sm text-gray-500">
                  <strong>Raised At:</strong>{" "}
                  {new Date(ticket.createdAt).toLocaleString()}
                </div>

                {/* Action Buttons */}
				<div className="mt-4 flex flex-wrap gap-3">
				  {ticket.status === "Open" && (
					<>
					  {ticket.assignedTo?._id === userId ? (
						<button
						  onClick={() => handleMarkInProgress(ticket._id)}
						  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
						>
						  Mark In Progress
						</button>
					  ) : ticket.assignedTo ? (
						<p className="text-sm text-gray-500">
						  Assigned to someone else
						</p>
					  ) : (
						<button
						  onClick={() => handleSelfAssign(ticket._id)}
						  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
						>
						  Assign to Self
						</button>
					  )}
					</>
				  )}
				</div>
              </div>
            ))}
          </div>
        ) : (
          <p>Something went wrong fetching tickets.</p>
        )}
      </div>
    </div>
  </>
  );
};

export default CommTeamDashboard;
