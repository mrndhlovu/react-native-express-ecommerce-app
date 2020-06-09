import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5';

const NavigationHeader = ({title}) => {
  return (
    <View style={styles.container}>
      <Icon name="arrow-left" size={20} color="#F94646" />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    height: 40,
  },
  title: {
    paddingLeft: 30,
    lineHeight: 17,
    color: '#8B8B8B',
  },
});

export default NavigationHeader;
