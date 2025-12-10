import { useState, useEffect, useRef } from "react";
import { Mail, Lock, UserPlus, Phone, Laptop, Calendar, Layers } from "lucide-react";
import { TopNavbar, Footer, useTitle } from "@/Components/compIndex";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import iispprLogo from "../assets/Images/iisprlogo.png";

import countryCodes from "@/Components/CountryCodes";

const SignUp = ({ onSwitchToSignin }) => {
  useTitle("Register");
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [endDate, setEndDate] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const countrySelectRef = useRef(null);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/batch/get-summary`
        );
        setBatches(res.data);
      } catch (err) {
        console.error("Failed to fetch batches", err);
      }
    };
    fetchBatches();
  }, []);

  const sendSignupOtp = async () => {
    setIsLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/user/signuprequest`, {
        name: fullName,
        email,
        password,
        rpassword: confirmPassword,
        mnumber: `${countryCode}${phone}`,
        department,
        startDate: new Date().toISOString().split("T")[0],
        EndDate: endDate,
        batchId: selectedBatch.length > 0 ? selectedBatch : null,
      });
      toast.success("OTP sent to your email");
      setStep(2);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const useKeyboardSelect = (selectRef) => {
    useEffect(() => {
      const select = selectRef.current;
      if (!select) return;

      let searchString = "";
      let searchTimeout;

      const handleKeyDown = (e) => {
        // Only handle letter keys
        if (e.key.length === 1 && e.key.match(/[a-z]/i)) {
          e.preventDefault();
          searchString += e.key.toLowerCase();
          clearTimeout(searchTimeout);
          searchTimeout = setTimeout(() => (searchString = ""), 1000);

          // Find option that starts with the search string
          for (let i = 0; i < select.options.length; i++) {
            const option = select.options[i];
            if (option.text.toLowerCase().startsWith(searchString)) {
              select.selectedIndex = i;
              break;
            }
          }
        }
      };

      select.addEventListener("keydown", handleKeyDown);
      return () => select.removeEventListener("keydown", handleKeyDown);
    }, [selectRef]);
  };
  useKeyboardSelect(countrySelectRef);

  const verifySignupOtp = async () => {
    setIsLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/user/signupvalidate`, {
        email,
        otp,
      });
      toast.success("Signup successful!");
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (
        !fullName ||
        !email ||
        !phone ||
        !department ||
        !password ||
        !confirmPassword ||
        !endDate ||
        (department === "research" && !selectedBatch)
      ) {
        return toast.error("Please fill in all fields");
      }
      if (password !== confirmPassword)
        return toast.error("Passwords don't match");
      if (phone.length < 6) return toast.error("Enter a valid phone number");
      sendSignupOtp();
    } else {
      if (!otp) return toast.error("Please enter OTP");
      verifySignupOtp();
    }
  };

  return (
    <>
      {/* <TopNavbar /> */}
      <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-950">
        <div className="w-full max-w-md p-8 bg-white border shadow-lg rounded-nonexl dark:bg-slate-900 dark:border-slate-700 dark:shadow-black/40">
          <div className="text-center mb-6">
            <img src={iispprLogo} alt="Logo" className="mx-auto mb-4 w-28 h-28" />
            <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-300">
              {step === 1 ? "Create Your Account" : "Verify Your Email"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {step === 1
                ? "Sign up and enjoy the benefits."
                : "Enter the OTP sent to your email."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <>
                <div>
                  <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300" />
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      type="text"
                      placeholder="Full Name"
                      className="w-full pl-10 p-3 border rounded-nonelg focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-slate-950 dark:border-slate-700 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300" />
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="Enter Email"
                      className="w-full pl-10 p-3 border rounded-nonelg focus:ring-blue-300 dark:bg-slate-950 dark:border-slate-700 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">
                    Phone
                  </label>
                  <div className="space-y-2 p-3 border rounded-nonelg bg-gray-50 dark:bg-slate-950 dark:border-slate-700">
                    {/* Country Code Selector */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                        Country Code
                      </label>
                      <select
                        ref={countrySelectRef}
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="w-full p-2 border rounded-nonemd focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-950 dark:border-slate-700 dark:text-gray-100 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                      >
                        {countryCodes
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.name} ({c.code})
                            </option>
                          ))}
                      </select>
                    </div>

                    {/* Phone Number Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300" />
                        <input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          type="tel"
                          placeholder="Enter phone number"
                          className="w-full pl-10 p-2 border rounded-nonemd focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-950 dark:border-slate-700 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">
                    Department
                  </label>
                  <div className="relative">
                    <Laptop className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300" />
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full pl-10 p-3 border rounded-nonelg focus:ring-blue-300 dark:bg-slate-950 dark:border-slate-700 dark:text-gray-100 dark:focus:ring-blue-500"
                    >
                      <option value="">Select department</option>
                      <option value="development">Development</option>
                      <option value="research">Research</option>
                      <option value="course">Course</option>
                      <option value="communication">
                        Communication for Interns
                      </option>
                      <option value="courseCommunication">
                        Communication for Course Interns
                      </option>
                      <option value="hr">HR</option>
                    </select>
                  </div>
                </div>

                {department === "research" && (
                  <div>
                    <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">
                      Batch
                    </label>
                    <div className="relative">
                      <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300" />
                      <select
                        value={selectedBatch}
                        onChange={(e) => setSelectedBatch(e.target.value)}
                        className="w-full pl-10 p-3 border rounded-nonelg focus:ring-blue-300 dark:bg-slate-950 dark:border-slate-700 dark:text-gray-100 dark:focus:ring-blue-500"
                      >
                        <option value="">Select Batch</option>
                        {batches.map((batch) => (
                          <option key={batch._id} value={batch._id}>
                            {batch.name} (
                            {new Date(batch.startDate).toLocaleDateString()} -{" "}
                            {new Date(batch.endDate).toLocaleDateString()})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
                <div>
                  <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">
                    End Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300" />
                    <input
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full pl-10 p-3 border rounded-nonelg focus:ring-blue-300 dark:bg-slate-950 dark:border-slate-700 dark:text-gray-100 dark:focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300" />
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      placeholder="Password"
                      className="w-full pl-10 p-3 border rounded-nonelg focus:ring-blue-300 dark:bg-slate-950 dark:border-slate-700 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300" />
                    <input
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      type="password"
                      placeholder="Confirm Password"
                      className="w-full pl-10 p-3 border rounded-nonelg focus:ring-blue-300 dark:bg-slate-950 dark:border-slate-700 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:ring-blue-500"
                    />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">
                    OTP
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300" />
                    <input
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      type="text"
                      placeholder="Enter OTP"
                      className="w-full pl-10 p-3 border rounded-nonelg focus:ring-blue-300 dark:bg-slate-950 dark:border-slate-700 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:ring-blue-500"
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full p-3 font-semibold text-white bg-blue-600 rounded-nonelg hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              {isLoading
                ? step === 1
                  ? "Sending OTP..."
                  : "Verifying..."
                : step === 1
                ? "Send OTP"
                : "Verify OTP"}
            </button>
          </form>

          <div className="mt-4 text-center">
            {step === 1 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <a
                  href="/login"
                  onClick={onSwitchToSignin}
                  className="font-semibold text-blue-700 dark:text-blue-400"
                >
                  Log In
                </a>
              </p>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {`Didn't`} receive OTP?{" "}
                <button
                  onClick={() => setStep(1)}
                  className="font-semibold text-blue-700 underline dark:text-blue-400"
                >
                  Try Again
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;