export const batchService = {
    fetchBatchData: async () => {
        const baseUrl = import.meta.env.VITE_BASE_URL;
        const response = await fetch(`${baseUrl}/api/batch/get-summary`);
        return response.json();
    },

    fetchBatchIds: async () => {
        const baseUrl = import.meta.env.VITE_BASE_URL;
        const response = await fetch(`${baseUrl}/api/batch/get-ids`);
        return response.json();
    },

    fetchBatchProgress: async () => {
        const baseUrl = import.meta.env.VITE_BASE_URL;
        const response = await fetch(`${baseUrl}/batches/progress`);
        return response.json();
    },

    fetchAvailableUsers: async () => {
        const baseUrl = import.meta.env.VITE_BASE_URL;
        const response = await fetch(`${baseUrl}/allusers`);
        return response.json();
    },

    deleteBatch: async (batchId) => {
        const baseUrl = import.meta.env.VITE_BASE_URL;
        return fetch(`${baseUrl}/batches/${batchId}`, {
            method: "DELETE"
        });
    },

    getBatchById: async (batchId) => {
        const baseUrl = import.meta.env.VITE_BASE_URL;
        return fetch(`${baseUrl}/batches/${batchId}`);
    },

    createBatch: async (batchData) => {
        const baseUrl = import.meta.env.VITE_BASE_URL;
        return fetch(`${baseUrl}/batches`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(batchData)
        });
    },

    updateBatch: async (batchId, batchData) => {
        const baseUrl = import.meta.env.VITE_BASE_URL;
        return fetch(`${baseUrl}/batches/${batchId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(batchData)
        });
    }
};