import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../assets/redux/store';
import setup from '../../setup';

const UserImage = ({ imageSize, imageSource }) => {
  const userData = useSelector((state: RootState) => state.user);

  const avatarIconStyles = {
    backgroundColor: 'white',
    height: imageSize || 60,
    width: imageSize || 60,
    borderRadius: 100,
  };

  let sourceUri;

  if (imageSource !== null) {
    sourceUri = imageSource;
  } else if (userData.user && userData.user.AvatarImage) {
    sourceUri = userData.user.AvatarImage;
  } else {
    sourceUri = 'https://i.imgur.com/zHnSsR0.png';
  }

  if (sourceUri && sourceUri.startsWith('http')) {
    return (
      <Image
        accessible
        accessibilityLabel={"Imagem de perfil de " + (userData.user && userData.user.Name)}
        source={{ uri: sourceUri }}
        style={avatarIconStyles}
      />
    );
  } else {
    return (
      <Image
        accessible
        accessibilityLabel={"Imagem de perfil de " + (userData.user && userData.user.Name)}
        source={{ uri: setup.appUrl + "/" + sourceUri }}
        style={avatarIconStyles}
      />
    );
  }
};

export default UserImage;
