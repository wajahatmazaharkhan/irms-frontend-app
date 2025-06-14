import { useState, useEffect } from 'react';
import { batchService } from '../services/batchService';
import { formatMonth, getStatusFromDates } from '../utils/dateUtils';

export const useBatchData = () => {
    const [batchData, setBatchData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBatchData = async () => {
        try {
            setLoading(true);
            const data = await batchService.getBatchSummary();
            const progressData = await batchService.getBatchProgress();

            const transformedData = data.map((batch) => ({
                id: batch._id,
                batchName: batch.name,
                month: formatMonth(batch.startDate),
                startDate: batch.startDate,
                endDate: batch.EndDate,
                totalInterns: batch.totalInterns,
                activeInterns: batch.totalInterns,
                completedInterns: `${progressData.find(p => p._id === batch._id)?.completedTasks ?? 0}/${progressData.find(p => p._id === batch._id)?.allTasks ?? 0}`,
                totalHR: batch.totalHR,
                status: getStatusFromDates(batch.startDate, batch.EndDate),
                progress: progressData.find(p => p._id === batch._id)?.progress ?? 0,
            }));

            setBatchData(transformedData);
            setError(null);
        } catch (err) {
            setError("Failed to load batch data. Please try again later.");
            console.error("Error fetching batch data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBatchData();
    }, []);

    return { batchData, loading, error, refetchBatchData: fetchBatchData };
};
