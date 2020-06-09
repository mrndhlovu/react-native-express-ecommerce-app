import {CREATE_ALERT, HAS_ERROR} from './ActionTypes';

export const makeRequest = type => ({type});

export const requestSuccess = (type, payload) => ({type, payload});

export const requestFail = (type, payload) => ({type, payload});

export const createMessage = message => ({
  type: CREATE_ALERT,
  payload: message,
});

export const hasError = message => ({
  type: HAS_ERROR,
  payload: message,
});
