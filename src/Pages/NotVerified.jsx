import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotVerified = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full px-6 py-8 bg-white rounded-nonelg shadow-md">
                <div className="text-center">
                    <AlertCircle className="mx-auto h-12 w-12 text-yellow-500" />

                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
                        Account Not Verified
                    </h1>

                    <p className="mt-4 text-base text-gray-600">
                        Your request has been sent. Please wait 24-36 hours for approval from the admin.
                    </p>

                    <div className="mt-8 flex flex-col gap-4">
                        <button
                            onClick={() => navigate("/login")}
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-nonemd focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Login Back
                        </button>
                        <button
                            onClick={() => navigate(-1)}
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-nonemd hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                        >
                            Go Back
                        </button>
                        <button
                            onClick={() => navigate("/")}
                            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-nonemd hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                            Return to Home
                        </button>
                    </div>

                    <p className="mt-6 text-sm text-gray-500">
                        If you need immediate assistance, please contact support.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotVerified;
