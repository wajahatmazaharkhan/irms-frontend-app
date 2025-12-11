"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { ArrowLeft, Eye, EyeOff, Lock, CheckCircle } from "lucide-react"
import iispprLogo from "../assets/Images/iisprlogo.png"
import axios from "axios"
import useTitle from "@/Components/useTitle"

const NewPasswordForm = () => {
    useTitle("Set New Password")
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: "",
    })
    const [showPassword, setShowPassword] = useState({
        new: false,
        confirm: false,
    })
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        feedback: [],
    })

    // Get email from session storage
    const email = sessionStorage.getItem("resetEmail")

    // Redirect if no email found
    useEffect(() => {
        if (!email) {
            navigate("/reset-account-password")
        }
    }, [email, navigate])

    // Password strength checker
    const checkPasswordStrength = (password) => {
        const checks = [
            { test: password.length >= 8, message: "At least 8 characters" },
            { test: /[A-Z]/.test(password), message: "One uppercase letter" },
            { test: /[a-z]/.test(password), message: "One lowercase letter" },
            { test: /\d/.test(password), message: "One number" },
            { test: /[!@#$%^&*(),.?\":{}|<>]/.test(password), message: "One special character" },
        ]

        const passedChecks = checks.filter((check) => check.test)
        const failedChecks = checks.filter((check) => !check.test)

        setPasswordStrength({
            score: passedChecks.length,
            feedback: failedChecks.map((check) => check.message),
        })
    }

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))

        // Clear specific error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }))
        }

        // Check password strength for new password
        if (name === "newPassword") {
            checkPasswordStrength(value)
        }

        // Clear confirm password error if passwords now match
        if (name === "confirmPassword" && value === formData.newPassword) {
            setErrors((prev) => ({
                ...prev,
                confirmPassword: "",
            }))
        }
    }

    // Validate form
    const validateForm = () => {
        const newErrors = {}

        if (!formData.newPassword) {
            newErrors.newPassword = "New password is required"
        } else if (passwordStrength.score < 4) {
            newErrors.newPassword = "Password does not meet requirements"
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password"
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsLoading(true)

        try {
            // Simulate API call to reset password
            await axios.post(`${import.meta.env.VITE_BASE_URL}/user/resetpassword`, {
                email,
                newPassword: formData.newPassword,
            })

            // Clear session storage
            sessionStorage.removeItem("resetEmail")

            // Show success message
            toast.success("Password reset successfully!")

            // Navigate to login page
            navigate("/login")
        } catch (error) {
            toast.error("Failed to reset password. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    // Toggle password visibility
    const togglePasswordVisibility = (field) => {
        setShowPassword((prev) => ({
            ...prev,
            [field]: !prev[field],
        }))
    }

    // Get password strength color and width
    const getStrengthStyles = () => {
        const percentage = (passwordStrength.score / 5) * 100
        let color = "bg-red-500"

        if (passwordStrength.score > 3) color = "bg-green-500"
        else if (passwordStrength.score > 2) color = "bg-yellow-500"

        return { color, width: `${percentage}%` }
    }

    // Get strength text
    const getStrengthText = () => {
        if (passwordStrength.score <= 2) return "Weak"
        if (passwordStrength.score <= 3) return "Medium"
        return "Strong"
    }

    // Get strength text color
    const getStrengthTextColor = () => {
        if (passwordStrength.score <= 2) return "text-red-600 dark:text-red-400"
        if (passwordStrength.score <= 3) return "text-yellow-600 dark:text-yellow-400"
        return "text-green-600 dark:text-green-400"
    }

    if (!email) return null

    const strengthStyles = getStrengthStyles()

    // helper: pick a dark variant for the dynamic strength bar color
    const getDarkVariantForStrength = (baseClass) => {
        if (baseClass === "bg-red-500") return "dark:bg-red-400"
        if (baseClass === "bg-yellow-500") return "dark:bg-yellow-400"
        if (baseClass === "bg-green-500") return "dark:bg-green-400"
        return ""
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-6 bg-white dark:bg-slate-800 p-8 rounded-nonexl shadow-lg">
                {/* Logo and Header */}
                <div className="text-center">
                    <img src={iispprLogo || "/placeholder.svg"} alt="IISPPR Logo" className="mx-auto h-16 w-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Set New Password</h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                        Create a strong password for <span className="font-medium text-gray-900 dark:text-gray-100">{email}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* New Password Field */}
                    <div className="space-y-2">
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                id="newPassword"
                                name="newPassword"
                                type={showPassword.new ? "text" : "password"}
                                value={formData.newPassword}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 pr-10 border rounded-nonemd shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent ${errors.newPassword ? "border-red-500 dark:border-red-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100" : "border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                                    }`}
                                placeholder="Enter your new password"
                                aria-invalid={!!errors.newPassword}
                                aria-describedby={errors.newPassword ? "newPassword-error" : undefined}
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                                onClick={() => togglePasswordVisibility("new")}
                                aria-label={showPassword.new ? "Hide new password" : "Show new password"}
                            >
                                {showPassword.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.newPassword && <p id="newPassword-error" className="text-red-500 text-sm">{errors.newPassword}</p>}

                        {/* Password Strength Indicator */}
                        {formData.newPassword && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-300">Password strength:</span>
                                    <span className={`text-sm font-medium ${getStrengthTextColor()}`}>{getStrengthText()}</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-nonefull h-2">
                                    <div
                                        className={`h-2 rounded-nonefull transition-all duration-300 ${strengthStyles.color} ${getDarkVariantForStrength(strengthStyles.color)}`}
                                        style={{ width: strengthStyles.width }}
                                    />
                                </div>
                                {passwordStrength.feedback.length > 0 && (
                                    <div className="text-sm text-gray-600 dark:text-gray-300">
                                        <p className="font-medium">Password must include:</p>
                                        <ul className="list-disc list-inside space-y-1 mt-1">
                                            {passwordStrength.feedback.map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showPassword.confirm ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 pr-10 border rounded-nonemd shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent ${errors.confirmPassword ? "border-red-500 dark:border-red-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100" : "border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                                    }`}
                                placeholder="Confirm your new password"
                                aria-invalid={!!errors.confirmPassword}
                                aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                                onClick={() => togglePasswordVisibility("confirm")}
                                aria-label={showPassword.confirm ? "Hide confirm password" : "Show confirm password"}
                            >
                                {showPassword.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.confirmPassword && <p id="confirmPassword-error" className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                        {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
                            <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Passwords match
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="space-y-4">
                        <button
                            type="submit"
                            disabled={isLoading || passwordStrength.score < 4}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-nonemd shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-disabled={isLoading || passwordStrength.score < 4}
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
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
                                    Updating Password...
                                </span>
                            ) : (
                                "Update Password"
                            )}
                        </button>

                        {/* Back Button */}
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => navigate("/verify-otp")}
                                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium flex items-center justify-center w-full"
                            >
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                Back to OTP Verification
                            </button>
                        </div>
                    </div>
                </form>

                {/* Security Tips */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-slate-700 rounded-nonelg">
                    <div className="flex items-start">
                        <Lock className="w-5 h-5 text-blue-600 dark:text-blue-300 mt-0.5 mr-2 flex-shrink-0" />
                        <div className="text-sm text-blue-800 dark:text-blue-200">
                            <p className="font-medium mb-1">Security Tips:</p>
                            <ul className="space-y-1 text-blue-700 dark:text-blue-100">
                                <li>• Use a unique password you {`haven't`} used before</li>
                                <li>• Consider using a password manager</li>
                                <li>• {`Don't`} share your password with anyone</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewPasswordForm