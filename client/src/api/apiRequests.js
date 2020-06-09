import axios from 'axios';

import {AUTH_EP, params} from '../utils/urlUtils';

export const requestAuthSignup = body =>
  axios.post(`${AUTH_EP}/signup`, body, {withCredentials: true});

export const requestAuthLogin = (body, token) =>
  axios.post(`${AUTH_EP}/login?token=${token}`, body, params);

export const requestAuthLogout = () =>
  axios.post(`${AUTH_EP}/logoutAll`, null, params);

export const userInfo = () =>
  axios.get(`${AUTH_EP}/users/me`, {withCredentials: true});

export const requestUserUpdate = (body, id) =>
  axios.patch(`${AUTH_EP}/update?id=${id}`, body, params);

export const requestEmailRecovery = body => {
  return axios.post(`${AUTH_EP}/recovery`, body, params);
};

export const requestDeleteAccount = () => {
  return axios.delete(`${AUTH_EP}/delete-account`, null, params);
};

export const requestUpdatePassword = (body, token) => {
  return axios.post(`${AUTH_EP}/${token}/update-password`, body);
};
