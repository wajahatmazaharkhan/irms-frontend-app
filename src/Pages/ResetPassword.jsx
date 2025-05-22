import React from "react";
import { Lock, ArrowLeft, Clock, Wrench, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useTitle from "@/Components/useTitle";

const PasswordResetPage = () => {
  useTitle("Reset Password");
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 mb-4 bg-orange-100 rounded-full flex items-center justify-center">
            <Wrench className="w-10 h-10 text-orange-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Reset Password
          </h2>
          <p className="text-gray-600">IISPPR InternHub Account</p>
        </div>

        {/* Under Development Notice */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-orange-200 rounded-full p-3">
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </div>

          <h3 className="text-lg font-semibold text-orange-800 mb-2">
            Feature Under Development
          </h3>

          <p className="text-orange-700 mb-4">
            The password reset functionality is currently being developed and
            will be available soon.
          </p>

          <div className="bg-white rounded-lg p-4 mb-4">
            <div className="flex items-center justify-center gap-2 text-orange-600 mb-2">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Coming Soon</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Secure password reset via email</li>
              <li>• Enhanced security validation</li>
              <li>• Multi-factor authentication support</li>
              <li>• Improved user experience</li>
            </ul>
          </div>

          <p className="text-sm text-orange-600 font-medium">
            Expected Release: Coming Soon
          </p>
        </div>

        {/* Alternative Options */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">Need Help Now?</h4>
          <p className="text-sm text-blue-700 mb-3">
            If you've forgotten your password, please contact the system
            administrator for assistance.
          </p>
          <div className="text-sm text-blue-600">
            <p>📧 Email: support@iisppr.edu</p>
            <p>📞 Phone: Contact your institution</p>
          </div>
        </div>

        {/* Back to Login Button */}
        <button
          onClick={handleGoBack}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Login
        </button>

        {/* Development Status */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
            <span>Development in Progress</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage;
