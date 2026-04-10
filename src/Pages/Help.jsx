import React, { useState } from "react";
import axios from "axios";
import { Navbar, useTitle } from "../Components/compIndex";
import { Search, X } from "lucide-react";

const Help = () => {
  useTitle("Help Section");

  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    issueType: "Bug",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const cards = [
    {
      title: "Submit a Query",
      description: "Click on this link to submit your query",
      icon: "📝",
      category: "submission",
    },
    {
      title: "How to get my Offer Letter",
      description: (
        <>
          Visit our{" "}
          <a
            href="https://iisppr.org.in/internship-jd/"
            className="text-purple-600 hover:text-purple-800"
          >
            <u>website</u>
          </a>
        </>
      ),
      icon: "📜",
      category: "documents",
    },
    {
      title: "How will the task be assigned",
      description:
        "Messages regarding your tasks will be dropped in your WhatsApp Group by your team lead",
      icon: "👨🏼‍💻",
      category: "tasks",
    },
    {
      title: "Where can I submit my leave application",
      description:
        "You can fill the form provided in the HR section and you will be informed if your leave is granted",
      icon: "✈️",
      category: "leave",
    },
    {
      title: "How to submit a task",
      description:
        "Instructions will be provided in the task details. Follow the submission guidelines carefully.",
      icon: "✅",
      category: "tasks",
    },
    {
      title: "What if I have a Doubt",
      description:
        "Check out the FAQ section, that can help you resolve common questions quickly",
      icon: "🔍",
      category: "support",
    },
    {
      title: "Report a bug!",
      description: "Click here to report a technical issue",
      icon: "🐞",
      category: "software bug",
      action: () => setShowModal(true),
    },
  ];

  const filteredCards = cards.filter(
    (card) =>
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/issues`, formData);
      alert("Issue submitted successfully!");
      setFormData({ name: "", email: "", issueType: "Bug", description: "" });
      setShowModal(false);
    } catch (error) {
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen p-8 dark:bg-slate-950">
        {/* Search */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 rounded-lg"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card, index) => (
            <div
              key={index}
              onClick={card.action}
              className="cursor-pointer p-6 bg-white dark:bg-slate-900 rounded-xl shadow hover:shadow-lg"
            >
              <div className="text-5xl mb-4">{card.icon}</div>
              <h3 className="text-xl font-semibold">{card.title}</h3>
              <p className="text-gray-600 dark:text-slate-300">
                {card.description}
              </p>
              <span className="inline-block mt-3 text-xs px-3 py-1 bg-blue-100 text-blue-600 rounded-full">
                {card.category}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Report an Issue</h2>
              <X
                className="cursor-pointer"
                onClick={() => setShowModal(false)}
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                required
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />

              <select
                name="issueType"
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option>Bug</option>
                <option>UI Issue</option>
                <option>Performance</option>
                <option>Other</option>
              </select>

              <textarea
                name="description"
                placeholder="Describe the issue..."
                required
                rows="4"
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded"
              >
                {loading ? "Submitting..." : "Submit Issue"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Help;
