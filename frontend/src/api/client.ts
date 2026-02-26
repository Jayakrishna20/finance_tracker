import axios from 'axios';

// Create base client
export const axiosClient = axios.create({
    baseURL: '/',
    headers: {
        'Content-Type': 'application/json',
    },
});
