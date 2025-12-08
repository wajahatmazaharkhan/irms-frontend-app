"use client"

import { Navbar, SideNav, useTitle } from "@/Components/compIndex"
import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const RaiseTicket = () => {
  useTitle("Raise Ticket")
  const [category, setCategory] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(false)
  const baseUrl = import.meta.env.VITE_BASE_URL
  const navigate = useNavigate()
  const userId = localStorage.getItem("userId")

  const categoryOptions = [
    "LOA not received",
    "Internship Certificate not received",
    "Publication Certificate not received",
    "Others",
  ]

  // Fetch previous tickets
  const fetchTickets = async () => {
    try {
      setLoading(true)
      console.log("Back url: ", baseUrl)
      const res = await axios.get(`${baseUrl}/ticket/getbyid/${userId}`)
      setTickets(res.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching tickets:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  // Handle ticket creation
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!category) return alert("Please select a category")
    if (category === "Others" && !title) return alert("Please enter a title for Others category")
    if (!description) return alert("Please fill the description")

    try {
      await axios.post(`${baseUrl}/ticket/create`, {
        title: category === "Others" ? title : category,
        description,
        userId,
        category,
      })
      setCategory("")
      setTitle("")
      setDescription("")
      fetchTickets()
      alert("Ticket created successfully!")
    } catch (error) {
      console.error("Error creating ticket:", error)
      alert("Failed to create ticket.")
    }
  }

  const handleManage = () => {
    navigate("/viewmytickets")
  }

  return (
    <>
      <Navbar />
      <SideNav />
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Ask a Question</h1>
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-nonelg p-4 mb-6 space-y-4">
          <div>
            <label className="block mb-1 font-medium">Category</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value)
                if (e.target.value !== "Others") {
                  setTitle("")
                }
              }}
              required
            >
              <option value="">Select a category</option>
              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {category === "Others" && (
            <div>
              <label className="block mb-1 font-medium">Title</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                placeholder="Enter ticket title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              rows={4}
              placeholder="Describe your issue"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Submit Ticket
          </button>
        </form>

        <h2 className="text-xl font-semibold mb-3">Your Previous Tickets</h2>
        {loading ? (
          <p>Loading tickets...</p>
        ) : Array.isArray(tickets) && tickets.length === 0 ? (
          <p>No tickets found.</p>
        ) : Array.isArray(tickets) ? (
          <>
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div key={ticket._id} className="border rounded-nonelg p-4 shadow-sm bg-white">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">{ticket.title}</h3>
                    <span
                      className={`px-3 py-1 rounded-nonefull text-sm ${ticket.status === "Open"
                        ? "bg-green-100 text-green-700"
                        : ticket.status === "In Progress"
                          ? "bg-yellow-100 text-yellow-700"
                          : ticket.status === "Pending Confirmation"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">{ticket.description}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Created At: {new Date(ticket.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <button
                className="mt-[2vh] bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleManage}
              >
                Manage Tickets
              </button>
            </div>
          </>
        ) : (
          <p>Something went wrong fetching tickets.</p>
        )}
      </div>
    </>
  )
}

export default RaiseTicket
