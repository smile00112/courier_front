import axios from 'axios';
import localStorageService from './localStorage.service';
import config from '../config.json';

const httpAuth = axios.create({
  baseURL: `${config.apiEndPoint}/auth/`,
  params: {
    key: process.env.REACT_APP_FIREBASE_KEY,
  },
});

const authService = {
  signUp: async (payload) => {
    console.log('signUp')
    const { data } = await httpAuth.post(`signUp`, payload);
    return data;
  },
  signIn: async ({ email, password }) => {
    console.log('signIn')
    const { data } = await httpAuth.post(`token`, {
      email,
      password,
      returnSecureToken: true,
    });
    return data;
  },
  refresh: async () => {
    console.log('refresh')
    const { data } = await httpAuth.post('refresh_token', {
      grant_type: 'refresh_token',
      refresh_token: localStorageService.getRefreshToken(),
    });
    
    return data;
  },
};

export default authService;
