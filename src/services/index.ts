import axios from "axios";

export const axiosApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,

  headers: {
    "Content-Type": "application/json",
  },
});

axiosApi.interceptors.request.use(
  (config) => {
    // console.log('Request:', config)
    // let token

    // const localToken = localStorage.getItem(localStorageToken)

    // if (localToken) {
    //   token = localToken.replaceAll('"', '')
    // }

    // if (token && config.headers !== undefined) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }

    return config;
  },

  (error) => Promise.reject(error)
);
