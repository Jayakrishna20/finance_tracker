import axios from 'axios';

// Create base client
export const axiosClient = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});
