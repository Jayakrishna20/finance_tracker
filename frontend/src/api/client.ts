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

    try {
        const response = await axios.get('/db.json');
        const data = response.data;

        localStorage.setItem('mockDB', JSON.stringify(data));
        return data;
    } catch (error) {
        console.error('Failed to load mock data from db.json', error);
        return { transactions: [], categories: [] };
    }
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
