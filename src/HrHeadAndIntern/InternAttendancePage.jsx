import { useEffect, useState } from "react"; 
import axios from "axios";
import { useParams } from "react-router-dom";
import CustomNavbar from "./CustomHrNavbar";
import { Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Search, Calendar, Users } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useTitle from "@/Components/useTitle";

const InternAttendancePage = () => {
  useTitle('Attendance Management')
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [bulkAction, setBulkAction] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [attendanceMap, setAttendanceMap] = useState({});


  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/batch/get/${id}` 
        );
        setUsers(response.data.interns);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
  const fetchAttendance = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/attendance`
      );
      const map = {};
      response.data.forEach((record) => {
        map[record.userId] = record.status;
      });
      setAttendanceMap(map);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  fetchAttendance();
  }, []);


  const date = new Date();
  const formattedDate = date.toISOString().split(".")[0] + "Z";
  const displayDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const sendNotification = async (userId, status) => {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/send/notify-single`, {
        userId: userId,
        message: `Your attendance for ${displayDate} has been marked as ${status}`,
        status: status.toLowerCase(),
      });
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  const sendBulkNotification = async (status) => {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/send/notify-all`, {
        message: `Your attendance for ${displayDate} has been marked as ${status}`,
        status: status.toLowerCase(),
      });
    } catch (error) {
      console.error("Error sending bulk notification:", error);
    }
  };

  const updateStatus = async (id, status) => {
  const attendanceStatus = {
    userId: id,
    date: formattedDate,
    status: status,
  };
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/attendance`,
      attendanceStatus
    );
    if (response.status === 409) {
      toast.error(`Attendance already marked`, {
        position: "top-left",
      });
      return "already_marked";
    }
    if ([201, 204, 205].includes(response.status)) {
      await sendNotification(id, status);

      setAttendanceMap((prevMap) => ({
        ...prevMap,
        [id]: status,
      }));

      toast.success(`Attendance marked as ${status}`, {
        position: "top-left",
      });
      return "success";
    }
    toast.error(`Failed to mark attendance`, {
      position: "top-left",
    });
    return "error";
  } catch (error) {
    if (error.response?.status === 409) {
      toast.error(`Attendance already marked`, {
        position: "top-left",
      });
      return "already_marked";
    }
    console.error("Error updating attendance:", error);
    return "error";
  }
};

const deleteAttendance = async (userId) => {
  try {
    await axios.delete(`${import.meta.env.VITE_BASE_URL}/attendance/${userId}`);
    setAttendanceMap((prev) => {
      const updated = { ...prev };
      delete updated[userId];
      return updated;
    });
    toast.success("Attendance deleted");
  } catch (error) {
    toast.error("Error deleting attendance");
    console.error(error);
  }
};

  const handleBulkAction = async (status) => {
    setBulkAction(status);
    setShowConfirmDialog(true);
  };

  const executeBulkAction = async () => {
    setProcessing(true);
    let successCount = 0;
    let alreadyMarkedCount = 0;
    let errorCount = 0;

    for (const user of filteredUsers) {
      const result = await updateStatus(user._id, bulkAction);
      if (result === "success") successCount++;
      else if (result === "already_marked") alreadyMarkedCount++;
      else errorCount++;
    }

    if (successCount > 0) {
      await sendBulkNotification(bulkAction);
    }

    let message = `Updated ${successCount} users successfully.`;
    if (alreadyMarkedCount > 0) {
      message += ` ${alreadyMarkedCount} users were already marked.`;
    }
    if (errorCount > 0) {
      message += ` Failed to update ${errorCount} users.`;
    }
    toast(message, {
      position: "top-left",
    });

    setProcessing(false);
    setShowConfirmDialog(false);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <CustomNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6">
          {/* Header Section */}
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  IISPPR Attendance Management
                </CardTitle>
                <Badge variant="secondary" className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100">
                  <Calendar className="h-4 w-4" />
                  {displayDate}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="dark:bg-gray-800">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="w-full px-4 py-2 rounded-nonemd border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-300" />
                  </div>
                  <Badge variant="outline" className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100">
                    <Users className="h-4 w-4" />
                    Total Interns: {users.length}
                  </Badge>
                </div>
                <div className="hidden justify-end space-x-4">
                  <Button
                    variant="outline"
                    className="bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-500"
                    onClick={() => handleBulkAction("present")}
                    disabled={processing || filteredUsers.length === 0}
                  >
                    Mark All Present
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-500"
                    onClick={() => handleBulkAction("absent")}
                    disabled={processing || filteredUsers.length === 0}
                  >
                    Mark All Absent
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Table Section */}
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-0 dark:bg-gray-800">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent dark:border-blue-300 dark:border-t-transparent"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table className="min-w-full bg-white dark:bg-gray-800">
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-700">
                        <TableHead className="text-left text-sm font-medium text-gray-700 dark:text-gray-200">Name</TableHead>
                        <TableHead className="text-left text-sm font-medium text-gray-700 dark:text-gray-200">Email</TableHead>
                        <TableHead className="text-left text-sm font-medium text-gray-700 dark:text-gray-200">Status</TableHead>
                        <TableHead className="text-right text-sm font-medium text-gray-700 dark:text-gray-200">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <TableRow key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                              {user.name}
                            </TableCell>
                            <TableCell className="text-gray-700 dark:text-gray-300">{user.email}</TableCell>
                            <TableCell>
                              <Badge
                                className={`pointer-events-none ${
                                  attendanceMap[user._id] === "present"
                                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                                    : attendanceMap[user._id] === "absent"
                                    ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
                                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
                                }`}
                              >
                                {attendanceMap[user._id] || "not marked"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                {attendanceMap[user._id] && (
                                  <Button
                                    variant="ghost"
                                    className="text-red-500 hover:bg-red-100 p-2 dark:text-red-300 dark:hover:bg-red-900/30"
                                    onClick={() => deleteAttendance(user._id)}
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </Button>
                                )}
                                <Button
                                  variant="outline"
                                  className="bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-500"
                                  onClick={() => updateStatus(user._id, "present")}
                                  disabled={processing || attendanceMap[user._id] === "present" || attendanceMap[user._id] === "absent"}
                                >
                                  Present
                                </Button>
                                <Button
                                  variant="outline"
                                  className="bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-500"
                                  onClick={() => updateStatus(user._id, "absent")}
                                  disabled={processing || attendanceMap[user._id] === "present" || attendanceMap[user._id] === "absent"}
                                >
                                  Absent
                                </Button>
                              </div>

                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8 text-gray-700 dark:text-gray-300">
                            No users found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold">Confirm Bulk Action</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-700 dark:text-gray-300">
              You are about to mark <strong>
                {
                  filteredUsers.filter(user => !attendanceMap[user._id]).length
                }
              </strong>{" "}
              out of <strong>{filteredUsers.length}</strong> users as <strong>{bulkAction}</strong>.
              <br />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Already marked users will be skipped.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing} className="dark:text-gray-200">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={executeBulkAction}
              disabled={processing}
              className={`${
                bulkAction === "present"
                  ? "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500"
                  : "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500"
              } text-white`}
            >
              {processing ? "Processing..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InternAttendancePage;