import { Plus, Calendar as CalendarIcon, Download, Settings } from "lucide-react";

export default function QuickActions({ setShowCreateForm }) {
  const actions = [
    {
      title: "Create New Batch",
      description: "Start a new intern batch session",
      icon: Plus,
      color: "from-blue-500 to-blue-700",
      action: "create",
      onClick: () => setShowCreateForm(true),
    },
    {
      title: "Schedule Sessions",
      description: "Plan upcoming batch sessions",
      icon: CalendarIcon,
      color: "from-green-500 to-green-700",
      action: "schedule",
    },
    {
      title: "Export Reports",
      description: "Download batch performance reports",
      icon: Download,
      color: "from-purple-500 to-purple-700",
      action: "export",
    },
    {
      title: "Batch Settings",
      description: "Configure batch parameters",
      icon: Settings,
      color: "from-orange-500 to-orange-700",
      action: "settings",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {actions.map((action, index) => {
        const IconComponent = action.icon;
        return (
          <button
            key={index}
            onClick={action.onClick}
            className={`bg-gradient-to-br ${action.color} rounded-xl shadow-lg p-6 text-white hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-left`}
          >
            <div className="flex items-center justify-between mb-4">
              <IconComponent className="w-8 h-8" />
              <div className="w-2 h-2 bg-white rounded-full opacity-70"></div>
            </div>
            <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
            <p className="text-sm opacity-90">{action.description}</p>
          </button>
        );
      })}
    </div>
  );
}