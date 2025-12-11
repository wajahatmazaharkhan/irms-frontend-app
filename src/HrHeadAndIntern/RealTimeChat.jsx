"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Send,
  Dot,
  Check,
  CheckCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import { io } from "socket.io-client";

/**
 * RealtimeChat
 * - fixes double-scroll (only messages scroll)
 * - ensures newest message appears at the bottom (oldest -> newest sorting)
 * - keeps optimistic updates + socket handling
 */

export default function RealtimeChat({ ReceiverId }) {
  const senderId = localStorage.getItem("userId");
  const receiverId = ReceiverId || "";

  const [Reciver, setReciver] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [isReceiverTyping, setIsReceiverTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  // Helper: sort messages oldest -> newest
  const sortMessagesAsc = (arr = []) =>
    [...arr].sort((a, b) => {
      const ta = new Date(a.createdAt || a.timestamp || 0).getTime();
      const tb = new Date(b.createdAt || b.timestamp || 0).getTime();
      return ta - tb;
    });

  const scrollToBottom = useCallback(() => {
    // scrollIntoView with block "end" is more reliable to ensure bottom alignment
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, []);

  const initializeSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    socketRef.current = io(`${import.meta.env.VITE_BASE_URL}`, {
      transports: ["websocket", "polling"],
      timeout: 20000,
      forceNew: true,
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      setIsConnected(true);
      setIsOnline(true);

      if (senderId && receiverId) {
        socket.emit("joinRoom", { senderId, receiverId });
        console.log("Joined room:", { senderId, receiverId });
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setIsConnected(false);
      setIsOnline(false);

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      reconnectTimeoutRef.current = setTimeout(() => {
        console.log("Attempting to reconnect...");
        socket.connect();
      }, 3000);
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setIsConnected(false);
      setIsOnline(false);
    });

    socket.on("newMessage", (msg) => {
      // Only handle relevant messages (two-way)
      const isRelevantMessage =
        (msg.sender === senderId && msg.receiver === receiverId) ||
        (msg.sender === receiverId && msg.receiver === senderId);

      if (!isRelevantMessage) return;

      setMessages((prev) => {
        // Avoid duplicates by server _id or by unique combination (fallback)
        const exists = prev.some(
          (m) =>
            (m._id && msg._id && m._id === msg._id) ||
            (m.tempId && msg.tempId && m.tempId === msg.tempId) ||
            (m.content === msg.content &&
              m.sender === msg.sender &&
              Math.abs(
                new Date(m.createdAt || m.timestamp || 0).getTime() -
                  new Date(msg.createdAt || msg.timestamp || 0).getTime()
              ) < 1000)
        );

        if (exists) {
          // If there's a temp message matching this new server message, replace it
          const replaced = prev.map((m) => {
            if (m.tempId && msg._tempMatch === m.tempId) {
              return { ...msg }; // server message
            }
            if (m.tempId && msg.tempId && m.tempId === msg.tempId) {
              return { ...msg };
            }
            if (m._id && msg._id && m._id === msg._id) return { ...msg };
            return m;
          });
          return sortMessagesAsc(replaced);
        }

        return sortMessagesAsc([...prev, msg]);
      });

      if (msg.sender === receiverId) {
        markMessagesAsSeen();
      }

      // small delay to allow DOM update
      setTimeout(scrollToBottom, 120);
    });

    socket.on("typing", ({ senderId: typerId }) => {
      if (typerId === receiverId) {
        setIsReceiverTyping(true);
        scrollToBottom();
      }
    });

    socket.on("stopTyping", ({ senderId: typerId }) => {
      if (typerId === receiverId) {
        setIsReceiverTyping(false);
      }
    });

    socket.on("messageDelivered", ({ messageId }) => {
      setMessages((prev) =>
        sortMessagesAsc(
          prev.map((msg) =>
            msg._id === messageId ? { ...msg, delivered: true } : msg
          )
        )
      );
    });

    socket.on("messageSeen", ({ messageId }) => {
      setMessages((prev) =>
        sortMessagesAsc(
          prev.map((msg) =>
            msg._id === messageId ? { ...msg, seen: true } : msg
          )
        )
      );
    });

    return socket;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [senderId, receiverId, scrollToBottom]);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await axios.get(
        `${
          import.meta.env.VITE_BASE_URL
        }/chat/history/${senderId}/${receiverId}`
      );

      // If backend returns data, even empty array, set it normally
      setMessages(res.data?.data || []);
      setTimeout(scrollToBottom, 120);
    } catch (err) {
      console.error("Error fetching messages", err);

      // ⬇️ THIS IS THE IMPORTANT PART
      // If status is 404 => treat as "no messages yet", NOT as an error
      if (err.response?.status === 404) {
        setMessages([]); // empty chat
        setError(null); // don't show "Failed to load messages"
      } else {
        // Any other error (500, network, etc.) still shows error UI
        setError("Failed to load messages. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const markMessagesAsSeen = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/chat/mark-seen`, {
        senderId: receiverId,
        receiverId: senderId,
      });
    } catch (err) {
      console.error("Failed to mark as seen", err);
    }
  };

  const handleSend = async () => {
    if (!content.trim() || isSending || !socketRef.current?.connected) return;

    const messageContent = content.trim();
    setContent("");
    setIsSending(true);

    // create a stable tempId to match server response
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const tempMessage = {
      tempId,
      sender: senderId,
      receiver: receiverId,
      content: messageContent,
      timestamp: new Date().toISOString(),
      delivered: false,
      seen: false,
    };

    // optimistic add (append)
    setMessages((prev) => sortMessagesAsc([...prev, tempMessage]));
    setTimeout(scrollToBottom, 120);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/chat/send`,
        {
          sender: senderId,
          receiver: receiverId,
          content: messageContent,
          tempId, // include so server can echo if supported
        }
      );

      const serverMsg = res.data.data;

      // If server returns a message id, replace temp message with server message
      setMessages((prev) =>
        sortMessagesAsc(
          prev.map((m) => {
            if (m.tempId && m.tempId === tempId) {
              // preserve any delivered/seen flags from server
              return { ...serverMsg };
            }
            return m;
          })
        )
      );

      // Emit via socket (server message object)
      if (socketRef.current?.connected) {
        socketRef.current.emit("sendMessage", {
          ...serverMsg,
          room: `${senderId}-${receiverId}`,
          tempId,
        });
      }

      console.log("Message sent successfully:", res.data);
    } catch (err) {
      console.error("Sending failed", err);
      setError("Failed to send message. Please try again.");
      // remove temp message
      setMessages((prev) => prev.filter((m) => m.tempId !== tempId));
    } finally {
      setIsSending(false);
      setTimeout(scrollToBottom, 120);
    }
  };

  const handleTyping = (e) => {
    setContent(e.target.value);

    if (socketRef.current?.connected) {
      socketRef.current.emit("typing", { senderId, receiverId });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (socketRef.current?.connected) {
        socketRef.current.emit("stopTyping", { senderId, receiverId });
      }
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMessageStatus = (message) => {
    if (message.sender !== senderId) return null;

    if (message.seen) {
      return <CheckCheck className="w-3 h-3 text-blue-500" />;
    } else if (message.delivered) {
      return <CheckCheck className="w-3 h-3 text-gray-400" />;
    } else {
      return <Check className="w-3 h-3 text-gray-400" />;
    }
  };

  // Initialize socket and fetch messages
  useEffect(() => {
    if (!senderId || !receiverId) return;

    const socket = initializeSocket();
    fetchMessages();

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socket) {
        socket.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [senderId, receiverId, initializeSocket]);

  // Auto-scroll when messages length changes
  useEffect(() => {
    scrollToBottom();
  }, [messages.length, scrollToBottom]);

  useEffect(() => {
    const fetchReceiverData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/auth/user/${receiverId}`
        );
        setReciver(response.data);
      } catch (err) {
        console.error("Error fetching receiver data:", err);
        setError("Failed to load receiver information. Please try again.");
      }
    };

    if (receiverId) {
      fetchReceiverData();
    }
  }, [receiverId]);

  // Missing info screen
  if (!senderId) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 overflow-hidden">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 dark:text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Missing Information
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            User ID or Receiver ID not found
          </p>
        </div>
      </div>
    );
  }

  // No receiver selected screen
  if (!receiverId) {
    return (
      <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/40 rounded-none flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-blue-600 dark:text-blue-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Welcome to HR Chat
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Select an employee from the sidebar to start a conversation. You
              can search by name or filter by department.
            </p>
            <div className="bg-white dark:bg-gray-900/70 p-4 border border-gray-200 dark:border-gray-700 shadow-sm rounded-none">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                Quick Tips:
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 text-left">
                <li>• Use the search bar to find employees quickly</li>
                <li>• Filter by department for better organization</li>
                <li>• Online status indicators show availability</li>
                <li>• Unread message badges keep you updated</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main chat screen
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header + Error (non-scrollable) */}
      <div className="shrink-0">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="relative">
            <img
              src={`https://cdn-icons-png.flaticon.com/512/3177/3177440.png`}
              alt={"User Avatar"}
              className="w-10 h-10 object-cover rounded-none"
            />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">
              {Reciver?.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {Reciver?.role}
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-4 mt-4 mb-2 px-4 py-3 bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-700 rounded-none text-red-700 dark:text-red-300">
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-sm flex-1">{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-2 text-red-500 dark:text-red-300 hover:text-red-700 dark:hover:text-red-200 text-lg leading-none"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main area: messages (scrollable) + input (fixed) */}
      <div className="flex-1 min-h-0 flex flex-col">
        {/* Chat Body (only this scrolls) */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">
                  Loading messages...
                </p>
              </div>
            </div>
          ) : (
            // Container that preserves DOM order (oldest -> newest)
            <div className="flex flex-col space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={msg._id || msg.tempId || index}
                  className={`flex items-end gap-2 ${
                    msg.sender === senderId ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender !== senderId && (
                    <img
                      src={`https://cdn-icons-png.flaticon.com/512/3177/3177440.png`}
                      alt="User"
                      className="w-6 h-6 sm:w-8 sm:h-8 object-cover rounded-none flex-shrink-0"
                    />
                  )}

                  <div
                    className={`max-w-[75%] sm:max-w-sm px-3 sm:px-4 py-2 text-sm shadow-sm ${
                      msg.sender === senderId
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                    }`}
                  >
                    <p className="break-words">{msg.content}</p>
                    <div className="flex items-center justify-between mt-1 gap-2">
                      <p className="text-[10px] opacity-60 flex-shrink-0 text-gray-800 dark:text-gray-200">
                        {formatTime(msg.createdAt || msg.timestamp)}
                      </p>
                      <div className="flex-shrink-0">
                        {getMessageStatus(msg)}
                      </div>
                    </div>
                  </div>

                  {msg.sender === senderId && (
                    <img
                      src={`https://cdn-icons-png.flaticon.com/512/3177/3177440.png`}
                      alt="You"
                      className="w-6 h-6 sm:w-8 sm:h-8 object-cover rounded-none flex-shrink-0"
                    />
                  )}
                </div>
              ))}

              {/* Typing */}
              {isReceiverTyping && (
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <img
                    src={`https://cdn-icons-png.flaticon.com/512/3177/3177440.png`}
                    alt="User"
                    className="w-6 h-6 object-cover rounded-none"
                  />
                  <div className="flex items-center space-x-1">
                    <Dot className="animate-bounce" />
                    <Dot
                      className="animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <Dot
                      className="animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <span className="ml-2">typing...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input (fixed at bottom) */}
        <div className="shrink-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3">
          <div className="flex items-center gap-3 max-w-4xl mx-auto">
            <input
              value={content}
              onChange={handleTyping}
              onKeyDown={handleKeyPress}
              type="text"
              placeholder={isConnected ? "Type a message..." : "Connecting..."}
              disabled={isSending || !isConnected}
              className="flex-1 px-4 py-2 sm:py-3 rounded-none border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 focus:border-transparent dark:focus:ring-blue-500 dark:bg-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            />
            <button
              onClick={handleSend}
              disabled={isSending || !content.trim() || !isConnected}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 sm:p-3 rounded-none hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
