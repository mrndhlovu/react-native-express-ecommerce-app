import {updateObject} from './appUtils';
import {AUTH_INITIAL_STATE} from '../constants/constants';

export const hasError = state => {
  return updateObject(state, {
    ...AUTH_INITIAL_STATE,
    hasError: true,
  });
};

export const fetchingData = state => {
  return updateObject(state, {
    ...AUTH_INITIAL_STATE,
    isLoading: true,
  });
};

export const dataReceived = (state, action) => {
  return updateObject(state, {
    ...AUTH_INITIAL_STATE,
    data: action.payload,
    dataReceived: true,
    authenticated: true,
  });
};
