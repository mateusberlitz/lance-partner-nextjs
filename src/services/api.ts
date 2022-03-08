import axios from 'axios'
import { parseCookies } from 'nookies';

const cookies = parseCookies();

export const serverApi = axios.create({
    baseURL: process.env.PARTNER_PUBLIC_API,
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