import React, { useState } from "react";
import { Mail, Send, AlertCircle } from "lucide-react";

const HarassmentEmailForm = () => {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Harassment Complaint");
  const [message, setMessage] = useState("");
  const adminEmail = "AdminMail@gmail.com";

  const handleSubmit = (e) => {
    e.preventDefault();
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${adminEmail}&su=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(`From: ${email}\n\nMessage:\n${message}`)}`;
    window.open(gmailUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-[#1E293B] rounded-lg shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <AlertCircle className="w-6 h-6 text-purple-500" />
            <h2 className="text-2xl font-bold">Report Harassment</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Your Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-[#0F172A] border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-100 placeholder-gray-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 bg-[#0F172A] border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-100"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                Message
              </label>
              <textarea
                id="message"
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder="Please provide details about the incident..."
                className="w-full px-4 py-3 bg-[#0F172A] border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-100 placeholder-gray-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
            >
              <Send className="w-5 h-5" />
              Submit Report
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-400 text-center">
            Your report will be handled with strict confidentiality and appropriate action will be taken.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HarassmentEmailForm;