import axios from 'axios';

axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: 'http://192.168.68.136:8080/api',
  withCredentials: true,
  headers: {
    'ngrok-skip-browser-warning': 'true',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS'
  },
});


api.interceptors.request.use(
  (config) => {
      const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage or any other storage
      if (token) {
          config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
  },
  (error) => {
      return Promise.reject(error);
  }
);

export default api;