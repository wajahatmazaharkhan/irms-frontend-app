import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Avatar } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import { Navbar, useTitle } from "../Components/compIndex";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/Components/ui/textarea";
import Swal from "sweetalert2";
import LoaderPage from "./LoaderPage";
import { useAuthContext } from "@/context/AuthContext";

export default function AccountDetails() {
  useTitle("Your Account");

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState("");
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const { storeProfileCompletion } = useAuthContext();

  const [formDetails, setFormDetails] = useState({
    fullName: "",
    email: "",
    studying: "",
    currentRole: "",
    phoneNumber: "",
    countryCode: "+91",
    profilePicture: "",
    linkedInURL: "",
    bio: "",
  });

  const allowedFormats = ["jpg", "jpeg", "png"];

  /* ================= FETCH PROFILE ================= */

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/api/auth/user/${localStorage.getItem("userId")}`
        );

        const data = response.data;

        setUser(data);
        setFormDetails({
          fullName: data.name || "",
          email: data.email || "",
          studying: "",
          currentRole: data.role || "",
          phoneNumber: data.mnumber ? String(data.mnumber) : "",
          countryCode: "+91",
          profilePicture: data.profilePicture || "",
          linkedInURL: data.linkedInURL || "",
          bio: data.bio || "",
        });

        if (data.profilePicture) {
          setProfilePicture(data.profilePicture);
        }
      } catch {
        Swal.fire("Error", "Failed to load profile", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const navigate = useNavigate();

  /* ================= HELPERS ================= */

  const getInitials = (name) => {
    const words = name?.trim().split(" ") || [];
    return words.length >= 2
      ? `${words[0][0]}${words[1][0]}`.toUpperCase()
      : words[0]?.[0]?.toUpperCase() || "";
  };

  const isValidLinkedIn = (url) =>
    /^https?:\/\/(www\.)?linkedin\.com\/.+$/i.test(url);

  const handleInputChange = (field, value) => {
    setFormDetails((prev) => ({ ...prev, [field]: value }));
  };

  /* ================= SAVE ================= */

  const handleSave = async () => {
    if (formDetails.linkedInURL && !isValidLinkedIn(formDetails.linkedInURL)) {
      Swal.fire(
        "Invalid LinkedIn URL",
        "Enter a valid LinkedIn profile",
        "warning"
      );
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();

      Object.entries(formDetails).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      formData.append("userId", localStorage.getItem("userId"));
      formData.append("profileCompletion", profileCompletion);

      if (profilePictureFile) {
        formData.append("profilePicture", profilePictureFile);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/user/update-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      Swal.fire("Success", response.data?.message, "success");
    } catch (error) {
      Swal.fire(
        "Error",
        error?.response?.data?.message || "Something went wrong",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  /* ================= PROFILE COMPLETION ================= */

  const profileCompletion = useMemo(() => {
    const fields = [
      "fullName",
      "email",
      "currentRole",
      "phoneNumber",
      "linkedInURL",
      "bio",
      "profilePicture",
    ];

    const completed = fields.filter((field) =>
      field === "profilePicture"
        ? Boolean(profilePicture)
        : Boolean(formDetails[field])
    );

    return Math.round((completed.length / fields.length) * 100);
  }, [formDetails, profilePicture]);

  useEffect(() => {
    storeProfileCompletion(profileCompletion);
  }, [profileCompletion]);

  if (loading) return <LoaderPage />;

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-slate-100 uppercase">
      <Navbar />

      <div className="pt-20 pb-12 max-w-6xl mx-auto px-4 space-y-8">
        {/* Profile Completion */}
        <Card className="border-gray-200 dark:border-slate-800 dark:bg-slate-900">
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Profile Completion
            </p>
            <p className="text-2xl font-bold">{profileCompletion}%</p>
            <div className="h-2 bg-gray-200 dark:bg-slate-800 rounded mt-2">
              <div
                className="h-full bg-blue-600 rounded transition-all"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Card */}
          <Card className="border-gray-200 dark:border-slate-800 dark:bg-slate-900">
            <div className="h-24 bg-blue-600 rounded-t-lg" />
            <div className="-mt-12 flex flex-col items-center p-6">
              <Avatar className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white dark:ring-slate-900 bg-gray-100 dark:bg-slate-800">
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-semibold text-gray-700 dark:text-slate-200">
                    {getInitials(formDetails.fullName)}
                  </span>
                )}
              </Avatar>

              <Button
                variant="outline"
                className="mt-4 border-gray-300 dark:border-slate-700 dark:hover:bg-slate-800"
                onClick={() => navigate("/reset-account-password")}
              >
                Change Password
              </Button>
            </div>
          </Card>

          {/* Right Card */}
          <Card className="lg:col-span-2 border-gray-200 dark:border-slate-800 dark:bg-slate-900">
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <Input
                value={formDetails.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="Full Name"
                className="dark:bg-slate-800 dark:border-slate-700"
              />

              <Input
                value={formDetails.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                placeholder="Phone Number"
                className="dark:bg-slate-800 dark:border-slate-700"
              />

              <Input
                value={formDetails.linkedInURL}
                onChange={(e) =>
                  handleInputChange("linkedInURL", e.target.value)
                }
                placeholder="LinkedIn Profile URL"
                className="dark:bg-slate-800 dark:border-slate-700"
              />

              <Textarea
                value={formDetails.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Short Bio"
                className="dark:bg-slate-800 dark:border-slate-700"
              />

              <input
                type="file"
                accept="image/*"
                className="block text-sm text-gray-600 dark:text-slate-300
                  file:mr-4 file:rounded-md file:border-0
                  file:bg-blue-600 file:px-4 file:py-2
                  file:text-white hover:file:bg-blue-700"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const ext = file.name.split(".").pop().toLowerCase();
                  if (!allowedFormats.includes(ext)) {
                    Swal.fire(
                      "Invalid File",
                      "Only JPG, JPEG, PNG allowed",
                      "error"
                    );
                    return;
                  }

                  setProfilePictureFile(file);
                  setProfilePicture(URL.createObjectURL(file));
                }}
              />

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Updating..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
