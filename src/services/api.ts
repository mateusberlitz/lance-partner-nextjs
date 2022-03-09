import axios from 'axios'
import { parseCookies } from 'nookies';

const cookies = parseCookies();
console.log(process.env.NODE_ENV);
export const serverApi = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? process.env.PARTNER_PUBLIC_API : process.env.PARTNER_PUBLIC_LOCAL_API,
});

serverApi.interceptors.request.use(async config => {
    const { 'partner.token' : token } = parseCookies();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export const api = axios.create({
    baseURL: '/api'
});

export const storageApi = process.env.NODE_ENV === 'production' ? process.env.PARTNER_PUBLIC_STORAGE : process.env.PARTNER_PUBLIC_LOCAL_STORAGE;