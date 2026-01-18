import { useAuthContext } from "@/context/AuthContext";
import toast from "@/utils/toast";
import { FileText, IdCard, Award, ClipboardList, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const InternNecessities = () => {
  const navigate = useNavigate();
  const { profileCompletion } = useAuthContext();

  const buttonData = [
    {
      label: "Download LOA",
      icon: FileText,
      link: "https://iisppr.in/id-card-download.php",
    },
    {
      label: "Download ID",
      icon: IdCard,
      link: "https://iisppr.in/id-card-download.php",
    },
    {
      label: "Download Certificate",
      icon: Award,
      link: "https://iisppr.in/internship-certificate-download.php",
    },
    {
      label: "Registration Form",
      icon: ClipboardList,
      link: "https://iisppr.in/users-apply-form.php",
    },
  ];

  const handleBlockedAccess = () => {
    toast.info("Please complete your profile before moving forward.");
    navigate("/your-profile");
  };

  const handleClick = (link) => {
    if (profileCompletion === 100) {
      window.open(link, "_blank", "noopener,noreferrer");
    } else {
      handleBlockedAccess();
    }
  };

  const isUnlocked = profileCompletion === 100;

  return (
    <div className="max-w-4xl mx-auto mt-10 mb-20 p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 transition-colors duration-300">
      <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-slate-100 mb-2">
        Intern Essentials
      </h2>

      <p className="text-center text-sm text-gray-500 dark:text-slate-400 mb-6">
        Complete your profile to unlock all downloads
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {buttonData.map(({ label, icon: Icon, link }, index) => (
          <button
            key={index}
            onClick={() => handleClick(link)}
            className={`relative flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300
              ${
                isUnlocked
                  ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:scale-105 hover:shadow-lg focus:ring-2 focus:ring-indigo-400"
                  : "bg-gray-200 dark:bg-slate-800 text-gray-500 dark:text-slate-400 cursor-not-allowed"
              }
            `}
          >
            <Icon className="w-5 h-5" />
            <span className="text-sm">{label}</span>

            {!isUnlocked && (
              <Lock className="absolute top-2 right-2 w-4 h-4 text-gray-400 dark:text-slate-500" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default InternNecessities;
