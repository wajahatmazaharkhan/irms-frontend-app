import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

function HrAllUsersInterns({ hrId }) {
    const [interns, setInterns] = useState([]); // State to store interns data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    useEffect(() => {
        const fetchInterns = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/hr/interns/${hrId}`);
                setInterns(response.data.interns); // Set interns data
                setLoading(false);
            } catch (error) {
                setError("Failed to fetch interns.",error);
                setLoading(false);
            }
        };

        if (hrId) {
            fetchInterns(); // Fetch interns only if hrId is provided
        }
    }, [hrId]);

    if (loading) return <p>Loading interns...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Interns List for HR ID: {hrId}</h2>
            {interns.length > 0 ? (
                <table border="1" style={{ width: "100%", textAlign: "left", marginTop: "10px" }}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Mobile Number</th>
                            <th>Email</th>
                            <th>Department</th>
                        </tr>
                    </thead>
                    <tbody>
                        {interns.map((intern) => (
                            <tr key={intern._id}>
                                <td>{intern.name}</td>
                                <td>{intern.mnumber}</td>
                                <td>{intern.email}</td>
                                <td>{intern.department}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No interns found for this HR.</p>
            )}
        </div>
    );
}
HrAllUsersInterns.propTypes = {
    hrId: PropTypes.string.isRequired, 
};

export default HrAllUsersInterns;
