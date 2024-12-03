import axios from 'axios';

axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: 'https://5410-31-135-213-5.ngrok-free.app/api',
  withCredentials: true,
  headers: {
    'ngrok-skip-browser-warning': 'true',
    'Access-Control-Allow-Origin': 'true',
    'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS'
  },
});

export default api;