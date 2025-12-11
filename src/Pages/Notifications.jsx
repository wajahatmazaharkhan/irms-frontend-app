import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Skeleton } from "@/Components/ui/skeleton";
import { AlertCircle, Bell, Calendar, Trash, Clock, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Navbar, SideNav, Footer, useTitle } from "@/Components/compIndex";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Badge } from "@/Components/ui/badge";
import { useAuthContext } from "@/context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppContext } from "@/context/AppContext";

const Notifications = () => {
  useTitle("Notifications");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [taskDetails, setTaskDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { loggedIn } = useAuthContext();
  const { setNotiCounter } = useAppContext();

  useEffect(() => {
    const fetchNotifications = async () => {
      const userId = localStorage.getItem("userId");
      const reqbody = { userId: userId };
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/get-notifications`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json", // important!
            },
            body: JSON.stringify(reqbody),
          }
        );
        if (!response.ok) throw new Error("Failed to fetch notifications");
        const data = await response.json();
        if (data?.notifications?.notifications) {
          const sortedNotifications = data.notifications.notifications.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setNotifications(sortedNotifications);
        } else {
          setError("No notifications found");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (loggedIn) fetchNotifications();
    else setLoading(false);
  }, [loggedIn]);

  const fetchTaskDetails = async (taskId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/task/get-task/${taskId}`
      );
      if (!response.ok) throw new Error("Failed to fetch task details");
      const data = await response.json();
      if (data.taskDetails) {
        setTaskDetails(data.taskDetails);
      }
    } catch (error) {
      console.error("Error fetching task details:", error);
      setTaskDetails(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  ////////////////////////////////
  //                            //
  //        TIMINGS AGO         //
  //                            //
  ////////////////////////////////

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const handleNotificationClick = async (notification) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);

    // Only fetch task details if task exists
    if (notification.task) {
      setTaskDetails(null); // Reset previous details
      await fetchTaskDetails(notification.task);
    }
  };

  const getNotificationTypeStyles = (type) => {
    const types = {
      update:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-800",
      alert:
        "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 dark:border-red-800",
      reminder:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-800",
      success:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 dark:border-green-800",
      default:
        "bg-gray-100 text-gray-800 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700",
    };
    return types[type?.toLowerCase()] || types.default;
  };

  const renderNotificationSkeleton = () => (
    <div className="space-y-6">
      {[1, 2, 3].map((index) => (
        <div
          key={index}
          className="p-4 border rounded-nonelg bg-white shadow-sm dark:bg-slate-900 dark:border-slate-700"
        >
          <div className="flex items-start space-x-4">
            <Skeleton className="h-10 w-10 rounded-nonefull" />
            <div className="space-y-3 flex-1">
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  ////////////////////////////////
  //                            //
  //  Notification with tasks   //
  //                            //
  ////////////////////////////////

  const renderTaskDetails = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
            {taskDetails.title}
          </h3>
          <Badge
            className={`${getNotificationTypeStyles(
              taskDetails.status
            )} capitalize px-3 py-1 border`}
          >
            {taskDetails.status}
          </Badge>
        </div>

        <p className="text-gray-600 dark:text-slate-300">
          {taskDetails.description || "No description available."}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-nonelg dark:bg-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-nonelg dark:bg-blue-900">
                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  Start Date
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-slate-100">
                  {formatDate(taskDetails.startDate)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-nonelg dark:bg-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-nonelg dark:bg-red-900">
                <Calendar className="h-5 w-5 text-red-600 dark:text-red-300" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  End Date
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-slate-100">
                  {formatDate(taskDetails.endDate)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  ////////////////////////////////
  //                            //
  // Notification without tasks //
  //                            //
  ////////////////////////////////

  const renderSimpleNotification = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <Badge
          className={`${getNotificationTypeStyles(
            selectedNotification?.type
          )} px-3 py-1 border`}
        >
          {selectedNotification?.type || "Update"}
        </Badge>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
          <Clock className="h-4 w-4" />
          {getTimeAgo(selectedNotification?.createdAt)}
        </div>
      </div>
      <p className="text-gray-900 font-medium dark:text-slate-100">
        {selectedNotification?.message}
      </p>
      {selectedNotification?.description && (
        <p className="text-sm text-gray-600 mt-2 dark:text-slate-300">
          {selectedNotification.description}
        </p>
      )}
      <p className="text-xs text-gray-400 mt-2 dark:text-slate-500">
        {formatDate(selectedNotification?.createdAt)}
      </p>
    </div>
  );

  ////////////////////////////////
  //                            //
  //    DELETE NOTIFICATION     //
  //                            //
  ////////////////////////////////

  const deleteNoti = async (noteId, e) => {
    if (e) {
      e.stopPropagation();
    }
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    try {
      const repsonse = await axios.delete(
        `${
          import.meta.env.VITE_BASE_URL
        }/delete-notification/?notificationId=${noteId}&userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (repsonse.status === 200) {
        toast.success("Notification deleted");
        setIsModalOpen(false);
        const updatedNotifications = notifications.filter(
          (note) => note._id !== noteId
        );
        setNotifications(updatedNotifications);
        setNotiCounter(updatedNotifications.length);
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  return (
    <>
      <Navbar />
      <div className="relative bg-gray-50 dark:bg-slate-950 min-h-screen ml-0 md:ml-32 dark:text-slate-100">
        <div className="p-6">
          <div className="max-w-5xl mx-auto">
            <Card className="shadow-lg dark:bg-slate-900 dark:border dark:border-slate-800">
              <CardHeader className="border-b bg-white dark:bg-slate-900 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold flex items-center gap-3 text-gray-900 dark:text-slate-100">
                    <div className="p-2 bg-blue-100 rounded-nonelg dark:bg-blue-900">
                      <Bell className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                    </div>
                    Notifications Center
                  </CardTitle>
                  {notifications.length > 0 && (
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800">
                      {notifications.length} New
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {!loggedIn && (
                  <Alert className="bg-yellow-50 border-yellow-200 mb-6 dark:bg-yellow-950 dark:border-yellow-900">
                    <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-300" />
                    <AlertDescription className="text-yellow-700 ml-2 dark:text-yellow-100">
                      Please log in to view your notifications
                    </AlertDescription>
                  </Alert>
                )}

                {loading && renderNotificationSkeleton()}

                {error && (
                  <Alert
                    variant="destructive"
                    className="mb-6 dark:bg-red-950 dark:border-red-900 dark:text-red-100"
                  >
                    <AlertCircle className="h-5 w-5" />
                    <AlertDescription className="ml-2">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {!loading && !error && notifications.length === 0 && (
                  <div className="text-center py-12">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-gray-100 rounded-nonefull dark:bg-slate-800">
                        <Info className="h-8 w-8 text-gray-400 dark:text-slate-400" />
                      </div>
                    </div>
                    <p className="text-gray-600 font-medium dark:text-slate-200">
                      No notifications available
                    </p>
                    <p className="text-gray-400 text-sm mt-1 dark:text-slate-400">
                      Check back later for updates
                    </p>
                  </div>
                )}

                {!loading && !error && notifications.length > 0 && (
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification._id}
                        className="group p-4 border rounded-nonelg hover:border-blue-200 bg-white hover:bg-blue-50/50
                         transition-all duration-200 cursor-pointer transform hover:-translate-y-1 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-blue-500 dark:hover:bg-slate-800"
                      >
                        <div className="flex item-center gap-4">
                          <div
                            className="flex-1 cursor-pointer"
                            onClick={() =>
                              handleNotificationClick(notification)
                            }
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <Badge
                                className={`${getNotificationTypeStyles(
                                  notification.type
                                )} px-3 py-1 border`}
                              >
                                {notification.type || "Update"}
                              </Badge>
                              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
                                <Clock className="h-4 w-4" />
                                {getTimeAgo(notification.createdAt)}
                              </div>
                            </div>
                            <p className="text-gray-900 font-medium group-hover:text-blue-600 transition-colors duration-200 dark:text-slate-100 dark:group-hover:text-blue-300">
                              {notification.message}
                            </p>
                            {notification.description && (
                              <p className="text-sm text-gray-600 mt-2 line-clamp-2 dark:text-slate-300">
                                {notification.description}
                              </p>
                            )}
                            <p className="text-xs text-gray-400 mt-2 dark:text-slate-500">
                              {formatDate(notification.createdAt)}
                            </p>
                          </div>
                          <button
                            onClick={(e) => deleteNoti(notification._id, e)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200
                               p-2 hover:bg-red-50 rounded-nonefull flex-shrink-0 self-center dark:hover:bg-red-950"
                            title="Delete notification"
                          >
                            <Trash className="h-5 w-5 text-red-500 dark:text-red-400" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl dark:bg-slate-900 dark:text-slate-100">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold dark:text-slate-100">
              {selectedNotification?.task
                ? "Notification Details"
                : "Notification Details"}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-6">
            {selectedNotification?.task ? (
              taskDetails ? (
                renderTaskDetails()
              ) : (
                <div className="flex capitalize justify-center items-center py-8">
                  <p className="text-gray-500 dark:text-slate-400">
                    No additional details available.
                  </p>
                </div>
              )
            ) : (
              renderSimpleNotification()
            )}
          </div>
          <div className="flex justify-center mt-6">
            <button
              onClick={() => deleteNoti(selectedNotification._id)}
              className="flex items-center space-x-2 text-red-500 outline-none dark:text-red-400"
            >
              DELETE
              <span className="ml-2">
                <Trash size={17} />
              </span>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
};

export default Notifications;
