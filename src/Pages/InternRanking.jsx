import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import { Navbar, Footer, useTitle } from "@/Components/compIndex";
import { Loader2 } from "lucide-react";

const InternRanking = () => {
  useTitle("Intern Rankings");
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isIntern, setIsIntern] = useState(true);

  const loggedInUserId = localStorage.getItem("userId");

  const checkIfIntern = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/auth/user/${localStorage.getItem(
          "userId"
        )}`
      );
      const data = response.data;

      setIsIntern(data.role === "intern" ? true : false);
    } catch (error) {
      console.error(
        `Error fetching user details and checking if intern: ${error}`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInternRankings = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/intern-rankings`
        );
        setInterns(res.data.interns || []);
        console.log("Intern Rankings:", res.data.interns);
        await checkIfIntern();
      } catch (error) {
        console.error("Error fetching rankings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInternRankings();
  }, []);

  const getMedal = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return null;
  };

  const renderIntern = (intern, index, highlight = false) => (
    <div
      key={intern._id}
      className={`flex items-center justify-between border p-4 rounded-xl transition-all duration-300 transform hover:scale-[1.015] ${highlight
          ? "bg-yellow-100 border-yellow-300 shadow-lg"
          : index < 3
            ? "bg-gradient-to-r from-indigo-100 via-white to-indigo-50 border-indigo-300 shadow-md"
            : "bg-white hover:shadow-md border-gray-300 shadow-md"
        }`}
    >
      <div className="flex items-center space-x-4">
        <div className="text-lg font-bold text-gray-600 w-6 text-right">
          {index + 1}
        </div>
        <div>
          <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
            {getMedal(index)} {intern.name}
          </h3>
          <p className="text-sm text-gray-500">{intern.email}</p>
          <p className="text-sm text-gray-500">
            Dept: {intern.department || "N/A"}
          </p>
        </div>
      </div>
      <div className="text-xl font-bold text-blue-600">
        {intern.totalPoints} pts
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen ml-0 md:ml-32 bg-gradient-to-br from-blue-50 to-white">
        <div className="p-6 max-w-5xl mx-auto">
          <Card className="shadow-2xl border border-gray-200 rounded-xl">
            <CardHeader className="border-b bg-white rounded-t-xl">
              <CardTitle className="text-3xl font-bold text-blue-700">
                🌟 Intern Rankings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-white rounded-b-xl">
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
                </div>
              ) : interns.length === 0 ? (
                <p className="text-gray-500 text-center">
                  No intern data available.
                </p>
              ) : (
                <div className="space-y-4">
                  {(isIntern ? interns.slice(0, 3) : interns).map(
                    (intern, index) => renderIntern(intern, index)
                  )}
                  {(() => {
                    const myIndex = interns.findIndex(
                      (i) => i._id === loggedInUserId
                    );
                    if (myIndex >= 3) {
                      return (
                        <>
                          <div className="text-center text-gray-300 text-3xl font-extrabold">
                            ⋮
                          </div>
                          {renderIntern(interns[myIndex], myIndex, true)}
                        </>
                      );
                    }
                    return null;
                  })()}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default InternRanking;
