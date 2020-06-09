import React from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

import {STYLES} from '../../utils/styleUtils';
import HeroImage from './HeroImage';
import HomeColorSleeve from './HomeColorSleeve';
import SearchInput from './SearchInput';
import RecentOrders from './RecentOrders';

const HomePage = () => {
  return (
    <View style={STYLES.home}>
      <Icon
        style={STYLES.menuIcon}
        name="menuunfold"
        onPress={() => console.log('open drawer')}
      />
      <HeroImage source="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjEyNTA3OH0" />
      <HomeColorSleeve />
      <SearchInput />
      <RecentOrders />
    </View>
  );
};

export default HomePage;
