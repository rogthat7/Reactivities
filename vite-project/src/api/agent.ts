import axios, { Axios, AxiosError, AxiosResponse } from 'axios';
import { Activity } from '../app/models/activity';
import { toast } from 'react-toastify';
import { router } from '../app/router/Routes';
import { store } from '../app/stores/store';
import { ServerError } from '../app/models/serverError';

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}
axios.interceptors.response.use(async response => {
    return sleep(1000).then(() => {
        return response;
    })
}, (error: AxiosError) => {
    const {data, status, config} = error.response!;
    switch (status) {
        case 400:
            if (config.method === 'get' && (data as any).errors.hasOwnProperty('id')) {
                router.navigate('/not-found');
            }
            if ((data as any).errors) {
                const modalStateErrors = [];
                for (const key in (data as any).errors) {
                    if ((data as any).errors[key]) {
                        modalStateErrors.push((data as any).errors[key]);
                    }
                }
                throw modalStateErrors.flat();
            }
            if(config.method === 'post' && (data as any).errors) {
                toast.error('validation errors');
            }
            else{
                toast.error(data as string);
            }
            break;
        case 401:
            toast.error('unauthorised');
            break;
        case 404:
            router.navigate('/not-found');
            break;
        case 500:
            store.commonStore.setServerError(data as ServerError);
            router.navigate('/server-error');
            break;
    }
    return Promise.reject(error);
});

axios.defaults.baseURL = 'http://localhost:5000/api';

const responseBody = <T>(response: AxiosResponse  <T> ) => response.data;

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody)
}
const Activities = {
    list: () => requests.get<Activity[]>('/activities'),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: Activity) => requests.post<void>('/activities', activity),
    update: (activity: Activity) => requests.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del<void>(`/activities/${id}`)
}
const agent = {
    Activities
}
export default agent;