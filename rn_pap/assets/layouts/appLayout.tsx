// AppLayout.js

import React from 'react';
import { StyleSheet, SafeAreaView, ScrollView, Platform } from 'react-native';
import { gColors } from '../../globalStyles';

const AppLayout = ({ children }) => {
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
    paddingTop: 40,
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
      android: {
        // paddingBottom: 45,
      },
    }),
  },
});

export default AppLayout;
