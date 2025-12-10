/* eslint-disable no-unused-vars */
import React from "react";
import { FAQsData, Navbar, SideNav, TopNavbar, useTitle } from "../Components/compIndex";

const FAQ = () => {
  useTitle("FAQ");
  return (
    <>
      <Navbar />
      {/* <SideNav />
      <TopNavbar /> */}
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900">
        {/* Main Content */}
        <div
          id="mainContent"
          className="p-4 w-full max-w-sm sm:max-w-lg lg:max-w-4xl rounded-nonelg"
        >
          <h1 className="text-4xl capitalize font-bold mb-6 text-center text-blue-600 dark:text-blue-400">
            How can we help?
          </h1>

          <div className="bg-white dark:bg-slate-800 shadow-lg rounded-nonelg p-8 max-w-4xl mx-auto">
            {FAQsData.map((faq, index) => (
              <div
                key={index}
                className="border-b border-gray-300 dark:border-gray-700 pb-4 mb-4 last:border-b-0 last:pb-0"
              >
                <button
                  className="flex justify-between items-center w-full text-lg font-semibold text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition"
                  onClick={(e) => {
                    const content = e.currentTarget.nextElementSibling;
                    if (content) {
                      content.classList.toggle("hidden");
                    }
                  }}
                >
                  {faq.question}
                  <i className="bi bi-chevron-down text-gray-600 dark:text-gray-400"></i>
                </button>

                <div className="mt-2 text-gray-600 dark:text-gray-300 hidden">
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQ;