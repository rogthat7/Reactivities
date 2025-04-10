import axios from "axios";
import { store } from "../../stores/store";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const agent = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://localhost:5001/api", // Fallback to localhost if undefined
    timeout: 10000, // 10 seconds timeout
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    validateStatus: (status) => {
        return status >= 200 && status < 300; // default
    }
});
agent.interceptors.request.use(
     config => {
        store.UIStore.isBusy(); // Start loading
        return config;
    })
agent.interceptors.response.use(
    async response => {
        try {
            if (response.status === 200 || response.status === 201) {
                await delay(1000); // Simulate a delay of 1 second
                return response;
            } else if (response.status === 204) {
                return Promise.resolve();
            } else if (response.status === 400) {
                return Promise.reject(response.data);
            } else if (response.status === 401) {
                console.log('Unauthorized', response.data);
                return Promise.reject(response.data);
            } else if (response.status === 403) {
                console.log('Forbidden', response.data);
                return Promise.reject(response.data);
            } else if (response.status === 404) {
                console.log('Not Found', response.data);
                return Promise.reject(response.data);
            } else if (response.status === 500) {
                console.log('Server Error', response.data);
                return Promise.reject(response.data);
            }
            return response.data;
        }
        catch (error) {
            console.log('Error', error);
            return Promise.reject(error);
        }
        finally {
            store.UIStore.isIdle();
        }
    }
    ,error => {
        console.log('Error', error);
        return Promise.reject(error);
    }
);

export default agent;