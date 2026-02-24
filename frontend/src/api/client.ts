import axios from 'axios';
import type { Transaction } from '../types';

// Create base client
export const axiosClient = axios.create({
    baseURL: '/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Mock Backend Interceptor
// We use localStorage to persist our mock backend data across reloads
const getMockData = async (): Promise<{ transactions: Transaction[] }> => {
    const stored = localStorage.getItem('mockDB');
    if (stored) {
        return JSON.parse(stored);
    }

    // If no DB in local storage, fetch the initial db.json
    const response = await fetch('/db.json');
    const data = await response.json();
    localStorage.setItem('mockDB', JSON.stringify(data));
    return data;
};

const saveMockData = (data: any) => {
    localStorage.setItem('mockDB', JSON.stringify(data));
};

axiosClient.interceptors.request.use(async (config) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const db = await getMockData();
    const url = config.url || '';

    // Mock GET /api/transactions
    if (config.method === 'get' && url === '/api/transactions') {
        config.adapter = () => Promise.resolve({
            data: db.transactions,
            status: 200,
            statusText: 'OK',
            headers: config.headers,
            config,
        });
        return config;
    }

    // Mock POST /api/transactions
    if (config.method === 'post' && url === '/api/transactions') {
        const newTx = {
            ...JSON.parse(config.data as string),
            id: crypto.randomUUID(),
        };
        db.transactions.push(newTx);
        saveMockData(db);
        config.adapter = () => Promise.resolve({
            data: newTx,
            status: 201,
            statusText: 'Created',
            headers: config.headers,
            config,
        });
        return config;
    }

    // Fallback for unmatched routes
    return config;
});
