import React from 'react';
import {View} from 'react-native';

const CenterView = ({children}) => {
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={{flex: 1, alignContent: 'center', alignItems: 'center'}}>
      {children}
    </View>
  );
};

export default CenterView;
