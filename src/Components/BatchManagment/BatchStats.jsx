import { Users, CalendarDays, UserCheck, TrendingUp } from "lucide-react";

export function BatchStats({ batchData }) {
  const stats = [
    {
      icon: Users,
      label: "Total Batches",
      value: batchData.length.toString(),
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      icon: CalendarDays,
      label: "Active Sessions",
      value: batchData
        .filter((batch) => batch.status === "Active")
        .length.toString(),
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      icon: UserCheck,
      label: "Total Interns",
      value: batchData
        .reduce((sum, batch) => sum + batch.totalInterns, 0)
        .toString(),
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      icon: TrendingUp,
      label: "Total HR",
      value: batchData
        .reduce((sum, batch) => sum + batch.totalHR, 0)
        .toString(),
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={index}
            className={`bg-white rounded-nonexl shadow-md p-6 border ${stat.borderColor} hover:shadow-lg transition-shadow duration-300`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.label}
                </p>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-nonefull ${stat.bgColor}`}>
                <IconComponent className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}