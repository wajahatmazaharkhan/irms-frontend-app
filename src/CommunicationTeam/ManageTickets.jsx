"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Send, Loader2, MoreVertical, X } from "lucide-react";
import NavBar from "./CustomCommNavbar";

const baseUrl = import.meta.env.VITE_BASE_URL;

const ManageTickets = () => {
  const userId = localStorage.getItem("userId");

  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const [loadingTickets, setLoadingTickets] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const [showActions, setShowActions] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ✅ Fetch assigned tickets
  const fetchTickets = async () => {
    try {
      setLoadingTickets(true);
      const res = await axios.get(`${baseUrl}/ticket/getall`);
      const assigned = res.data.filter(
        (ticket) => ticket.assignedTo?._id === userId
      );
      setTickets(assigned);
    } catch (err) {
      console.error("Error fetching tickets", err);
    } finally {
      setLoadingTickets(false);
    }
  };

  // ✅ Fetch messages of a ticket
  const fetchMessages = async (ticketId) => {
    try {
      setLoadingMessages(true);
      const res = await axios.get(`${baseUrl}/ticket/${ticketId}/messages`);
      setMessages(res.data.data);
      setTimeout(scrollToBottom, 100);
    } catch (err) {
      console.error("Error fetching messages", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  // ✅ Send message
  const handleSend = async () => {
    if (!newMessage.trim() || !selectedTicket) return;
    const tempMsg = {
      sender: userId,
      text: newMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);
    setNewMessage("");
    setSending(true);
    try {
      await axios.post(`${baseUrl}/ticket/${selectedTicket._id}/message`, {
        senderId: userId,
        text: tempMsg.text,
      });
    } catch (err) {
      console.error("Sending message failed", err);
    } finally {
      setSending(false);
      setTimeout(scrollToBottom, 100);
    }
  };

	const handleCloseTicket = async () => {
	  try {
		const res = await axios.patch(
		  `${baseUrl}/ticket/updatestatus/${selectedTicket._id}`,
		  {
			newStatus: "Pending Confirmation",
			userId: userId,
		  }
		);

		const updatedTicket = res.data.ticket;

		setTickets((prev) =>
		  prev.map((t) => (t._id === updatedTicket._id ? updatedTicket : t))
		);

		setSelectedTicket(updatedTicket);
		setShowCloseModal(false);
	  } catch (err) {
		console.error("Failed to close ticket", err);
	  }
	};


  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    if (selectedTicket) {
      fetchMessages(selectedTicket._id);
    }
  }, [selectedTicket]);

  return (
  <>
	<NavBar />
    <div className="flex h-[90vh] bg-gray-50 rounded-xl shadow-lg overflow-hidden">
      {/* 🔵 Left — Tickets List */}
      <div className="w-1/3 border-r border-gray-200 bg-white overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            My Assigned Tickets
          </h2>
          {loadingTickets ? (
            <div className="flex justify-center items-center h-20">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No assigned tickets found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <div
                  key={ticket._id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`cursor-pointer border rounded-lg p-4 transition-all duration-200 ${
                    selectedTicket?._id === ticket._id
                      ? "bg-indigo-50 border-indigo-300 shadow-sm"
                      : "border-gray-200 hover:bg-gray-50 hover:shadow-xs"
                  }`}
                >
                  <h3 className="font-semibold text-gray-800">
                    {ticket.title}
                  </h3>
                  <div className="flex items-center justify-between mt-1">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        ticket.status === "open"
                          ? "bg-green-100 text-green-800"
                          : ticket.status === "pending"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {ticket.status}
                    </span>
                    <p className="text-xs text-gray-500 truncate">
                      {ticket.createdBy?.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 🔴 Right — Chat Section */}
      <div className="w-2/3 flex flex-col bg-white relative">
        {selectedTicket ? (
          <>
            {/* Header */}
            <div className="border-b border-gray-200 p-5 bg-indigo-600 text-white flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold truncate">
                  {selectedTicket.title}
                </h2>
                <p className="text-sm text-indigo-100 mt-1">
                  Chat with {selectedTicket.createdBy?.name} •{" "}
                  {selectedTicket.createdBy?.email}
                </p>
              </div>

              {/* Actions Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowActions((prev) => !prev)}
                  className="p-2 hover:bg-indigo-700 rounded-full"
                >
                  <MoreVertical />
                </button>
                {showActions && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border z-10 text-gray-900">
                    <button
                      onClick={() => {
                        setShowActions(false);
                        setShowCloseModal(true);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Close Ticket
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white space-y-4">
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400">Start the conversation</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      (msg.sender._id || msg.sender) === userId
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-3 rounded-2xl max-w-md ${
                        (msg.sender._id || msg.sender) === userId
                          ? "bg-gray-500 text-white rounded-br-none shadow-md"
                          : "bg-blue-200 text-gray-900 rounded-bl-none shadow-sm border border-gray-200"
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          (msg.sender._id || msg.sender) === userId
                            ? "text-indigo-100"
                            : "text-gray-500"
                        }`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-4 bg-white">
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSend();
                  }}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  onClick={handleSend}
                  disabled={sending || !newMessage.trim()}
                  className={`p-3 rounded-full ${
                    sending || !newMessage.trim()
                      ? "bg-gray-300 text-gray-500"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transform hover:scale-105 transition-all"
                  }`}
                >
                  {sending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* 🔥 Close Modal */}
            {showCloseModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
                <div className="bg-white rounded-lg shadow-xl p-6 w-[90%] max-w-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Close Ticket</h3>
                    <button
                      onClick={() => setShowCloseModal(false)}
                      className="text-gray-500 hover:text-gray-800"
                    >
                      <X />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-6">
                    Are you sure you want to close this ticket? It will move to{" "}
                    <span className="font-medium">Pending Confirmation</span>.
                  </p>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowCloseModal(false)}
                      className="px-4 py-2 border rounded-md text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCloseTicket}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm"
                    >
                      Yes, Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-gray-50">
            <div className="text-center p-6 max-w-md">
              <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-1">
                No ticket selected
              </h3>
              <p className="text-gray-500">
                Select a ticket from the left panel to view and send messages
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  </>
  );
};

export default ManageTickets;
