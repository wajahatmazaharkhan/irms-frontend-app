import React from "react";
import { FileText, IdCard, Award, ClipboardList } from "lucide-react";

const InternNecessities = () => {
  const buttonData = [
    {
      label: "Download LOA",
      icon: <FileText className="w-5 h-5 mr-2" />,
      link: "https://iisppr.in/id-card-download.php", // Replace with actual link
    },
    {
      label: "Download ID",
      icon: <IdCard className="w-5 h-5 mr-2" />,
      link: "https://iisppr.in/id-card-download.php", // Replace with actual link
    },
    {
      label: "Download Certificate",
      icon: <Award className="w-5 h-5 mr-2" />,
      link: "https://iisppr.in/internship-certificate-download.php", // Replace with actual link
    },
    {
      label: "Registration Form",
      icon: <ClipboardList className="w-5 h-5 mr-2" />,
      link: "https://iisppr.in/users-apply-form.php", // Replace with actual link
    },
  ];

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white dark:bg-slate-900 rounded-none2xl shadow-xl border border-gray-200 dark:border-slate-700 mb-20 transition-colors duration-300">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-slate-100 text-center mb-6">
        Intern Essentials
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {buttonData.map((item, index) => (
          <a
            key={index}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white px-4 py-3 rounded-nonexl shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-300 ease-in-out dark:shadow-slate-900"
          >
            {item.icon}
            <span className="text-sm font-medium">{item.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default InternNecessities;