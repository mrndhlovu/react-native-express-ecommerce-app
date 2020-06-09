/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {Provider} from 'react-redux';

import BaseRouter from './Routes';
import AuthContainer from './containers/AuthContainer';

import store from './store';

const App = () => {
  return (
    <Provider store={store}>
      <AuthContainer>
        <BaseRouter />
      </AuthContainer>
    </Provider>
  );
};

export default App;
