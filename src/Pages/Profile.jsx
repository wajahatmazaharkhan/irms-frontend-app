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
          phoneNumber: data.mnumber ? `${data.mnumber.toString()}` : "+91 ",
          countryCode: "+91",
          profilePicture: data.profilePicture || "",
          linkedInURL: data.linkedInURL || "",
          bio: data.bio || "",
        });

        if (data.profilePicture) {
          setProfilePicture(data.profilePicture);
        }
      } catch (error) {
        Swal.fire("Error", "Failed to load profile", "error");
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
    setSaving(true);

    try {
      const formData = new FormData();

      formData.append("fullName", formDetails.fullName);
      formData.append("email", formDetails.email);
      formData.append("studying", formDetails.studying);
      formData.append("currentRole", formDetails.currentRole);
      formData.append("phoneNumber", formDetails.phoneNumber);
      formData.append("countryCode", formDetails.countryCode);
      formData.append("bio", formDetails.bio || "");
      formData.append("linkedInURL", formDetails.linkedInURL || "");
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

      Swal.fire(
        "Success",
        response.data?.message || "Profile updated successfully",
        "success"
      );
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Something went wrong";

      Swal.fire("Error", message, "error");
    } finally {
      setSaving(false);
    }
  };

  /* ===== PROFILE COMPLETION ===== */

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

  if (loading) {
    return (
      <>
        <LoaderPage />
      </>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-slate-950 uppercase">
      <Navbar />

      <div className="pt-20 pb-12 max-w-6xl mx-auto px-4">
        <Card className="mb-8">
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Profile Completion</p>
            <p className="text-2xl font-bold">{profileCompletion}%</p>
            <div className="h-2 bg-gray-200 rounded mt-2">
              <div
                className="h-full bg-indigo-600 rounded"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card>
            <div className="h-24 bg-indigo-600" />
            <div className="-mt-12 flex flex-col items-center p-6">
              <Avatar className="w-24 h-24">
                {profilePicture ? (
                  <img src={profilePicture} />
                ) : (
                  getInitials(formDetails.fullName)
                )}
              </Avatar>

              <Button
                onClick={() => navigate("/reset-account-password")}
                className="mt-4"
              >
                Change Password
              </Button>
            </div>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
            </CardHeader>

            <CardContent>
              <Input
                value={formDetails.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="Full Name"
              />

              <Input
                className="mt-4"
                value={formDetails.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                placeholder="Phone Number"
              />

              <Textarea
                className="mt-4"
                value={formDetails.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Bio"
              />

              <input
                type="file"
                accept="image/*"
                className="mt-4"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  const ext = file.name.split(".").pop().toLowerCase();

                  if (!allowedFormats.includes(ext)) {
                    Swal.fire(
                      "Invalid file",
                      `Allowed formats: ${allowedFormats.join(", ")}`,
                      "error"
                    );
                    e.target.value = "";
                    return;
                  }

                  setProfilePictureFile(file);
                  setProfilePicture(URL.createObjectURL(file));
                }}
              />

              <div className="mt-6 flex justify-end">
                <Button disabled={saving} onClick={handleSave}>
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
