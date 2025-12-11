"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Alert, AlertDescription } from "@/Components/ui/alert"
import CustomNavbar from "./CustomNavbar"
import axios from "axios"
import { toast } from "react-hot-toast"
import { Loader, useTitle } from "@/Components/compIndex"

const API_BASE_URL = import.meta.env.VITE_BASE_URL

const INITIAL_TECHNICAL_TASK = {
  assignedTo: "",
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  type: "Technical"
}

const INITIAL_SOCIAL_TASK = {
  assignedTo: [],
  tasks: [
    { 
      title: "Engagement with Company Posts", 
      description: "Like, comment on, and share the latest post published on our official [LinkedIn/Facebook/Instagram] page. Upload a screenshot as proof of your engagement. This helps boost our online visibility and community interaction.",
      selected: false 
    },
    { 
      title: "Personal Internship Acknowledgment Post", 
      description: "Create a personal post on LinkedIn or Instagram acknowledging your internship at IISPPR. \nExample: 'Excited to be joining IISPPR as an intern! Looking forward to learning and contributing.'\nInclude appropriate hashtags and tag the company page. Upload a screenshot of your post as submission.", 
      selected: false 
    }
  ],
  startDate: "",
  endDate: "",
  type: "Social"
}

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
}

export default function AdminTask() {
  useTitle("Task Management")
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [activeTab, setActiveTab] = useState("technical")
  const [technicalTask, setTechnicalTask] = useState(INITIAL_TECHNICAL_TASK)
  const [socialTask, setSocialTask] = useState(INITIAL_SOCIAL_TASK)
  const [successMessage, setSuccessMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const tabUnderlineRef = useRef(null)

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${API_BASE_URL}/allusers`)
        const usersList = response.data.data

        if (!Array.isArray(usersList)) {
          throw new Error("Invalid users data format received")
        }

        setUsers(usersList)
      } catch (error) {
        toast.error("Failed to fetch users")
        console.error("Data fetch error:", error)
      } finally {
        setLoading(false)
      }
    }

    initializeData()
  }, [])

  const handleTechnicalChange = (e) => {
    const { name, value } = e.target
    setTechnicalTask(prev => ({ ...prev, [name]: value }))
  }

  const handleSocialChange = (e) => {
    const { name, value } = e.target
    setSocialTask(prev => ({ ...prev, [name]: value }))
  }

  const handleUserSelection = (userId) => {
    setSocialTask(prev => {
      const isSelected = prev.assignedTo.includes(userId)
      return {
        ...prev,
        assignedTo: isSelected
          ? prev.assignedTo.filter(id => id !== userId)
          : [...prev.assignedTo, userId]
      }
    })
  }

  const toggleSelectAllUsers = () => {
    setSocialTask(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.length === users.length ? [] : users.map(user => user._id)
    }))
  }

  const handleSocialTaskToggle = (index) => {
    setSocialTask(prev => {
      const updatedTasks = [...prev.tasks]
      updatedTasks[index].selected = !updatedTasks[index].selected
      return { ...prev, tasks: updatedTasks }
    })
  }

  const handleSocialTaskDescription = (index, value) => {
    setSocialTask(prev => {
      const updatedTasks = [...prev.tasks]
      updatedTasks[index].description = value
      return { ...prev, tasks: updatedTasks }
    })
  }

  const handleTechnicalSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await axios.post(`${API_BASE_URL}/task/add-task`, technicalTask)
      if (response.status === 201) {
        toast.success("Technical task assigned successfully!")
        setTechnicalTask(INITIAL_TECHNICAL_TASK)
        setSuccessMessage("Task successfully assigned!")
        setTimeout(() => setSuccessMessage(""), 5000)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to assign technical task")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSocialSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    if (socialTask.assignedTo.length === 0) {
      toast.error("Please select at least one user")
      setIsSubmitting(false)
      return
    }

    const selectedTasks = socialTask.tasks.filter(task => task.selected)
    if (selectedTasks.length === 0) {
      toast.error("Please select at least one social task type")
      setIsSubmitting(false)
      return
    }

    try {
      const promises = []
      
      socialTask.assignedTo.forEach(userId => {
        selectedTasks.forEach(task => {
          const taskData = {
            assignedTo: userId,
            title: task.title,
            description: task.description,
            startDate: socialTask.startDate,
            endDate: socialTask.endDate,
            type: "Social"
          }
          
          promises.push(
            axios.post(`${API_BASE_URL}/task/add-task`, taskData)
              .then(() => {
                toast.success(`${task.title} assigned to ${users.find(u => u._id === userId)?.name || 'user'}`)
              })
              .catch(error => {
                toast.error(`Failed to assign ${task.title} to ${users.find(u => u._id === userId)?.name || 'user'}: ${error.response?.data?.message || 'Server error'}`)
              })
          )
        })
      })

      await Promise.all(promises)
      setSocialTask(INITIAL_SOCIAL_TASK)
      setSuccessMessage("All social tasks assigned successfully!")
      setTimeout(() => setSuccessMessage(""), 5000)
    } catch (error) {
      console.error("Social task assignment error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <>
        <CustomNavbar />
        <Loader />
      </>
    )
  }

  return (
    <>
      <CustomNavbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="shadow-xl rounded-none2xl overflow-hidden bg-white/90 dark:bg-gray-900/70 backdrop-blur-sm"
          >
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800 p-6 relative">
              <div className="absolute inset-0 bg-noise opacity-10 dark:opacity-8"></div>
              <CardTitle className="text-3xl font-bold text-white relative">Task Management</CardTitle>
              
              <div className="flex mt-6 relative">
                <div className="flex space-x-1 z-10">
                  {["technical", "social"].map((tab) => (
                    <button
                      key={tab}
                      className={`relative py-3 px-6 font-semibold rounded-nonet-lg transition-all duration-300 ${
                        activeTab === tab 
                          ? 'text-white' 
                          : 'text-blue-200 hover:text-white'
                      }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab === 'technical' ? 'Technical Task' : 'Social Task'}
                      {activeTab === tab && (
                        <motion.div
                          layoutId="tabUnderline"
                          className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-nonefull"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </button>
                  ))}
                </div>
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-px bg-white/20"
                  initial={false}
                />
              </div>
            </CardHeader>

            <CardContent className="p-8 relative bg-white dark:bg-gray-900">
              <div className="absolute inset-0 bg-dots opacity-10 dark:opacity-6"></div>
              
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <Alert className="mb-6 bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200">
                    <AlertDescription>{successMessage}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="relative z-10"
                >
                  {activeTab === 'technical' ? (
                    <form onSubmit={handleTechnicalSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Assign To</label>
                        <select
                          name="assignedTo"
                          value={technicalTask.assignedTo}
                          onChange={handleTechnicalChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-nonexl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          required
                        >
                          <option value="">Select a user</option>
                          {users.map(user => (
                            <option key={user._id} value={user._id}>
                              {user.name} ({user.email})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Task Title</label>
                        <input
                          type="text"
                          name="title"
                          value={technicalTask.title}
                          onChange={handleTechnicalChange}
                          placeholder="Enter task title"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-nonexl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Task Description</label>
                        <textarea
                          name="description"
                          value={technicalTask.description}
                          onChange={handleTechnicalChange}
                          placeholder="Enter task description"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-nonexl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px] transition-all duration-200 shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Start Date</label>
                          <input
                            type="datetime-local"
                            name="startDate"
                            value={technicalTask.startDate}
                            onChange={handleTechnicalChange}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-nonexl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">End Date</label>
                          <input
                            type="datetime-local"
                            name="endDate"
                            value={technicalTask.endDate}
                            onChange={handleTechnicalChange}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-nonexl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            required
                          />
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-700 dark:to-blue-600 hover:from-blue-700 hover:to-blue-600 text-white py-3.5 rounded-nonexl transition-all duration-300 transform hover:scale-[1.01] shadow-lg hover:shadow-blue-200 dark:shadow-none"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Assigning...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                            </svg>
                            Assign Technical Task
                          </span>
                        )}
                      </Button>
                    </form>
                  ) : (
                    <form onSubmit={handleSocialSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Assign To (Multiple)</label>
                          <button
                            type="button"
                            onClick={toggleSelectAllUsers}
                            className="text-xs font-medium text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 transition-colors flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8h8V6z" clipRule="evenodd" />
                            </svg>
                            {socialTask.assignedTo.length === users.length ? 'Deselect All' : 'Select All'}
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-3 border border-gray-200 dark:border-gray-700 rounded-nonexl bg-gray-50 dark:bg-gray-800">
                          {users.map(user => (
                            <motion.div 
                              key={user._id} 
                              whileHover={{ scale: 1.01 }}
                              className={`flex items-center p-2 rounded-nonelg transition-all ${
                                socialTask.assignedTo.includes(user._id) 
                                  ? 'bg-blue-50 border border-blue-200 dark:bg-blue-900/40 dark:border-blue-700' 
                                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                              }`}
                            >
                              <input
                                type="checkbox"
                                id={`user-${user._id}`}
                                checked={socialTask.assignedTo.includes(user._id)}
                                onChange={() => handleUserSelection(user._id)}
                                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                              />
                              <label htmlFor={`user-${user._id}`} className="ml-3 text-sm text-gray-700 dark:text-gray-200">
                                <span className="font-medium">{user.name}</span>
                                <span className="block text-xs text-gray-500 dark:text-gray-400">{user.email}</span>
                              </label>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Select Social Tasks</label>
                        <div className="space-y-3">
                          {socialTask.tasks.map((task, index) => (
                            <motion.div 
                              key={index}
                              whileHover={{ scale: 1.005 }}
                              className={`border rounded-nonexl p-4 transition-all duration-200 ${
                                task.selected 
                                  ? 'border-blue-300 bg-blue-50 shadow-sm dark:border-blue-600 dark:bg-blue-900/30' 
                                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                              }`}
                            >
                              <div className="flex items-center mb-3">
                                <input
                                  type="checkbox"
                                  checked={task.selected}
                                  onChange={() => handleSocialTaskToggle(index)}
                                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                                />
                                <span className="ml-3 font-medium text-gray-800 dark:text-gray-100">
                                  {task.title}
                                  <span className="ml-2 px-2 py-1 text-xs rounded-nonefull bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-200">
                                    {task.title.includes("LinkedIn") ? "💼 Professional" : "🐦 Social"}
                                  </span>
                                </span>
                              </div>
                              {task.selected && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <textarea
                                    placeholder={`Enter description for ${task.title}...`}
                                    value={task.description}
                                    onChange={(e) => handleSocialTaskDescription(index, e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-nonelg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px] transition-all mt-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                  />
                                </motion.div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Start Date</label>
                          <input
                            type="datetime-local"
                            name="startDate"
                            value={socialTask.startDate}
                            onChange={handleSocialChange}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-nonexl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">End Date</label>
                          <input
                            type="datetime-local"
                            name="endDate"
                            value={socialTask.endDate}
                            onChange={handleSocialChange}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-nonexl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            required
                          />
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 hover:from-indigo-700 hover:to-purple-700 text-white py-3.5 rounded-nonexl transition-all duration-300 transform hover:scale-[1.01] shadow-lg hover:shadow-purple-200 dark:shadow-none"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Assigning...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                            Assign Social Tasks
                          </span>
                        )}
                      </Button>
                    </form>
                  )}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        .bg-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)' opacity='0.20'/%3E%3C/svg%3E");
        }
        .bg-dots {
          background-image: radial-gradient(#ddd 1px, transparent 1px);
          background-size: 15px 15px;
        }
        /* dark-mode friendly adjustments if project doesn't automatically invert these */
        :root.dark .bg-noise { opacity: 0.08; }
        :root.dark .bg-dots { background-image: radial-gradient(#444 1px, transparent 1px); }
      `}</style>
    </>
  )
}