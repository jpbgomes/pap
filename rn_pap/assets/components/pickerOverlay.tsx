import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Overlay } from '@rneui/themed';
import { gColors } from '../../globalStyles';

import { MaterialCommunityIcons } from '@expo/vector-icons';

const PickerOverlay = ({ placeholder, dataList, onSelect }) => {
  const navigation = useNavigation();

  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [tempValue, setTempValue] = useState(null);
  const [tempLabel, setTempLabel] = useState(null);

  const toggleOverlay = () => {
    setIsOverlayVisible(!isOverlayVisible);
  };

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      setTempValue(null);
      setTempLabel(null);
    });

    const unsubscribeBlur = navigation.addListener('blur', () => {
      setTempValue(null);
      setTempLabel(null);
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  return (
    <>
      <TouchableOpacity onPress={toggleOverlay} style={styles.pickerButton} accessibilityLabel={`Botão de Opções - ${tempValue ? tempLabel : placeholder}`}>
        <Text style={[styles.pickerText, !tempValue && styles.placeholderText]}>
          {tempValue ? tempLabel : placeholder}
        </Text>
      </TouchableOpacity>

      <Overlay isVisible={isOverlayVisible} onBackdropPress={toggleOverlay} overlayStyle={styles.overlayContainer}>
        <ScrollView
          contentContainerStyle={styles.racesScrollContainer}
        >
          <Text style={styles.overlayTitle} accessibilityLabel={`Número de opções ${dataList.length} ,  - ${placeholder}`}>{placeholder}</Text>

          <View style={styles.overlayButtonsContainer}>
            {dataList.map((item, index) => (
              <TouchableOpacity key={index} style={styles.overlayButton} onPress={() => {
                setTempValue(item.value);
                setTempLabel(item.label);
                onSelect(item.value);
                toggleOverlay();
              }}
                accessibilityLabel={`Opção - ${item.label}`}
              >
                <View style={styles.overlayTextContainer}>
                  {item.value === tempValue && (
                    <View style={styles.iconContainer}>
                      <MaterialCommunityIcons name="check-circle" size={15} color={gColors.white} />
                    </View>
                  )}

                  <Text style={styles.overlayText}>{item.label}</Text>
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.overlayButtonRemove} onPress={() => {
              setTempValue(null);
              toggleOverlay();
            }}
              accessibilityLabel={`Botão - Remover opção atual`}
            >
              <Text style={styles.overlayText}>Remover Atual</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Overlay>
    </>
  );
};

const styles = StyleSheet.create({
  racesScrollContainer: {
    flexGrow: 1,
  },

  pickerButton: {
    paddingLeft: 18,
    paddingRight: 20,

    ...Platform.select({
      ios: {
        paddingTop: 15,
        paddingBottom: 15,
      },
      android: {
        paddingTop: 10,
        paddingBottom: 10,
      },
    }),

    borderRadius: 10,
    backgroundColor: gColors.lightblue
  },
  pickerText: {
    fontSize: 16,
  },
  placeholderText: {
    color: gColors.gray,
  },

  overlayContainer: {
    padding: 20,
    borderRadius: 15,
    width: '85%',
    maxHeight: '70%',
  },
  overlayTitle: {
    fontWeight: 'bold',
    fontSize: 25,
    textAlign: 'center',
    color: gColors.blue
  },
  overlayButtonsContainer: {
    flexDirection: 'column',
    gap: 15,
    marginTop: 25,
    alignItems: 'center'
  },
  overlayButton: {
    marginLeft: 15,
    marginRight: 15,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: gColors.blue,
    borderRadius: 12,
    width: '100%',
  },
  overlayButtonRemove: {
    marginTop: 15,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: gColors.red,
    borderRadius: 12,
    width: '100%',
  },

  overlayTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  overlayText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 17,
    color: gColors.white,
    alignItems: 'center',
  },
  iconContainer: {

  },
});

export default PickerOverlay;
