import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader, Medal } from "lucide-react";
import NavBar from "./CustomCommNavbar";

const medalColors = ["bg-yellow-400", "bg-gray-400", "bg-amber-700"];

export default function CommRanking() {
    const [rankingData, setRankingData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/ticket/getcommrank`);
                console.log("Ranking Response:", res.data);
                setRankingData(res.data?.data || []); // ✅ Extract actual array
            } catch (error) {
                console.error("Failed to fetch ranking:", error);
                setRankingData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRankings();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
                <Loader className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <>
        <NavBar />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
            <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-none2xl p-6">
                <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">
                    🎖️ Communication Team Rankings
                </h2>

                {rankingData.length === 0 ? (
                    <p className="text-center text-gray-500">No data available.</p>
                ) : (
                    <ul className="space-y-4">
                        {rankingData.map((item, index) => {
                            const name = item.name || "Unnamed User";
                            const email = item.email || "No email";
                            const count = item.closedCount || 0;

                            return (
                                <li
                                    key={item.userId}
                                    className="flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-blue-50 rounded-nonexl shadow-sm transition"
                                >
                                    <div className="flex items-center space-x-4">
                                        {index < 3 ? (
                                            <Medal className={`w-8 h-8 ${medalColors[index]} text-white rounded-nonefull p-1`} />
                                        ) : (
                                            <span className="text-xl font-bold text-gray-500">{index + 1}</span>
                                        )}
                                        <div>
                                            <p className="font-semibold text-gray-800">{name}</p>
                                            <p className="text-sm text-gray-500">{email}</p>
                                        </div>
                                    </div>
                                    <div className="text-blue-600 font-bold text-lg">
                                        {count} Closed
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
        </>
    );
}
