import React, { useState } from "react";
import { Navbar, useTitle } from "../Components/compIndex";
import { Search } from "lucide-react";

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");
  useTitle("IRMS | Help Section");
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
            className="text-purple-600 hover:text-purple-800 transition-colors dark:text-purple-300 dark:hover:text-purple-400"
          >
            <u>website</u>
          </a>
          , all details are mentioned here
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
  ];

  const filteredCards = cards.filter(
    (card) =>
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.description
        .toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      card.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-300">
        <div className="flex-grow ml-0">
          <main className="min-h-screen p-8">
            <div className="relative px-8 mb-8 text-center bg-gradient-to-r from-blue-500 to-blue-600 dark:from-slate-800 dark:to-slate-900 rounded-nonelg shadow-lg py-14">
              <h2 className="mb-6 text-4xl font-bold text-white">
                Hello, How can we Help?
              </h2>
              <div className="max-w-xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for help..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 pl-12 text-lg bg-white dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-400 rounded-nonelg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
                  />
                  <Search className="absolute w-6 h-6 text-gray-400 dark:text-gray-500 transform -translate-y-1/2 left-4 top-1/2" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCards.map((card, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center p-6 bg-white dark:bg-slate-900 rounded-nonexl shadow-md hover:shadow-lg dark:hover:shadow-slate-900/60 transition-shadow duration-300 h-64 border border-gray-100 dark:border-slate-700"
                >
                  <div className="mb-4 text-5xl">{card.icon}</div>
                  <h3 className="mb-3 text-xl font-semibold text-gray-800 dark:text-slate-100 text-center">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 dark:text-slate-300 text-center">
                    {card.description}
                  </p>
                  <span className="mt-4 px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 dark:text-blue-300 dark:bg-blue-950 rounded-nonefull">
                    {card.category}
                  </span>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Help;