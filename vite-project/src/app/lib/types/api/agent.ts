import axios, { AxiosResponse } from "axios";
import { store } from "../../stores/store";
import { toast } from "react-toastify";
import { router } from "../../../router/Routes";

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
            switch (response.status) {
                case 200:
                case 201:
                    await delay(1000); // Simulate a delay of 1 second
                    store.UIStore.isIdle(); // Stop loading
                    return response;
                case 204:
                    return Promise.resolve({} as AxiosResponse<any, any>);
                default:
                    return Promise.reject(response.data);
                }
    }
    ,error => {
        const status = error.response?.status;
        const data = error.response?.data;
        switch (status) {
            case 400:
                if (error?.response?.data) {
                    toast.error(error.response.data);
                } else {
                    toast.error('Bad request');
                }
                break;
            case 401:{
                toast.error('Unauthorised');
                break;  
            }
            case 403:{
                toast.error('Forbidden');
                break;  
            }
            case 404:{
                router.navigate('/not-found'); 
                break;  
            }
            case 422:
                if (data?.errors) {
                    const modelStateErrors = [];
                    for (const key in data.errors) {
                        if (data.errors[key]) {
                            modelStateErrors.push(data.errors[key]);
                        }
                    }
                    throw modelStateErrors.flat(); // Flatten the array of errors
                } else if (data) {
                    toast.error(data);
                }
                break;
            case 500:{
                router.navigate('/server-error',{state:{error:data}}); 
                break;   
            }
            default:
                toast.error('An unexpected error occurred');
                break;
        }
        store.UIStore.isIdle(); // Stop loading
        return Promise.reject(error);
    }
);

export default agent;