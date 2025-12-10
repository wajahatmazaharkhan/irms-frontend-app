import React, { useState, useEffect } from "react";
import { Navbar, SideNav, useTitle } from "@/Components/compIndex";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Percent,
} from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const UserAttendance = () => {
  useTitle("User Attendance");
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendancePercentage, setAttendancePercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("User ID not found");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/attendance/${userId}`
        );
        setAttendanceData(response.data);

        const totalDays = response.data.length;
        const presentDays = response.data.filter(
          (record) => record.status.toLowerCase() === "present"
        ).length;
        const percentage =
          totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : 0;
        setAttendancePercentage(percentage);
        setLoading(false);
      } catch (err) {
        setError("Error fetching attendance data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getDayOfWeek = (date) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayIndex = new Date(date).getDay();
    return days[dayIndex];
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getRecordForDate = (date) => {
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);

    return attendanceData.find((record) => {
      const recDate = new Date(record.date);
      recDate.setHours(0, 0, 0, 0);
      return recDate.getTime() === target.getTime();
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950">
        <div className="flex-1 flex flex-col">
          <Navbar />
          <div className="flex items-center justify-center flex-1">
            <div className="text-xl text-gray-600 dark:text-gray-300">
              Loading attendance data...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950">
        <div className="flex-1 flex flex-col">
          <Navbar />
          <div className="flex items-center justify-center flex-1">
            <div className="text-xl text-red-600 dark:text-red-400">
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const selectedRecord = getRecordForDate(selectedDate);

  return (
    <div className="flex min-h-screen dark:bg-slate-950">
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8 w-full">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center">
            Attendance Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-gray-600 dark:text-gray-300 flex items-center gap-2">
                  <Percent className="w-5 h-5" />
                  Attendance Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                  {attendancePercentage}%
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-gray-600 dark:text-gray-300 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Total Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                  {attendanceData.length}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800 dark:text-gray-100">
                Attendance Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Calendar View */}
                <div className="bg-gray-50 dark:bg-slate-950/50 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
                  <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    className="react-calendar border-none bg-transparent text-sm"
                    tileClassName={({ date, view }) => {
                      if (view !== "month") return "";

                      const record = getRecordForDate(date);
                      if (!record) return "";

                      if (record.status.toLowerCase() === "present") {
                        return "relative after:content-[''] after:block after:w-1.5 after:h-1.5 after:rounded-full after:bg-green-500 after:mx-auto after:mt-1";
                      }

                      return "relative after:content-[''] after:block after:w-1.5 after:h-1.5 after:rounded-full after:bg-red-500 after:mx-auto after:mt-1";
                    }}
                  />
                </div>

                {/* Selected Day Details */}
                <div className="bg-gray-50 dark:bg-slate-950/50 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
                  <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
                    {selectedRecord
                      ? "Selected Day Details"
                      : "No Record for Selected Day"}
                  </h2>

                  {selectedRecord ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <CalendarIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Date
                          </p>
                          <p className="text-base font-medium text-gray-800 dark:text-gray-100">
                            {formatDate(selectedRecord.date)} (
                            {getDayOfWeek(selectedRecord.date)})
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Check-in Time
                          </p>
                          <p className="text-base font-medium text-gray-800 dark:text-gray-100">
                            {formatTime(selectedRecord.CheckInTime)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {selectedRecord.status.toLowerCase() === "present" ? (
                          <>
                            <CheckCircle className="w-6 h-6 text-green-500" />
                            <span className="text-green-600 dark:text-green-400 font-semibold text-base">
                              Present
                            </span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-6 h-6 text-red-500" />
                            <span className="text-red-600 dark:text-red-400 font-semibold text-base">
                              Absent
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      There is no attendance record for{" "}
                      <span className="font-semibold">
                        {formatDate(selectedDate)}
                      </span>
                      . Select another date with a dot indicator on the
                      calendar to view details.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserAttendance;