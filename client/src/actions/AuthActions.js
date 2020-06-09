'use es6';

import {
  INITIALIZE_AUTH,
  AUTH_FAIL,
  AUTH_SUCCESS,
  SIGNUP_FAIL,
  SIGNUP_SUCCESS,
  REQUEST_SIGNUP,
} from './ActionTypes';
import {
  userInfo,
  requestAuthSignup,
  requestAuthLogin,
} from '../api/apiRequests.js';
import {makeRequest, requestSuccess, requestFail} from './index';

export const getCurrentUser = () => {
  return dispatch => {
    dispatch(makeRequest(INITIALIZE_AUTH));
    userInfo().then(
      response => {
        dispatch(requestSuccess(AUTH_SUCCESS, response.data));
      },
      error => dispatch(requestFail(AUTH_FAIL, 'error.message')),
    );
  };
};

export const requestSignup = data => {
  return dispatch => {
    dispatch(makeRequest(REQUEST_SIGNUP));
    requestAuthSignup(data).then(
      response => {
        dispatch(requestSuccess(SIGNUP_SUCCESS, response.data));
      },
      error => dispatch(requestFail(SIGNUP_FAIL, error.message)),
    );
  };
};

export const requestLogin = data => {
  return dispatch => {
    dispatch(makeRequest(REQUEST_SIGNUP));
    requestAuthLogin(data).then(
      response => {
        dispatch(requestSuccess(SIGNUP_SUCCESS, response.data));
      },
      error => dispatch(requestFail(SIGNUP_FAIL, error.message)),
    );
  };
};

export const authState = () => {
  return dispatch => {
    dispatch(getCurrentUser());
  };
};
