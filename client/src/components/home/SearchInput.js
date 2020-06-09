import React from 'react';
import {View} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/AntDesign';

import {STYLES} from '../../utils/styleUtils';

const SearchInput = () => {
  return (
    <View style={STYLES.search}>
      <TextInput
        placeholder="Search for a store..."
        style={STYLES.searchInput}
      />
      <View style={STYLES.searchIconWrapper}>
        <Icon style={STYLES.searchIcon} name="search1" />
      </View>
    </View>
  );
};

export default SearchInput;
