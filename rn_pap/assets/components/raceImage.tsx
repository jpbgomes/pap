// RaceImage.js

import React from 'react';
import { StyleSheet, Image } from 'react-native';

import { gColors } from '../../globalStyles';

import setup from '../../setup';

const RaceImage = ({ title, source }) => {
  return (
    <Image
      accessible accessibilityLabel={"Imagem da Corrida - " + title}
      source={
        source.startsWith('http')
          ? { uri: source }
          : { uri: setup.appUrl + "/" + source }
      }
      style={styles.raceImage}
    />
  );
};

const styles = StyleSheet.create({
  raceImage: {
    width: '100%',
    minWidth: 250,
    height: 260,
    objectFit: 'cover',
    borderRadius: 18,
  },
});

export default RaceImage;