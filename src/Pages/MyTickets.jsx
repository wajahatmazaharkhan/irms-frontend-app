"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Send, Loader2, Dot, Lock } from "lucide-react";
import { io } from "socket.io-client";

const baseUrl = import.meta.env.VITE_BASE_URL;

const MyTickets = () => {
  const userId = localStorage.getItem("userId");

  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [socket, setSocket] = useState(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const isMe = (msg) => (msg.sender?._id || msg.sender) === userId;

  const fetchTickets = async () => {
    try {
      const res = await axios.get(`${baseUrl}/ticket/getbyid/${userId}`);
      setTickets(res.data || []);
    } catch (err) {
      console.error("Error fetching tickets:", err);
    }
  };

  const fetchMessages = async (ticket) => {
    if (!ticket?.assignedTo) {
      setMessages([]);
      return;
    }
    try {
      setLoadingMessages(true);
      const res = await axios.get(`${baseUrl}/ticket/${ticket._id}/messages`);
      setMessages(res.data.data || []);
      setTimeout(scrollToBottom, 100);
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const initSocket = (ticket) => {
    if (!ticket?.assignedTo) return;

    const sock = io(baseUrl);

    sock.emit("joinRoom", {
      senderId: userId,
      receiverId: ticket.assignedTo._id,
    });

    sock.on("newMessage", (msg) => {
      const senderId = msg.sender?._id || msg.sender;
      const receiverId = msg.receiver?._id || msg.receiver;

      if (
        (senderId === userId && receiverId === ticket.assignedTo._id) ||
        (senderId === ticket.assignedTo._id && receiverId === userId)
      ) {
        setMessages((prev) => [...prev, msg]);
        setTimeout(scrollToBottom, 100);
      }
    });

    sock.on("typing", ({ senderId }) => {
      if (senderId === ticket.assignedTo._id) setIsTyping(true);
    });

    sock.on("stopTyping", ({ senderId }) => {
      if (senderId === ticket.assignedTo._id) setIsTyping(false);
    });

    setSocket(sock);
  };

  const handleSend = async () => {
    if (!content.trim() || !selectedTicket) return;

    const tempMsg = {
      sender: userId,
      text: content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMsg]);
    setContent("");
    setIsSending(true);
    setTimeout(scrollToBottom, 100);

    try {
      await axios.post(`${baseUrl}/ticket/${selectedTicket._id}/message`, {
        senderId: userId,
        text: tempMsg.text,
      });

      socket?.emit("sendMessage", {
        ...tempMsg,
        room: `${userId}-${selectedTicket.assignedTo._id}`,
      });
    } catch (err) {
      console.error("Send failed:", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleTyping = (e) => {
    setContent(e.target.value);

    if (socket) {
      socket.emit("typing", {
        senderId: userId,
        receiverId: selectedTicket.assignedTo._id,
      });

      setTimeout(() => {
        socket.emit("stopTyping", {
          senderId: userId,
          receiverId: selectedTicket.assignedTo._id,
        });
      }, 1000);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!selectedTicket) return;
    try {
      const res = await axios.patch(
        `${baseUrl}/ticket/updatestatus/${selectedTicket._id}`,
        {
          newStatus: newStatus,
          userId: userId,
        }
      );

      const updatedTicket = res.data.ticket;
      setTickets((prev) =>
        prev.map((t) => (t._id === updatedTicket._id ? updatedTicket : t))
      );
      setSelectedTicket(updatedTicket);
      setShowConfirmModal(false);
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    if (selectedTicket) {
      fetchMessages(selectedTicket);
      initSocket(selectedTicket);

      if (selectedTicket.status === "Pending Confirmation") {
        setShowConfirmModal(true);
      } else {
        setShowConfirmModal(false);
      }
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, [selectedTicket]);

  useEffect(() => {
    setTimeout(scrollToBottom, 100);
  }, [messages]);

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const canSend =
    selectedTicket?.assignedTo &&
    selectedTicket?.status !== "Closed" &&
    messages.some(
      (msg) => (msg.sender?._id || msg.sender) === selectedTicket.assignedTo._id
    );

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-50 rounded-lg shadow-lg overflow-hidden">
      {/* Left Panel */}
      <div className="w-1/3 border-r border-gray-200 bg-white overflow-y-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Tickets</h2>
        {tickets.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No tickets raised yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                onClick={() => setSelectedTicket(ticket)}
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  selectedTicket?._id === ticket._id
                    ? "bg-indigo-50 border-indigo-300 shadow-sm"
                    : "border-gray-200 hover:bg-gray-50 hover:shadow-xs"
                }`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-800">{ticket.title}</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      ticket.status === "Open"
                        ? "bg-green-100 text-green-800"
                        : ticket.status === "In Progress"
                        ? "bg-amber-100 text-amber-800"
                        : ticket.status === "Pending Confirmation"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1 truncate">
                  {ticket.description.slice(0, 60)}...
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col bg-white relative">
        {selectedTicket ? (
          <>
            <div className="border-b border-gray-200 p-5 bg-indigo-600 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">{selectedTicket.title}</h3>
                  {selectedTicket.assignedTo ? (
                    <p className="text-indigo-100 text-sm mt-1">
                      {selectedTicket.assignedTo.name} will connect with you shortly
                    </p>
                  ) : (
                    <p className="text-indigo-100 text-sm mt-1">
                      Connecting with the right person. This might take minutes.
                    </p>
                  )}
                </div>
                {selectedTicket.status === "Closed" && (
                  <div className="flex items-center gap-1 text-indigo-100 text-sm">
                    <Lock className="w-4 h-4" />
                    Closed
                  </div>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white space-y-4">
              {loadingMessages ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="animate-spin w-8 h-8 text-indigo-500" />
                </div>
              ) : (
                <>
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${isMe(msg) ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`px-4 py-3 rounded-2xl max-w-md ${
                          isMe(msg)
                            ? "bg-gray-600 text-white rounded-br-none shadow-md"
                            : "bg-green-200 text-gray-900 rounded-bl-none shadow-sm border border-gray-200"
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <p
                          className={`text-xs mt-1 ${
                            isMe(msg) ? "text-indigo-100" : "text-gray-500"
                          }`}
                        >
                          {formatTime(msg.createdAt || msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Dot className="animate-bounce" />
                      <Dot className="animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <Dot className="animate-bounce" style={{ animationDelay: "0.2s" }} />
                      <span>Typing...</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-4 bg-white">
              {selectedTicket.assignedTo ? (
                canSend ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={content}
                      onChange={handleTyping}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSend();
                      }}
                      placeholder="Type your message..."
                      className="flex-1 border border-gray-300 px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      disabled={isSending}
                    />
                    <button
                      onClick={handleSend}
                      disabled={!content.trim() || isSending}
                      className={`p-3 rounded-full ${
                        !content.trim() || isSending
                          ? "bg-gray-300 text-gray-500"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transform hover:scale-105 transition-all"
                      }`}
                    >
                      {isSending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Waiting for {selectedTicket.assignedTo.name} to start the conversation
                  </p>
                )
              ) : (
                <p className="text-sm text-gray-500">
                  Waiting for the team to assign someone to this ticket
                </p>
              )}
            </div>

            {/* Modal */}
            {showConfirmModal && (
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full">
                  <h3 className="text-lg font-semibold mb-4">
                    Confirm if the issue is resolved
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Do you confirm that this ticket has been resolved?
                  </p>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => handleStatusUpdate("In Progress")}
                      className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                      No
                    </button>
                    <button
                      onClick={() => handleStatusUpdate("Closed")}
                      className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                      Yes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-gray-500">
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
                Select a ticket from the left panel to view details
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTickets;
