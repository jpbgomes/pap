// Logo.js

import React from 'react';
import { Image } from 'react-native';

const logoImage = 'https://imgur.com/4jhskVn.jpg';

const Logo = ({ imageSize }) => {
  const avatarIconStyles = {
    height: imageSize || 60,
    width: imageSize || 60,
  };

  return (
    <Image
      accessible accessibilityLabel={"Logo do Sexto Sentido"}
      source={{ uri: logoImage}}
      style={avatarIconStyles}
    />
  );
};

export default Logo;