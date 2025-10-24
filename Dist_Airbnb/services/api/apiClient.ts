import axios,  {AxiosInstance, AxiosResponse} from 'axios';
import { getToken } from '../storage/tokenStorage';

// Use environment variables for URLs (Docker-friendly), fallback to localhost for development
const AUTH_BASE_URL = process.env.EXPO_PUBLIC_AUTH_URL || 'http://localhost:8001/api/auth';
const LISTING_BASE_URL = process.env.EXPO_PUBLIC_LISTING_URL || 'http://localhost:5000/api';

export const authAPI: AxiosInstance = axios.create({
  baseURL: AUTH_BASE_URL,
  timeout: 10000,
  headers:{
    'Content-Type': 'application/json'
  }
});

export const listingAPI: AxiosInstance = axios.create({
  baseURL: LISTING_BASE_URL,
  timeout: 10000,
  headers:{
    'Content-Type': 'application/json'
  }
});

// Add token to auth API requests
authAPI.interceptors.request.use(async(config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Add token to listing API requests
listingAPI.interceptors.request.use(async(config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Handle auth API responses
authAPI.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    console.error('Auth API Error:', error.response?.data);
    return Promise.reject(error);
  }
);

// Handle listing API responses
listingAPI.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    console.error('Listing API Error:', error.response?.data);
    return Promise.reject(error);
  }
);
