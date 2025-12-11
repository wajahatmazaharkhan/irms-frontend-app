"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Send,
  Dot,
  Check,
  CheckCheck,
  Loader2,
  AlertCircle,
  Wifi,
  WifiOff,
  MessageCircle,
} from "lucide-react";
import axios from "axios";
import { io } from "socket.io-client";
import TopNavbar from "../Components/TopNavbar";

export default function RealtimeChat() {
  const senderId = localStorage.getItem("userId");
  const { receiverId } = useParams();

  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [isReceiverTyping, setIsReceiverTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // ✅ receiver (intern) details
  const [receiver, setReceiver] = useState(null);

  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

      // Join room after connection
      if (senderId && receiverId) {
        socket.emit("joinRoom", { senderId, receiverId });
        console.log("Joined room:", { senderId, receiverId });
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setIsConnected(false);
      setIsOnline(false);

      // Attempt to reconnect after 3 seconds
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
      console.log("Received new message:", msg);

      // Check if message belongs to current conversation
      const isRelevantMessage =
        (msg.sender === senderId && msg.receiver === receiverId) ||
        (msg.sender === receiverId && msg.receiver === senderId);

      if (isRelevantMessage) {
        setMessages((prev) => {
          // Prevent duplicate messages
          const messageExists = prev.some(
            (m) =>
              m._id === msg._id ||
              (m.content === msg.content &&
                m.sender === msg.sender &&
                Math.abs(
                  new Date(m.createdAt || m.timestamp || "").getTime() -
                    new Date(msg.createdAt || msg.timestamp || "").getTime()
                ) < 1000)
          );

          if (messageExists) {
            return prev;
          }

          return [...prev, msg];
        });

        // Mark as seen if message is from receiver
        if (msg.sender === receiverId) {
          markMessagesAsSeen();
        }

        setTimeout(scrollToBottom, 100);
      }
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
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, delivered: true } : msg
        )
      );
    });

    socket.on("messageSeen", ({ messageId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, seen: true } : msg
        )
      );
    });

    return socket;
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
      setMessages(res.data.data || []);
      console.log("Fetched messages:", res.data.data);
      setTimeout(scrollToBottom, 100);
    } catch (err) {
      console.error("Error fetching messages", err);

      // ✅ If no messages yet (404) → empty chat, no error banner
      if (err.response?.status === 404) {
        setMessages([]);
        setError(null);
      } else {
        setError("Failed to load messages. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // fetch intern / receiver details
  const fetchReceiverDetails = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/auth/user/${receiverId}`
      );
      setReceiver(res.data);
    } catch (err) {
      console.error("Failed to fetch receiver details", err);
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

    const tempMessage = {
      sender: senderId,
      receiver: receiverId,
      content: messageContent,
      timestamp: new Date().toISOString(),
      delivered: false,
      seen: false,
    };

    // Optimistically add message to UI
    setMessages((prev) => [...prev, tempMessage]);
    setTimeout(scrollToBottom, 100);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/chat/send`,
        {
          sender: senderId,
          receiver: receiverId,
          content: messageContent,
        }
      );

      // Emit to socket for real-time delivery
      if (socketRef.current?.connected) {
        socketRef.current.emit("sendMessage", {
          ...res.data.data,
          room: `${senderId}-${receiverId}`,
        });
      }

      // Update the temporary message with server response
      setMessages((prev) =>
        prev.map((msg, index) =>
          index === prev.length - 1 && msg.content === messageContent
            ? { ...res.data.data, delivered: true }
            : msg
        )
      );

      console.log("Message sent successfully:", res.data);
    } catch (err) {
      console.error("Sending failed", err);
      setError("Failed to send message. Please try again.");

      // Remove the failed message
      setMessages((prev) => prev.filter((msg) => msg !== tempMessage));
    } finally {
      setIsSending(false);
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

  // Initialize socket and fetch messages + receiver details
  useEffect(() => {
    if (!senderId || !receiverId) return;

    const socket = initializeSocket();
    fetchMessages();
    fetchReceiverDetails();

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
  }, [senderId, receiverId, initializeSocket]);

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  if (!senderId || !receiverId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Missing Information
          </h2>
          <p className="text-gray-600">User ID or Receiver ID not found</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <TopNavbar />
      <div className=" max-h-screen h-[84.3vh]   flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:to-gray-800">
        {/* Header with intern details */}
        <div className="px-4 sm:px-6 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center gap-3">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
            alt="Intern"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-nonefull flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
              {receiver?.name || "Intern"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {receiver?.email || receiver?.role || ""}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 py-2 truncate">
              Messages are not end-to-end encrypted secured
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-4 mt-4 px-4 py-3 bg-red-100 border border-red-300 rounded-nonelg text-red-700">
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-sm flex-1">{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-2 text-red-500 hover:text-red-700 text-lg leading-none"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageCircle className="w-8 h-8  text-blue-500 mx-auto mb-2" />
                <p className="text-gray-500">Send a message...</p>
              </div>
            </div>
          ) : null}
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
                <p className="text-gray-500">Loading messages...</p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, index) => (
                <div
                  key={msg._id || index}
                  className={`flex items-end gap-2 ${
                    msg.sender === senderId ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender !== senderId && (
                    <img
                      src={`https://cdn-icons-png.flaticon.com/512/3177/3177440.png`}
                      alt="User"
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-nonefull flex-shrink-0"
                    />
                  )}

                  <div
                    className={`max-w-[75%] sm:max-w-sm px-3 sm:px-4 py-2 rounded-none2xl text-sm shadow-sm ${
                      msg.sender === senderId
                        ? "bg-blue-600 text-white rounded-nonebr-md"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-nonebl-md"
                    }`}
                  >
                    <p className="break-words">{msg.content}</p>
                    <div className="flex items-center justify-between mt-1 gap-2">
                      <p className="text-[10px] opacity-60 flex-shrink-0">
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
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-nonefull flex-shrink-0"
                    />
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isReceiverTyping && (
                <div className="flex items-center space-x-2  text-sm text-gray-500 dark:text-gray-400">
                  <img
                    src={`https://cdn-icons-png.flaticon.com/512/3177/3177440.png`}
                    alt="User"
                    className="w-6 h-6 rounded-nonefull"
                  />
                  <div className="flex items-center space-x-1">
                    <Dot className="animate-bounce text-blue-500" />
                    <Dot
                      className="animate-bounce text-blue-500"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <Dot
                      className="animate-bounce text-blue-500"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <span className="ml-2">typing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Box */}
        <div className="border-t bg-white dark:bg-gray-900 p-4">
          <div className="flex items-center gap-3 max-w-4xl mx-auto">
            <input
              value={content}
              onChange={handleTyping}
              onKeyDown={handleKeyPress}
              type="text"
              placeholder="Type a message..."
              disabled={isSending || !isConnected}
              className="flex-1 px-4 py-2 sm:py-3 rounded-nonefull border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 focus:border-transparent dark:bg-gray-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            />
            <button
              onClick={handleSend}
              disabled={isSending || !content.trim() || !isConnected}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 sm:p-3 rounded-nonefull hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex-shrink-0"
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
    </>
  );
}
