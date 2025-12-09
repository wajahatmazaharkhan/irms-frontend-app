"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Send, Loader2, MoreVertical, X, Dot, Menu } from "lucide-react";
import { io } from "socket.io-client";
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
  const [isTyping, setIsTyping] = useState(false);
  const [socket, setSocket] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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

  const initSocket = (ticket) => {
    if (!ticket) return;

    const sock = io(baseUrl, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
    });

    sock.emit("joinTicketRoom", {
      ticketId: ticket._id,
      userId: userId
    });

    sock.on("newTicketMessage", (msg) => {
      if (msg.ticketId === ticket._id) {
        setMessages((prev) => [...prev, msg]);
        setTimeout(scrollToBottom, 100);
      }
    });

    sock.on("typing", ({ senderId }) => {
      if (senderId === ticket.createdBy._id) setIsTyping(true);
    });

    sock.on("stopTyping", ({ senderId }) => {
      if (senderId === ticket.createdBy._id) setIsTyping(false);
    });

    setSocket(sock);
    return sock;
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedTicket) return;

    setNewMessage("");
    setSending(true);

    try {
      await axios.post(`${baseUrl}/ticket/${selectedTicket._id}/message`, {
        senderId: userId,
        text: newMessage,
      });

      socket?.emit("sendTicketMessage", {
        sender: userId,
        text: newMessage,
        ticketId: selectedTicket._id,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Sending failed:", err);
    } finally {
      setSending(false);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (socket && selectedTicket?.createdBy) {
      socket.emit("typing", {
        senderId: userId,
        receiverId: selectedTicket.createdBy._id,
      });
      setTimeout(() => {
        socket.emit("stopTyping", {
          senderId: userId,
          receiverId: selectedTicket.createdBy._id,
        });
      }, 1000);
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
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (selectedTicket) {
      fetchMessages(selectedTicket._id);
      const newSocket = initSocket(selectedTicket);
      return () => {
        if (newSocket) newSocket.disconnect();
      };
    }
  }, [selectedTicket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Ticket List Item Component
  const TicketListItem = ({ ticket }) => (
    <div
      onClick={() => {
        setSelectedTicket(ticket);
        setMobileSidebarOpen(false);
      }}
      className={`cursor-pointer border rounded-nonelg p-3 md:p-4 transition-all duration-200 ${selectedTicket?._id === ticket._id
        ? "bg-indigo-50 border-indigo-300 shadow-sm"
        : "border-gray-200 hover:bg-gray-50 hover:shadow-xs"
        }`}
    >
      <h3 className="font-semibold text-gray-800 text-sm md:text-base">
        {ticket.title}
      </h3>
      <div className="flex items-center justify-between mt-1">
        <span
          className={`text-xs px-2 py-1 rounded-nonefull ${ticket.status === "open"
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
  );

  // Message Bubble Component
  const MessageBubble = ({ msg }) => {
    const isSender = (msg.sender._id || msg.sender) === userId;
    return (
      <div
        className={`px-3 py-2 md:px-4 md:py-3 rounded-none2xl max-w-xs md:max-w-md ${isSender
          ? "bg-gray-500 text-white rounded-nonebr-none shadow-md"
          : "bg-blue-200 text-gray-900 rounded-nonebl-none shadow-sm border border-gray-200"
          }`}
      >
        <p className="text-sm">{msg.text}</p>
        <p
          className={`text-xs mt-1 ${isSender ? "text-indigo-100" : "text-gray-500"
            }`}
        >
          {new Date(msg.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    );
  };

  // Chat Header Component
  const ChatHeader = () => (
    <div className="border-b border-gray-200 p-3 md:p-4 bg-indigo-600 text-white">
      <div className="flex items-center gap-2">
        <button
          className="md:hidden p-1 rounded-nonefull hover:bg-indigo-700"
          onClick={() => setMobileSidebarOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm md:text-base font-bold truncate">
            {selectedTicket.title}
          </h2>
          <p className="text-xs md:text-sm text-indigo-100 truncate">
            Chat with {selectedTicket.createdBy?.name} •{" "}
            {selectedTicket.createdBy?.email}
          </p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowActions((prev) => !prev)}
            className="p-1 md:p-2 hover:bg-indigo-700 rounded-nonefull"
          >
            <MoreVertical className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          {showActions && (
            <div className="absolute right-0 mt-2 w-32 md:w-40 bg-white rounded-nonemd shadow-lg border z-10 text-gray-900 text-xs md:text-sm">
              <button
                onClick={() => {
                  setShowActions(false);
                  setShowCloseModal(true);
                }}
                className="w-full text-left px-3 py-2 hover:bg-gray-100"
              >
                Request Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Message Input Component
  const MessageInput = () => {
    const inputRef = useRef(null);

    // Focus input when component mounts or when sending state changes
    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, [sending]);

    const handleInputChange = (e) => {
      setNewMessage(e.target.value);
      // Add any typing indicators or socket events here if needed
      // For example:
      // if (socket) {
      //   socket.emit('typing', { userId });
      //   setTimeout(() => socket.emit('stopTyping', { userId }), 1000);
      // }
    };

    return (
      <div className="border-t border-gray-200 p-3 md:p-4 bg-white">
        <div className="flex gap-2 items-center">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 px-3 py-2 md:px-4 md:py-3 rounded-nonefull focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
          />
          <button
            onClick={handleSend}
            disabled={sending || !newMessage.trim()}
            className={`p-2 md:p-3 rounded-nonefull ${sending || !newMessage.trim()
                ? "bg-gray-300 text-gray-500"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transform hover:scale-105 transition-all"
              }`}
          >
            {sending ? (
              <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
            ) : (
              <Send className="w-4 h-4 md:w-5 md:h-5" />
            )}
          </button>
        </div>
      </div>
    );
  };

  // Mobile Sidebar Component
  const MobileSidebar = () => (
    <div className="fixed inset-0 z-40 md:hidden">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={() => setMobileSidebarOpen(false)}
      />
      <div className="absolute left-0 top-0 bottom-0 w-4/5 max-w-sm bg-white shadow-xl">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">My Assigned Tickets</h2>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="p-1 rounded-nonefull hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100%-56px)]">
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
                <TicketListItem key={ticket._id} ticket={ticket} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Close Ticket Modal Component
  const CloseTicketModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-nonelg shadow-xl p-4 md:p-6 w-[90%] max-w-sm">
        <div className="flex justify-between items-center mb-3 md:mb-4">
          <h3 className="text-base md:text-lg font-semibold">Close Ticket</h3>
          <button
            onClick={() => setShowCloseModal(false)}
            className="text-gray-500 hover:text-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs md:text-sm text-gray-600 mb-4 md:mb-6">
          Are you sure you want to close this ticket? It will move to{" "}
          <span className="font-medium">Pending Confirmation</span>.
        </p>
        <div className="flex justify-end gap-2 md:gap-3">
          <button
            onClick={() => setShowCloseModal(false)}
            className="px-3 py-1 md:px-4 md:py-2 border rounded-nonemd text-xs md:text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleCloseTicket}
            className="px-3 py-1 md:px-4 md:py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-nonemd text-xs md:text-sm"
          >
            Yes, Close
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <NavBar />

      {/* Mobile Header */}
      <div className="md:hidden p-3 border-b border-gray-200 bg-white flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">My Assigned Tickets</h2>
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="p-1 rounded-nonefull hover:bg-gray-100"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 bg-white overflow-y-auto">
          <div className="p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">
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
                  <TicketListItem key={ticket._id} ticket={ticket} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-white relative">
          {selectedTicket ? (
            <>
              <ChatHeader />

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-b from-gray-50 to-white space-y-3 md:space-y-4">
                {loadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400">Start the conversation</p>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${(msg.sender._id || msg.sender) === userId
                          ? "justify-end"
                          : "justify-start"
                          }`}
                      >
                        <MessageBubble msg={msg} />
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex items-center space-x-1 text-xs md:text-sm text-gray-500">
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

              <MessageInput />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-4">
              <div className="text-center p-4 md:p-6 max-w-md">
                <div className="mx-auto w-14 h-14 md:w-16 md:h-16 bg-indigo-100 rounded-nonefull flex items-center justify-center mb-3 md:mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 md:h-8 md:w-8 text-indigo-600"
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
                <h3 className="text-base md:text-lg font-medium text-gray-800 mb-1">
                  No ticket selected
                </h3>
                <p className="text-sm text-gray-500 mb-3 md:mb-4">
                  Select a ticket from the left panel to view and send messages
                </p>
                <button
                  onClick={() => setMobileSidebarOpen(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-nonemd text-sm md:text-base md:hidden"
                >
                  View Tickets
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar */}
      {mobileSidebarOpen && <MobileSidebar />}

      {/* Close Ticket Modal */}
      {showCloseModal && <CloseTicketModal />}
    </div>
  );
};

export default ManageTickets;