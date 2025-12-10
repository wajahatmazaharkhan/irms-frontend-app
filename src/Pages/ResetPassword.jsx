import React, { useState } from "react"; 
import { Mail, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import iispprLogo from "../assets/Images/iisprlogo.png";
import useTitle from "@/Components/useTitle";
import axios from "axios";

const PasswordResetPage = () => {
  useTitle("Reset Password");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBackToLogin = () => {
    navigate("/login");
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simulate API call to send OTP
      await axios.post(`${import.meta.env.VITE_BASE_URL}/user/sendresetotp`, { email });

      // Store email in session storage for OTP verification
      sessionStorage.setItem('resetEmail', email);

      // Show success message
      toast.success("OTP sent to your email!");

      // Redirect to OTP verification
      navigate('/verify-otp');
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError("Failed to send OTP. Please try again later.");
      toast.error("Failed to send OTP. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6 bg-white dark:bg-slate-900 p-8 rounded-nonexl shadow-lg">
        {/* Logo and Header */}
        <div className="text-center">
          <img
            src={iispprLogo}
            alt="IISPPR Logo"
            className="mx-auto h-16 w-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Reset Password
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Enter your email to receive a verification code
          </p>
        </div>

        <form onSubmit={handleSendOTP} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email address
              </label>
              <div className="mt-1 relative rounded-nonemd shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-nonemd shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-nonemd shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending OTP...
                </span>
              ) : (
                "Send Verification Code"
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            onClick={handleBackToLogin}
            className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center justify-center w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Login
          </button>
        </div>

        {/* Help Section */}
        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Need help? Contact support at{" "}
            <a
              href="mailto:support@iisppr.edu"
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              support@iisppr.edu
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage;