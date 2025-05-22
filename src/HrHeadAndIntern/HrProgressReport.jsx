import { useEffect, useState } from "react";
import { HrTopNavBar } from "./HrIndex";
import axios from "axios";
import useTitle from "@/Components/useTitle";

function HrProgressReport() {
    useTitle('HR Progress Report')
    const [reports, setReports] = useState([]);

    const handleProgressReports = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/interns/getProgress-report`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });

            setReports(response.data.reports); 
        } catch (error) {
            console.error("Unable to fetch progress reports", error);
        }
    };

    useEffect(() => {
        handleProgressReports();
    }, []);

    return (
        <>
        <HrTopNavBar></HrTopNavBar>
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4 text-center">Progress Reports</h2>
            {reports.length === 0 ? (
                <p className="text-center text-gray-500">No reports available</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reports.map((report) => (
                        <div key={report._id} className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">{report.employeeName}</h3>
                            <p className="text-gray-600">Department: <span className="font-medium">{report.department}</span></p>
                            <p className="text-gray-600">Date: <span className="font-medium">{new Date(report.date).toLocaleDateString()}</span></p>
                        </div>
                    ))}
                </div>
            )}
        </div>
        </>
    );
}

export default HrProgressReport;
