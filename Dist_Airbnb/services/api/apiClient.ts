import axios,  {AxiosInstance, AxiosResponse} from 'axios';

const AUTH_BASE_URL = 'http://localhost:8001/api/auth';
const LISTING_BASE_URL = 'http://localhost:5000/api';

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

authAPI.interceptors.request.use((config) => {
  // todo get the token from storage and put it here
  const token = 'your-token-here';
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});
 //this handles the response object
authAPI.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    console.error('API Error:', error.response?.data);
    return Promise.reject(error);
  }
);
