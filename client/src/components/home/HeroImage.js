import React from 'react';
import {ImageBackground, View} from 'react-native';

import {STYLES} from '../../utils/styleUtils';

const HeroImage = ({source}) => {
  const image = {uri: source};
  return (
    <View style={STYLES.heroContainer}>
      <ImageBackground style={STYLES.heroImage} source={image} />
    </View>
  );
};

export default HeroImage;
