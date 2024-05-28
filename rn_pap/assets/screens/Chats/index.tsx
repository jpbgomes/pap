import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { gColors } from '../../../globalStyles';

const Chats = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>CHAT DE GRUPOS EM DESENVOLVIMENTO</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 21,
    fontWeight: '700',
    textAlign: 'center',
    color: gColors.blue,
  },
});

export default Chats;
