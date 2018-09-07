import axios from 'axios'
import router from './router'
import qs from 'qs'

axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.method === 'post') {
      config.data = qs.stringify(config.data);
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  });

axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.clear();
          router.push("/login");
      }
    }
    return Promise.reject(error.response.data)
  });

export default axios;
