import axios from 'axios';

// Create base client
export const axiosClient = axios.create({
    baseURL: '/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Mock Backend Interceptor
// We use localStorage to persist our mock backend data across reloads
const getMockData = async (): Promise<{ transactions: any[], categories: any[] }> => {
    const stored = localStorage.getItem('mockDB');
    if (stored) {
        return JSON.parse(stored);
    }

    // Default mock data
    const categories = [
        { id: '1', name: 'Housing', type: 'normal', userId: '808240ba-8501-447a-8f64-463ae30e71ce' },
        { id: '2', name: 'Food', type: 'normal', userId: '808240ba-8501-447a-8f64-463ae30e71ce' },
        { id: '3', name: 'Transport', type: 'normal', userId: '808240ba-8501-447a-8f64-463ae30e71ce' },
        { id: '4', name: 'Utilities', type: 'normal', userId: '808240ba-8501-447a-8f64-463ae30e71ce' },
        { id: '5', name: 'Entertainment', type: 'normal', userId: '808240ba-8501-447a-8f64-463ae30e71ce' },
        { id: '6', name: 'Other', type: 'normal', userId: '808240ba-8501-447a-8f64-463ae30e71ce' },
    ];

    const data = {
        categories,
        transactions: [
            {
                id: crypto.randomUUID(),
                date: new Date().toISOString(),
                categoryId: '1',
                category: categories[0],
                amount: 1500,
                notes: 'Monthly rent',
                dayName: 'Monday',
                weekNumber: 1,
                monthYear: 'Feb-2026'
            }
        ]
    };
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
        return Promise.resolve({
            data: { status: 'success', data: db.transactions },
            status: 200,
            statusText: 'OK',
            headers: config.headers,
            config,
        } as any);
    }

    // Mock GET /api/categories
    if (config.method === 'get' && url.startsWith('/api/categories')) {
        return Promise.resolve({
            data: { status: 'success', data: db.categories },
            status: 200,
            statusText: 'OK',
            headers: config.headers,
            config,
        } as any);
    }

    // Mock POST /api/transactions
    if (config.method === 'post' && url === '/api/transactions') {
        const payload = JSON.parse(config.data as string);
        const category = db.categories.find(c => c.id === payload.categoryId);
        const newTx = {
            ...payload,
            id: crypto.randomUUID(),
            category
        };
        db.transactions.push(newTx);
        saveMockData(db);
        return Promise.resolve({
            data: { status: 'success', data: newTx },
            status: 201,
            statusText: 'Created',
            headers: config.headers,
            config,
        } as any);
    }

    // Fallback for unmatched routes
    return config;
});
