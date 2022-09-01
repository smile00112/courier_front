import axios from 'axios';
import { toast } from 'react-toastify';
import configFile from '../config.json';
import authService from './auth.service';
import localStorageService from './localStorage.service';
/* Сокеты */
import Echo from 'laravel-echo';
window.Pusher = require('pusher-js');
window.Echo = new Echo({
    broadcaster: 'pusher',
    key: '38a5dbf8bcb4d739a39b',
    cluster: 'eu',
    forceTLS: true
});
/****Сокеты *****/

const DEBUG = false;
const http = axios.create({
  baseURL: configFile.apiEndPoint,
});

http.interceptors.request.use(
  async function (config) {
    const expiresDate = localStorageService.getTokenExpiresDate();
    const refreshToken = localStorageService.getRefreshToken();
    const isExpired = refreshToken && Number(expiresDate) < Date.now();

    // if (configFile.isFireBase) {
    //   const containSlash = /\/$/gi.test(String(config.url));
    //   config.url = (containSlash ? config.url?.slice(0, -1) : config.url) + '.json';

    //   if (isExpired) {
    //     const data = await authService.refresh();
    //     localStorageService.setTokens({
    //       expiresIn: data.expires_in,
    //       accessToken: data.id_token,
    //       userId: data.user_id,
    //       refreshToken: data.refresh_token,
    //     });
    //   }
    //   const accessToken = localStorageService.getAccessToken();
    //   if (accessToken) {
    //     config.params = { ...config.params, auth: accessToken };
    //   }
    // } else 
    {
      if (isExpired) {
        if(DEBUG) console.warn('http.service  authService.refresh')
        const data = await authService.refresh();
        localStorageService.setTokens(data);
      }
      const accessToken = localStorageService.getAccessToken();
      if (accessToken) {
        config.headers = { ...config.headers, Authorization: `Bearer ${accessToken}` };
      }
    }
    if(DEBUG) console.warn('http.service__2');
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

function transformData(data) {
  return data && !data._id
    ? Object.keys(data).map(key => ({
        ...data[key],
      }))
    : data;
}

http.interceptors.response.use(
  res => {
    if (configFile.isFireBase) {
      res.data = { content: transformData(res.data) };
    }
    res.data = { content: res.data };
    return res;
  },
  function (error) {
    const expectedErrors = error.response && error.response.status >= 400 && error.response.status < 500;
    if (!expectedErrors) {
      if(DEBUG) console.log(error);
      toast.error('Something was wrong. Try it later');
    }
    return Promise.reject(error);
  }
);

const httpService = {
  get: http.get,
  post: http.post,
  put: http.put,
  delete: http.delete,
  patch: http.patch,
};

export default httpService;
