import { BatchItem } from './BatchItem';

export const BatchList = ({ batches, onView, onDelete, loading }) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {batches.map(batch => (
                <BatchItem
                    key={batch.id}
                    batch={batch}
                    onView={() => onView(batch.id)}
                    onDelete={() => onDelete(batch.id, batch.batchName)}
                />
            ))}
            {batches.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                    No batches found
                </div>
            )}
        </div>
    );
};
