const BASE_URL = import.meta.env.VITE_BASE_URL;

export const batchService = {
    getBatchSummary: () => fetch(`${BASE_URL}/api/batch/get-summary`).then(res => res.json()),
    getBatchProgress: () => fetch(`${BASE_URL}/batches/progress`).then(res => res.json()),
    getBatchDetails: (id) => fetch(`${BASE_URL}/batches/${id}`).then(res => res.json()),
    createBatch: (data) => fetch(`${BASE_URL}/api/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),
    deleteBatch: (id) => fetch(`${BASE_URL}/api/batch/${id}`, {
        method: 'DELETE'
    }).then(res => res.json()),
};
