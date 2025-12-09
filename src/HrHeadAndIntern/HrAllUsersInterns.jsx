import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import { useHrContext } from "@/context/HrContext.jsx";
import axios from "axios";
import useTitle from "@/Components/useTitle";

function HrAllUsersInterns() {
    // const location = useLocation();
    useTitle('HR All Interns')
    const [interns, setInterns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {hrid } = useHrContext();
    console.log("All users interns :", hrid);

    useEffect(() => {
        const fetchInterns = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/hr/interns/${hrid}`);
                setInterns(response.data.interns);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch interns.");
                setLoading(false);
            }
        };

        if (hrid) {
            fetchInterns();
        }
    }, [hrid]);

    if (loading) return <p className="text-center text-lg text-gray-600">Loading interns...</p>;
    if (error) return <p className="text-center text-red-500 text-lg">{error}</p>;

    return (
        <>
        <HrTopNavBar/>
       
        <div className="max-w-6xl mx-auto px-4 py-6">
            <h2 className="text-2xl font-semibold text-center mb-4 text-gray-700">Interns List for HR ID: {hrid}</h2>

            {interns.length > 0 ? (
                <div className="overflow-x-auto shadow-lg rounded-nonelg">
                    <table className="w-full border-collapse bg-white shadow-md">
                        <thead className="bg-gray-200 text-gray-700">
                            <tr className="text-left">
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Mobile Number</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Department</th>
                            </tr>
                        </thead>
                        <tbody>
                            {interns.map((intern) => (
                                <tr key={intern._id} className="border-b hover:bg-gray-100">
                                    <td className="px-4 py-2">{intern.name}</td>
                                    <td className="px-4 py-2">{intern.mnumber}</td>
                                    <td className="px-4 py-2">{intern.email}</td>
                                    <td className="px-4 py-2">{intern.department}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-gray-600 text-lg mt-4">No interns found for this HR.</p>
            )}
        </div>
        </>
    );
}

HrAllUsersInterns.propTypes = {
    hrid: PropTypes.string.isRequired,
};

export default HrAllUsersInterns;
