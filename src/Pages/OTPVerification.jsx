import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Lock, Mail } from 'lucide-react';
import iispprLogo from '../assets/Images/iisprlogo.png';
import useTitle from '@/Components/useTitle';
import axios from 'axios';


const OTPVerification = () => {
    useTitle('Verify OTP');
    const navigate = useNavigate();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendDisabled, setResendDisabled] = useState(true);
    const [countdown, setCountdown] = useState(30);
    const inputRefs = useRef([]);

    // Get email from session storage
    const email = sessionStorage.getItem('resetEmail');

    // Redirect if no email found
    useEffect(() => {
        if (!email) {
            navigate('/reset-account-password');
        }
    }, [email, navigate]);

    // Countdown for resend OPP
    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        } else {
            setResendDisabled(false);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    // Handle OTP input change
    const handleChange = (index, value) => {
        if (isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to next input
        if (value !== '' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Handle backspace
    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpValue = otp.join('');

        if (otpValue.length !== 6) {
            setError('Please enter the 6-digit OTP');
            return;
        }

        setIsLoading(true);
        setError('');

        // Simulate OTP verification
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/user/verifyresetotp`, { email, otp: otpValue });
            toast.success('OTP verified successfully!');
            navigate('/verify-reset-token', { state: { email } });
            setIsLoading(false);
        } catch (error) {
            setError('Failed to verify OTP. Please try again.');
            setIsLoading(false);
        }


        // In a real app, you would verify the OTP with your backend here
        // For demo, we'll just redirect to password reset page

    };

    // Handle resend OTP
    const handleResendOTP = async () => {
        if (resendDisabled) return;

        // Simulate resend OTP
        setResendDisabled(true);
        await axios.post(`${import.meta.env.VITE_BASE_URL}/user/sendresetotp`, { email });
        setCountdown(30);
        toast.success('OTP has been resent to your email');
    };

    if (!email) return null;

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-nonexl shadow-lg">
                {/* Logo and Header */}
                <div className="text-center">
                    <img src={iispprLogo} alt="IISPPR Logo" className="mx-auto h-16 w-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900">
                        Verify OTP
                    </h2>
                    <p className="text-gray-600 mt-2">
                        Enter the 6-digit code sent to <span className="font-medium">{email}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex justify-center space-x-2">
                            {[0, 1, 2, 3, 4, 5].map((index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    maxLength={1}
                                    value={otp[index]}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-12 h-12 text-center text-xl border border-gray-300 rounded-nonemd focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    autoFocus={index === 0}
                                />
                            ))}
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm text-center">{error}</p>
                        )}
                    </div>

                    <div className="space-y-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-nonemd shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Verifying...
                                </span>
                            ) : (
                                'Verify OTP'
                            )}
                        </button>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => navigate('/reset-account-password')}
                                className="text-sm text-blue-600 hover:text-blue-500 font-medium flex items-center justify-center w-full"
                            >
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                Back to Reset Password
                            </button>
                        </div>
                    </div>
                </form>

                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        Didn't receive the code?{' '}
                        <button
                            type="button"
                            onClick={handleResendOTP}
                            disabled={resendDisabled}
                            className={`font-medium ${resendDisabled ? 'text-gray-400' : 'text-blue-600 hover:text-blue-500'}`}
                        >
                            {resendDisabled ? `Resend OTP (${countdown}s)` : 'Resend OTP'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OTPVerification; 