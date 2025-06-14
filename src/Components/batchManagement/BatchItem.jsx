import { Eye, Trash2, Users, Calendar, TrendingUp } from 'lucide-react';

export const BatchItem = ({ batch, onView, onDelete }) => {
    return (
        <div className="p-4 border rounded-lg mb-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">{batch.batchName}</h3>
                    <div className="flex gap-4 text-gray-600 mt-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
                {batch.month}
            </span>
                        <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
                            {batch.totalInterns} Interns
            </span>
                        <span className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
                            {batch.progress}% Complete
            </span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={onView}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                    >
                        <Eye className="w-5 h-5" />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
