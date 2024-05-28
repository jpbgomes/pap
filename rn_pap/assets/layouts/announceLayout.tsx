// AnnounceLayout.js

import React from 'react';
import { StyleSheet, SafeAreaView, ScrollView, ImageBackground, Platform } from 'react-native';

const blue_buble = require('../imgs/bg50.png');

const AnnounceLayout = ({ children }) => {
  return (
    <ImageBackground source={blue_buble} style={styles.imageBackgroundStyle}>
      <SafeAreaView style={styles.safeAreaView}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.container}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageBackgroundStyle: {
    height: '100%',
  },
  safeAreaView: {
    paddingTop: 40,
    paddingBottom: 90,
  },
  container: {
    flexDirection: 'column',
    alignSelf: 'center',
    alignItems: 'center',
    width: '85%',

    ...Platform.select({
      ios: {
        paddingTop: 25,
        paddingBottom: 95,
      },
      android: {

      },
    }),
  },
});

export default AnnounceLayout;
