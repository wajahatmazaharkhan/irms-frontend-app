import React, { useState, useEffect, useRef } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import iispprLogo from '../assets/Images/iisprlogo.png';
import useTitle from '@/Components/useTitle';
import axios from 'axios';

const OTPVerification = () => {
  useTitle('Verify OTP');
  const navigate = useNavigate();
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(30);
  const inputRefs = useRef([]);

  const email = sessionStorage.getItem('resetEmail');

  useEffect(() => {
    if (!email) {
      navigate('/reset-account-password');
    }
  }, [email, navigate]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    } else {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const focusNext = (index) => {
    if (index < 5) inputRefs.current[index + 1]?.focus();
  };

  const focusPrev = (index) => {
    if (index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handleChange = (index, value) => {
    // keep only digits and only the last digit if user types multiple
    const onlyDigits = value.replace(/\D/g, '');
    if (!onlyDigits && value !== '') return; // non-digit input

    const newOtp = [...otp];
    // if user somehow typed multiple digits in a single input (rare), take the last digit
    newOtp[index] = onlyDigits.slice(-1) || '';
    setOtp(newOtp);

    if (onlyDigits) {
      focusNext(index);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (otp[index]) {
        // clear current
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      } else {
        // move back
        focusPrev(index);
      }
    } else if (e.key === 'ArrowLeft') {
      focusPrev(index);
    } else if (e.key === 'ArrowRight') {
      focusNext(index);
    }
  };

  // Handle paste of full code
  const handlePaste = (e) => {
    e.preventDefault();
    const paste = (e.clipboardData || window.clipboardData).getData('text');
    const digits = paste.replace(/\D/g, '').slice(0, 6);
    if (!digits) return;

    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = digits[i] || '';
    }
    setOtp(newOtp);

    // focus the next empty input or the last one
    const firstEmpty = newOtp.findIndex((d) => d === '');
    if (firstEmpty === -1) {
      inputRefs.current[5]?.focus();
    } else {
      inputRefs.current[firstEmpty]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');

    if (otpValue.length !== 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const resp = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/verifyresetotp`, { email, otp: otpValue });
      toast.success(resp?.data?.message || 'OTP verified successfully!');
      navigate('/verify-reset-token', { state: { email } });
    } catch (err) {
      // try to show backend message if present
      const msg = err?.response?.data?.message || 'Failed to verify OTP. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendDisabled) return;
    try {
      setResendDisabled(true);
      setCountdown(30);
      await axios.post(`${import.meta.env.VITE_BASE_URL}/user/sendresetotp`, { email });
      toast.success('OTP has been resent to your email');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to resend OTP';
      toast.error(msg);
      setResendDisabled(false);
    }
  };

  if (!email) return null;

  return (
    // outer container: light gradient and dark gradient for dark mode
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      {/* card: white in light, slate-800 in dark; no rounded corners (rounded-none) */}
      <div className="max-w-md w-full space-y-6 bg-white dark:bg-slate-800 p-8 rounded-none shadow-lg border border-transparent dark:border-slate-700">
        <div className="text-center">
          <img
            src={iispprLogo}
            alt="IISPPR Logo"
            className="mx-auto h-16 w-auto mb-4 filter-none dark:filter-none"
          />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Verify OTP</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Enter the 6-digit code sent to{' '}
            <span className="font-medium text-gray-800 dark:text-gray-100 break-words">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-center space-x-2">
              {otp.map((value, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={1}
                  value={value}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className={
                    'w-12 h-12 text-center text-xl rounded-none focus:outline-none ' +
                    'border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 ' +
                    'text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ' +
                    'focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent ' +
                    'transition-shadow duration-150'
                  }
                  autoFocus={index === 0}
                  aria-label={`OTP digit ${index + 1}`}
                />
              ))}
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-sm">
                {error}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className={
                'w-full flex justify-center py-2 px-4 border border-transparent rounded-none shadow-sm text-sm font-medium text-white ' +
                'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 ' +
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 ' +
                'disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150'
              }
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
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
                className={
                  'text-sm font-medium flex items-center justify-center w-full ' +
                  'text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 ' +
                  'focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-400 focus:ring-offset-0'
                }
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Reset Password
              </button>
            </div>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Didn't receive the code?{' '}
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={resendDisabled}
              className={
                'font-medium focus:outline-none ' +
                (resendDisabled
                  ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300')
              }
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