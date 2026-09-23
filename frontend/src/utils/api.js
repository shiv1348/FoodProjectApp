//centeralized API setup

import axios from 'axios';
import qs from 'qs';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const baseURL = backendUrl ? `${backendUrl.replace(/\/+$/, '')}/api` : '/api';

const api = axios.create({
    baseURL,
    withCredentials: true,
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
});

export default api;