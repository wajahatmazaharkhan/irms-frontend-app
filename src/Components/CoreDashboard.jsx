import { useEffect, useState } from "react";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Settings,
  ExternalLink,
  Headset,
  Loader,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  Info,
  HelpCircle,
} from "lucide-react";
import axios from "axios";
import { useAppContext } from "@/context/AppContext";
import TaskModal from "./TaskModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/Components/ui/dialog";
import { DynamicCalendar } from "./compIndex";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const CoreDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [showAllTasks, setShowAllTasks] = useState(false);
  const [activeTab, setActiveTab] = useState("technical");
  const navigate = useNavigate();
  const { setDashboard, modalView, setModalView } = useAppContext();
  const username = localStorage.getItem("userName") || "Login to Continue";
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/task/get-tasks/${localStorage.getItem("userId")}`
        );
        const fetchedTasks = response.data.tasksData;
        setTasks(fetchedTasks);
      } catch (error) {
        console.error(`Error Fetching Tasks: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const TaskStatusBadge = ({ status }) => {
    const statusConfig = {
      completed: {
        icon: CheckCircle,
        className: "bg-green-100 text-green-700 border border-green-200",
      },
      pending: {
        icon: Clock,
        className: "bg-yellow-100 text-yellow-700 border border-yellow-200",
      },
      overdue: {
        icon: AlertCircle,
        className: "bg-red-100 text-red-700 border border-red-200",
      },
    };

    const config = statusConfig[status.toLowerCase()] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <div
        className={`flex items-center gap-1 px-3 py-1 rounded-nonefull text-sm font-medium capitalize ${config.className}`}
      >
        <Icon className="w-4 h-4" />
        <span>{status}</span>
      </div>
    );
  };

  const sortTasks = (tasks) => {
    return [...tasks].sort((a, b) => {
      // Unsubmitted tasks first (pending or overdue)
      if (a.status !== "completed" && b.status === "completed") return -1;
      if (a.status === "completed" && b.status !== "completed") return 1;
      
      // Then sort by end date (earlier dates first)
      return new Date(a.endDate) - new Date(b.endDate);
    });
  };

  const filterTasksByType = (tasks, type) => {
    return tasks.filter(task => 
      task.taskType?.toLowerCase() === type.toLowerCase() || 
      task.type?.toLowerCase() === type.toLowerCase()
    );
  };

  const TaskList = ({ tasks, limit = null, showTaskType = true }) => {
    const displayTasks = limit ? tasks.slice(0, limit) : tasks;

    return (
      <div className="space-y-4">
        {displayTasks.map((task, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            key={task._id || index}
          >
            <Card className="hover:shadow-md transition-all duration-200 border border-gray-200">
              <CardContent className="p-5">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <TaskStatusBadge status={task.status} />
                        {showTaskType && (
                          <span className="text-xs px-2 py-1 rounded-nonefull bg-gray-100 text-gray-600">
                            {task.taskType || task.type}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {task.description}
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-nonefull">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          Start: {new Date(task.startDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-nonefull">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          End: {new Date(task.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 min-w-[120px] w-full lg:w-auto mt-4 lg:mt-0">
                    <Button
                      onClick={() => {
                        setSelectedTaskId(task._id);
                        setModalView(true);
                        setShowAllTasks(false);
                      }}
                      className={`w-full ${
                        task.status === "completed"
                          ? "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                      variant={
                        task.status === "completed" ? "outline" : "default"
                      }
                    >
                      {task.status === "completed" ? "Resubmit" : "Submit"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  };

  const TasksSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((index) => (
        <Card key={index} className="w-full border border-gray-200">
          <CardContent className="p-5">
            <div className="flex flex-col space-y-4 animate-pulse">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="h-6 bg-gray-200 rounded-nonemd w-2/3 sm:w-1/3"></div>
                <div className="h-6 bg-gray-200 rounded-nonefull w-24"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded-nonemd w-full"></div>
                <div className="h-4 bg-gray-200 rounded-nonemd w-5/6"></div>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="h-6 bg-gray-200 rounded-nonefull w-32"></div>
                <div className="h-6 bg-gray-200 rounded-nonefull w-32"></div>
              </div>
              <div className="flex justify-start sm:justify-end mt-2">
                <div className="h-9 bg-gray-200 rounded-nonemd w-full sm:w-28"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 25 
      }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      transition: { ease: "easeInOut" }
    }
  };

  const filteredTasks = activeTab === "technical" 
    ? filterTasksByType(tasks, "technical")
    : filterTasksByType(tasks, "social");

  const sortedTasks = sortTasks(filteredTasks);
  const hasTechnicalTasks = filterTasksByType(tasks, "technical").length > 0;
  const hasSocialTasks = filterTasksByType(tasks, "social").length > 0;

  return (
    <>
      {modalView && selectedTaskId && <TaskModal taskId={selectedTaskId} />}

      <Dialog open={showAllTasks} onOpenChange={setShowAllTasks}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-2xl font-semibold">
                All Tasks ({tasks.length})
              </DialogTitle>
              <DialogClose className="rounded-nonefull hover:bg-gray-100 p-2" />
            </div>
          </DialogHeader>
          <div className="mt-6 max-h-[70vh] overflow-y-auto pr-2">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader className="animate-spin h-6 w-6 text-blue-500 mr-3" />
                <p className="text-gray-600">Loading tasks...</p>
              </div>
            ) : (
              <TaskList tasks={sortTasks(tasks)} showTaskType={true} />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 sm:pl-8 md:pl-10 lg:pl-[10rem]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-nonexl p-6 md:p-8 text-white shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                <span>Welcome, {username}</span>
                {username !== "Login to Continue" && (
                  <span className="inline-flex items-center justify-center rounded-nonefull bg-blue-500/30 px-2 py-1 text-xs">
                    Dashboard
                  </span>
                )}
              </h1>
              <p className="text-blue-100">
                Track your progress and expand your knowledge journey.
              </p>
            </div>
            <Button
              variant="outline"
              className="bg-white/95 text-blue-700 hover:bg-white md:w-auto w-full mt-2 md:mt-0 shadow-sm flex items-center gap-2"
              onClick={() => {
                setDashboard("Settings");
                navigate("/settings");
              }}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
            <div className="bg-white/10 rounded-nonelg p-3 backdrop-blur-sm">
              <div className="text-xs text-blue-100">Total Tasks</div>
              <div className="text-xl font-semibold">{tasks.length}</div>
            </div>
            <div className="bg-white/10 rounded-nonelg p-3 backdrop-blur-sm">
              <div className="text-xs text-blue-100">Completed</div>
              <div className="text-xl font-semibold">
                {tasks.filter((t) => t.status === "completed").length}
              </div>
            </div>
            <div className="bg-white/10 rounded-nonelg p-3 backdrop-blur-sm">
              <div className="text-xs text-blue-100">Pending</div>
              <div className="text-xl font-semibold">
                {tasks.filter((t) => t.status === "pending").length}
              </div>
            </div>
            <div className="bg-white/10 rounded-nonelg p-3 backdrop-blur-sm">
              <div className="text-xs text-blue-100">Overdue</div>
              <div className="text-xl font-semibold">
                {tasks.filter((t) => t.status === "overdue").length}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Tasks Section */}
          <div className="lg:col-span-3 space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                {isAdmin ? "Assigned Tasks" : "My Tasks"}
                <span className="bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-nonefull text-xs font-medium">
                  {tasks.length} active
                </span>
              </h2>
              <Button
                variant="outline"
                size="sm"
                className="text-gray-600 hover:text-gray-700"
                onClick={() => setShowAllTasks(true)}
              >
                <span className="text-sm">View all</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200">
              <button
                className={`relative py-3 px-6 font-medium text-gray-600 hover:text-blue-600 transition-colors ${
                  activeTab === "technical" ? "text-blue-600" : ""
                }`}
                onClick={() => setActiveTab("technical")}
              >
                Technical
                {activeTab === "technical" && (
                  <motion.div
                    layoutId="tabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
              <button
                className={`relative py-3 px-6 font-medium text-gray-600 hover:text-blue-600 transition-colors ${
                  activeTab === "social" ? "text-blue-600" : ""
                }`}
                onClick={() => setActiveTab("social")}
              >
                Social
                {activeTab === "social" && (
                  <motion.div
                    layoutId="tabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {loading ? (
                  <TasksSkeleton />
                ) : activeTab === "technical" ? (
                  hasTechnicalTasks ? (
                    <TaskList tasks={sortedTasks} limit={3} />
                  ) : (
                    <Card className="border border-dashed border-gray-300 bg-gray-50">
                      <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                        <Info className="h-10 w-10 text-gray-400 mb-2" />
                        <h3 className="text-lg font-medium text-gray-700">
                          No technical tasks found
                        </h3>
                        <p className="text-gray-500 text-sm mt-1">
                          You don't have any technical tasks assigned yet.
                        </p>
                      </CardContent>
                    </Card>
                  )
                ) : hasSocialTasks ? (
                  <TaskList tasks={sortedTasks} limit={3} />
                ) : (
                  <Card className="border border-dashed border-gray-300 bg-gray-50">
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                      <Info className="h-10 w-10 text-gray-400 mb-2" />
                      <h3 className="text-lg font-medium text-gray-700">
                        No social tasks found
                      </h3>
                      <p className="text-gray-500 text-sm mt-1">
                        You don't have any social tasks assigned yet.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </AnimatePresence>

            {(activeTab === "technical" && hasTechnicalTasks && sortedTasks.length > 3) ||
            (activeTab === "social" && hasSocialTasks && sortedTasks.length > 3) ? (
              <Button
                variant="outline"
                className="w-full py-4 text-base hover:bg-gray-50 border border-gray-200 text-gray-700"
                onClick={() => setShowAllTasks(true)}
              >
                View all tasks
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            ) : null}
          </div>

          {/* Calendar and Quick Actions Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-gray-200 overflow-hidden shadow-sm">
              <CardContent className="p-0">
                <div className="bg-blue-50 p-4 border-b border-blue-100">
                  <h3 className="font-medium text-blue-800 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Calendar
                  </h3>
                </div>
                <div className="p-4">
                  <DynamicCalendar />
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card
                  className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg border-0"
                  onClick={() => navigate("/frequently-asked-questions")}
                >
                  <CardContent className="p-5 bg-gradient-to-br from-blue-500 to-blue-700 text-white h-full">
                    <div className="flex flex-row items-center space-x-4">
                      <div className="w-12 h-12 rounded-nonefull bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <HelpCircle className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">FAQs</h3>
                        <p className="text-blue-100 text-sm mt-1">
                          Find quick answers
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg border-0"
                  onClick={() => navigate("/help")}
                >
                  <CardContent className="p-5 bg-gradient-to-br from-blue-600 to-blue-800 text-white h-full">
                    <div className="flex flex-row items-center space-x-4">
                      <div className="w-12 h-12 rounded-nonefull bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Headset className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Contact Us</h3>
                        <p className="text-blue-100 text-sm mt-1">
                          Get support
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CoreDashboard;