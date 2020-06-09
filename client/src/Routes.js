import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

import LoginContainer from './containers/LoginContainer';
import HomePageContainer from './containers/HomePageContainer';

const Stack = createStackNavigator();

const BaseRouter = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{header: () => null}}
        initialRouteName="Home">
        <Stack.Screen name="Home" component={HomePageContainer} />
        <Stack.Screen name="Login" component={LoginContainer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default BaseRouter;
