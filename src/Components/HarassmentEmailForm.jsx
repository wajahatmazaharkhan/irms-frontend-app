import React, { useState } from "react";
import { Mail, Send, AlertCircle, CheckCircle2, Menu } from "lucide-react";
import { TopNavbar, useTitle } from "./compIndex.js";

const HarassmentEmailForm = () => {
  useTitle("Harassment Complaint");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Harassment Complaint");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const adminEmail = "AdminMail@gmail.com"; // Replace this Mail with the actual admin mail.

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${adminEmail}&su=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(`From: ${email}\n\nMessage:\n${message}`)}`;

      window.open(gmailUrl, "_blank");
      setSubmitSuccess(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setEmail("");
        setMessage("");
        setSubject("Harassment Complaint");
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-slate-900">
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-slate-900 p-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-[#4263EB] rounded-nonet-lg shadow-lg p-4 sm:p-6 md:p-8">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center text-white mb-2 transition-all">
                Harassment Complaint
              </h1>
              <p className="text-center text-gray-100 mb-0 text-xs sm:text-sm md:text-base">
                Empowering a safe and respectful environment for all
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-noneb-lg shadow-lg p-4 sm:p-6 md:p-8 transition-all border border-transparent dark:border-slate-700">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#4263EB] dark:text-[#86a9ff]" />
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Write Complaint
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="transition-all">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                  >
                    Your Email
                  </label>
                  <div className="relative group">
                    <Mail
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-300 transition-colors group-hover:text-[#4263EB] dark:group-hover:text-[#86a9ff]"
                      aria-hidden
                    />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2 sm:py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-nonelg focus:ring-2 focus:ring-[#4263EB] focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all hover:border-[#4263EB] dark:hover:border-[#86a9ff]"
                    />
                  </div>
                </div>

                <div className="transition-all">
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2 sm:py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-nonelg focus:ring-2 focus:ring-[#4263EB] focus:border-transparent text-gray-900 dark:text-gray-100 transition-all hover:border-[#4263EB] dark:hover:border-[#86a9ff]"
                  />
                </div>

                <div className="transition-all">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    placeholder="Please provide details about the incident..."
                    className="w-full px-4 py-2 sm:py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-nonelg focus:ring-2 focus:ring-[#4263EB] focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 resize-none transition-all hover:border-[#4263EB] dark:hover:border-[#86a9ff]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || submitSuccess}
                  className={`w-full flex items-center justify-center gap-2 py-2 sm:py-3 px-4 rounded-nonelg font-medium transition-all duration-200 ${
                    submitSuccess
                      ? "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                      : "bg-[#4263EB] hover:bg-[#3B82F6] dark:bg-[#3456c8] dark:hover:bg-[#2e4fb8]"
                  } text-white disabled:opacity-70 disabled:cursor-not-allowed`}
                  aria-disabled={isSubmitting || submitSuccess}
                >
                  {submitSuccess ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Submitted Successfully
                    </>
                  ) : (
                    <>
                      <Send
                        className={`w-5 h-5 ${isSubmitting ? "animate-pulse" : ""}`}
                      />
                      {isSubmitting ? "Submitting..." : "Sumit Complaint"}
                    </>
                  )}
                </button>
              </form>

              <p className="mt-6 text-xs sm:text-sm text-gray-600 dark:text-gray-300 text-center">
                Your report will be handled with strict confidentiality and appropriate action will be taken.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HarassmentEmailForm;