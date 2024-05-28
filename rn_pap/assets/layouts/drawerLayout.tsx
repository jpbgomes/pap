// DrawerLayout.js

import React from 'react';
import { StyleSheet, SafeAreaView, ScrollView, Platform } from 'react-native';
import { gColors } from '../../globalStyles';

const DrawerLayout = ({ children }) => {
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.container}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    paddingTop: 20,
    paddingBottom: 70,
  },
  container: {
    flexDirection: 'column',
    alignSelf: 'center',
    width: '85%',

    ...Platform.select({
      ios: {
        paddingTop: 25,
        paddingBottom: 45,
      },
    }),
  },
});

export default DrawerLayout;
