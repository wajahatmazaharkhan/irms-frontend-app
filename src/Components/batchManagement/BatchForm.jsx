import { useState } from 'react';
import { X, Save, Plus } from 'lucide-react';

export const BatchForm = ({ onSubmit, availableInterns, availableHR, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        startDate: '',
        EndDate: '',
        interns: [],
        hr: []
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Create New Batch</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Batch Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full border rounded-md p-2"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Start Date</label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                className="w-full border rounded-md p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">End Date</label>
                            <input
                                type="date"
                                value={formData.EndDate}
                                onChange={(e) => setFormData({...formData, EndDate: e.target.value})}
                                className="w-full border rounded-md p-2"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Select Interns</label>
                        <select
                            multiple
                            value={formData.interns}
                            onChange={(e) => setFormData({
                                ...formData,
                                interns: Array.from(e.target.selectedOptions, option => option.value)
                            })}
                            className="w-full border rounded-md p-2"
                        >
                            {availableInterns.map(intern => (
                                <option key={intern.id} value={intern.id}>
                                    {intern.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Select HR</label>
                        <select
                            multiple
                            value={formData.hr}
                            onChange={(e) => setFormData({
                                ...formData,
                                hr: Array.from(e.target.selectedOptions, option => option.value)
                            })}
                            className="w-full border rounded-md p-2"
                        >
                            {availableHR.map(hr => (
                                <option key={hr.id} value={hr.id}>
                                    {hr.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Save Batch
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
