import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Avatar } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Navbar, useTitle } from "../Components/compIndex";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AccountDetails() {
  useTitle("Your Account");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  const [formDetails, setFormDetails] = useState({
    fullName: "",
    email: "",
    studying: "",
    currentRole: "",
    phoneNumber: "",
    countryCode: "+91",
    profilePicture: "",
    bio: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/api/auth/user/${localStorage.getItem("userId")}`
        );
        const data = response.data;
        console.log("🚀 ~ fetchUserProfile ~ data:", data);

        setUser(data);
        setFormDetails({
          fullName: data.name || "",
          email: data.email || "",
          studying: "",
          currentRole: data.role || "",
          phoneNumber: data.mnumber ? `${data.mnumber.toString()}` : "+91 ",
          countryCode: "+91",
          profilePicture: data.profilePicture || "",
          bio: "",
        });

        if (data.profilePicture) {
          setProfilePicture(data.profilePicture);
        }
      } catch (error) {
        console.error(`Error fetching user details: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const navigate = useNavigate();

  const getInitials = (name) => {
    const words = name?.trim().split(" ") || [];
    if (words.length < 2) return words[0]?.[0]?.toUpperCase() || "";
    return `${words[0][0]?.toUpperCase() || ""}${
      words[1][0]?.toUpperCase() || ""
    }`;
  };

  const handleInputChange = (field, value) => {
    setFormDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaveStatus("");
    try {
      // Send plain JSON that matches the controller's expectations
      const payload = {
        fullName: formDetails.fullName,
        email: formDetails.email,
        studying: formDetails.studying,
        currentRole: formDetails.currentRole,
        phoneNumber: formDetails.phoneNumber,
        countryCode: formDetails.countryCode,
        profilePicture: profilePicture || formDetails.profilePicture,
        bio: formDetails.bio,
        userId: localStorage.getItem("userId"), // fallback for controller
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/user/update-profile`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setSaveStatus("Details saved successfully!");
        window.location.reload();
      } else {
        setSaveStatus("Failed to save changes. Please try again.");
      }
    } catch (error) {
      setSaveStatus("Error saving account details.");
      console.error("Error saving account details:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-950">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 border-opacity-75"></div>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-slate-950">
      <Navbar />
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            My Profile
          </h1>
          <p className="text-gray-500 mt-1 dark:text-gray-400">
            Manage your personal information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="bg-white shadow-sm border-0 overflow-hidden dark:bg-slate-900 dark:text-gray-100 dark:shadow-black/40">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-24"></div>
              <div className="px-6 pb-6 -mt-12 flex flex-col items-center">
                <Avatar className="w-24 h-24 rounded-nonefull border-4 border-white bg-white text-indigo-600 flex items-center justify-center font-bold text-3xl overflow-hidden shadow-md dark:border-slate-900 dark:bg-slate-900 dark:text-indigo-300">
                  {profilePicture ? (
                    <img
                      src={profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getInitials(formDetails.fullName)
                  )}
                </Avatar>
                <div className="mt-4 text-center capitalize">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {formDetails.fullName || "Your Name"}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1 dark:text-gray-400">
                    {formDetails.email}
                  </p>
                  <p className="text-gray-600 text-sm mt-2 dark:text-gray-300">
                    Current Role:{" "}
                    <b className="dark:text-gray-100 uppercase">
                      {formDetails.currentRole || "Your Role"}
                    </b>
                  </p>
                </div>

                <Button
                  onClick={() => navigate("/reset-account-password")}
                  className="w-full mt-4 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors dark:bg-slate-900 dark:text-gray-100 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  Change Password
                </Button>
              </div>
            </Card>
          </div>

          {/* Profile Details Form */}
          <div className="lg:col-span-2 capitalize">
            <Card className="bg-white shadow-sm border-0 dark:bg-slate-900 dark:text-gray-100 dark:shadow-black/40">
              <CardHeader className="border-b border-gray-100 pb-4 dark:border-slate-800">
                <CardTitle className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Full Name
                    </Label>
                    <Input
                      type="text"
                      value={formDetails.fullName}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                      className="border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-nonemd dark:bg-slate-950 dark:border-slate-700 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Current Role
                    </Label>
                    <Input
                      type="text"
                      value={formDetails.currentRole}
                      placeholder="Enter your current role"
                      readOnly
                      className="border-gray-300 capitalize focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-nonemd dark:bg-slate-950 dark:border-slate-700 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Phone Number
                    </Label>
                    <Input
                      type="tel"
                      value={formDetails.phoneNumber}
                      placeholder="Enter your phone number"
                      onChange={(e) => {
                        let value = e.target.value;
                        if (!value.startsWith("+91")) {
                          value = "+91 " + value.replace("+91 ", "");
                        }
                        handleInputChange("phoneNumber", value);
                      }}
                      className="border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-nonemd dark:bg-slate-950 dark:border-slate-700 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
                    />
                  </div>
                </div>

                <div className="">
                  <div className="mt-8 flex justify-end">
                    <Button
                      onClick={handleSave}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-nonemd transition-colors dark:bg-indigo-600 dark:hover:bg-indigo-500"
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>

                {saveStatus && (
                  <div
                    className={`mt-4 p-3 rounded-nonemd ${
                      saveStatus.includes("successfully")
                        ? "bg-green-50 text-green-800 border border-green-200 dark:bg-green-950 dark:text-green-200 dark:border-green-800"
                        : "bg-red-50 text-red-800 border border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-800"
                    }`}
                  >
                    {saveStatus}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
