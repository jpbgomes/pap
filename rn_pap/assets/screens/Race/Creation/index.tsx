import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Platform, ActivityIndicator } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { RootState, store } from '../../../../assets/redux/store';

import { gColors } from '../../../../globalStyles';
import AppLayout from '../../../layouts/appLayout';

import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import PickerOverlay from '../../../components/pickerOverlay';

import axios from 'axios';
import setup from '../../../../setup';

const Creation = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.user);

  const [loading, setLoading] = useState(false);
  const [loadingPicker, setLoadingPicker] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [raceImage, setRaceImage] = useState(null);
  const [district, setDistrict] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState(null);

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const [accessibility, setAccessibility] = useState('');
  const [condition, setCondition] = useState(null);

  const clearErrorAndInputs = () => {
    setErrorMessage('');
    setTitle('');
    setDescription('');
    setRaceImage(null);
    setDistrict('');
    setDay('');
    setMonth('');
    setStartTime('');
    setEndTime('');
    setAccessibility(null);
    setCondition(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        clearErrorAndInputs();

        await setup.handleUser();
      } catch (error) {
        console.error("Error handling user:", error);
      }
    };

    const unsubscribeFocus = navigation.addListener('focus', fetchData);
    const unsubscribeBlur = navigation.addListener('blur', fetchData);

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  const handleGenericErrors = (response: any, setError: any, setSuccess: any) => {
    if (response && response.data && response.data.errors) {
      const errors = response.data.errors;
      const errorKeys = Object.keys(errors);

      if (errorKeys.length > 0) {
        setSuccess('');
        setError(errors[errorKeys[0]]);
      }
    }
  };

  const checkErrors = (response: any) => {
    handleGenericErrors(response, setErrorMessage, setSuccessMessage);
  };

  const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  const daysData = {
    placeholder: "Dia",
    data: (() => {
      if (month === '02') {
        return isLeapYear(currentYear)
          ? Array.from({ length: 29 }, (_, i) => ({
            label: `${(i + 1).toString().padStart(2, '0')}`,
            value: `${(i + 1).toString().padStart(2, '0')}`
          }))
          : Array.from({ length: 28 }, (_, i) => ({
            label: `${(i + 1).toString().padStart(2, '0')}`,
            value: `${(i + 1).toString().padStart(2, '0')}`
          }));
      } else if (month === '04' || month === '06' || month === '09' || month === '11') {
        return Array.from({ length: 30 }, (_, i) => ({
          label: `${(i + 1).toString().padStart(2, '0')}`,
          value: `${(i + 1).toString().padStart(2, '0')}`
        }));
      } else {
        return Array.from({ length: 31 }, (_, i) => ({
          label: `${(i + 1).toString().padStart(2, '0')}`,
          value: `${(i + 1).toString().padStart(2, '0')}`
        }));
      }
    })()
  };

  const monthData = {
    placeholder: "Mês",
    data: [
      { label: 'Janeiro', value: '01' },
      { label: 'Fevereiro', value: '02' },
      { label: 'Março', value: '03' },
      { label: 'Abril', value: '04' },
      { label: 'Maio', value: '05' },
      { label: 'Junho', value: '06' },
      { label: 'Julho', value: '07' },
      { label: 'Agosto', value: '08' },
      { label: 'Setembro', value: '09' },
      { label: 'Outubro', value: '10' },
      { label: 'Novembro', value: '11' },
      { label: 'Dezembro', value: '12' },
    ]
  };

  const districtData = {
    placeholder: "Distrito",
    data: [
      { label: 'Aveiro', value: 'aveiro' },
      { label: 'Beja', value: 'beja' },
      { label: 'Braga', value: 'braga' },
      { label: 'Bragança', value: 'bragança' },
      { label: 'Castelo Branco', value: 'castelo_branco' },
      { label: 'Coimbra', value: 'coimbra' },
      { label: 'Évora', value: 'evora' },
      { label: 'Faro', value: 'faro' },
      { label: 'Guarda', value: 'guarda' },
      { label: 'Leiria', value: 'leiria' },
      { label: 'Lisboa', value: 'lisboa' },
      { label: 'Portalegre', value: 'portalegre' },
      { label: 'Porto', value: 'porto' },
      { label: 'Santarém', value: 'santarem' },
      { label: 'Setúbal', value: 'setubal' },
      { label: 'Viana do Castelo', value: 'viana_do_castelo' },
      { label: 'Vila Real', value: 'vila_real' },
      { label: 'Viseu', value: 'viseu' },
    ]
  };

  const timesData = {
    placeholder: "Horário",
    data: Array.from({ length: 48 }, (_, i) => {
      const hour = Math.floor(i / 2);
      const minute = i % 2 === 0 ? '00' : '30';
      const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
      return { label: `${formattedHour}:${minute}`, value: `${formattedHour}:${minute}` };
    })
  };

  const accessibilityData = {
    placeholder: "Acessibilidade",
    data: [
      { label: 'Ativada', value: 'true' },
      { label: 'Desativada', value: 'false' },
    ]
  };

  const conditionData = {
    placeholder: "Condição",
    data: [
      { label: 'Iniciante', value: 'beginner' },
      { label: 'Experiente', value: 'experienced' },
      { label: 'Avançado', value: 'advanced' },
    ]
  };

  const addImage = async (imageUpdateType: any) => {
    if (loadingPicker) return;

    try {
      setLoadingPicker(true);

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [20, 20],
        quality: 1,
      });

      if (!result.canceled) {
        let imgUri = (result.assets[0].uri);
        setRaceImage(result.assets[0].uri);
      }
    } catch (error: any) {

    } finally {
      setLoadingPicker(false);
    }
  };

  const compressImage = async (uri, format = SaveFormat.JPEG) => {
    const result = await manipulateAsync(
      uri,
      [{ resize: { width: 1200 } }],
      { compress: 0.7, format }
    );

    return result;
  };

  interface ImageData {
    uri: string;
    type: string;
    name: string;
  }

  const handleRaceCreation = async () => {
    if (loading) return;

    const token = userData.userToken;

    try {
      setLoading(true);
      let fDate = null

      if (month !== null && day !== null) {
        fDate = currentYear + '-' + month + '-' + day;
      }

      const raceNewData = new FormData();
      raceNewData.append('titulo', title);
      raceNewData.append('edicao', currentYear.toString());
      raceNewData.append('descricao', description);
      raceNewData.append('distrito', district);
      raceNewData.append('data', fDate);
      raceNewData.append('hora_partida', startTime + ":00");
      raceNewData.append('hora_chegada', endTime + ":00");
      raceNewData.append('tem_acessibilidade', accessibility);
      raceNewData.append('condicao_minima', condition);

      if (raceImage) {
        let compressedImage = await compressImage(raceImage);

        raceNewData.append('image', {
          uri: compressedImage.uri,
          type: 'image/jpeg',
          name: 'photo.jpg',
        });
      }

      const response = await axios.post(`${setup.appUrl}/api/createRace`, raceNewData, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      clearErrorAndInputs();
      setSuccessMessage(response.data.message);
    } catch (error: any) {
      if (error.response) {
        checkErrors(error.response);
      } else {
        setErrorMessage('Estamos com alguns problemas, tente novamente');
      }
    } finally {
      setLoading(false);
    }
  }

  const removeImage = () => {
    setRaceImage(null);
  };

  return (
    <>
      {userData.user.Name !== null ? (
        <>
          {userData.user.IsVerified !== null && userData.user.IsVerified !== false ? (
            <AppLayout>
              <Text style={styles.titleText} accessibilityLabel='Título - Criação de Corridas'>Criação de Corridas</Text>

              <View style={styles.mainInputContainer}>
                <TextInput
                  style={styles.raceTitlte}
                  placeholder='Título'
                  placeholderTextColor={gColors.gray}
                  value={title}
                  onChangeText={(text) => setTitle(text)}
                  multiline={true}
                />

                <TextInput
                  style={styles.raceDescription}
                  placeholder='Descrição'
                  placeholderTextColor={gColors.gray}
                  value={description}
                  onChangeText={(text) => setDescription(text)}
                  multiline={true}
                />

                <View style={styles.submainInputContainer}>
                  <PickerOverlay
                    placeholder={districtData.placeholder}
                    dataList={districtData.data}
                    onSelect={value => setDistrict(value)}
                  />
                </View>

                <View style={styles.raceImageContainer}>
                  {raceImage === null ? (
                    <>
                      <TouchableOpacity onPress={addImage} style={styles.raceAddImageButton} disabled={loadingPicker} accessibilityLabel='Botão - Adicionar Imagem à Corrida'>
                        <Text style={styles.raceStatusText}>Adicionar Imagem</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <Image source={{ uri: raceImage }} style={styles.raceImage} accessibilityLabel='Imagem da Corrida' />

                      <TouchableOpacity onPress={removeImage} style={styles.raceRemoveImageButton} accessibilityLabel='Botão - Remover Imagem Atual da Corrida'>
                        <Text style={styles.raceStatusText}>Remover Imagem</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>

              <View style={styles.secInputContainer}>
                <Text style={styles.titleSubtext} accessibilityLabel='Título da Secção - Data da Corrida'>Data</Text>

                <View style={styles.inputContainerChild}>
                  {month !== null && month !== '' ? (
                    <View style={styles.pickerContainer}>
                      <PickerOverlay
                        placeholder={daysData.placeholder}
                        dataList={daysData.data}
                        onSelect={value => setDay(value)}
                      />
                    </View>
                  ) : null}

                  <View style={styles.pickerContainer}>
                    <PickerOverlay
                      placeholder={monthData.placeholder}
                      dataList={monthData.data}
                      onSelect={value => setMonth(value)}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.thirdInputContainer}>
                <Text style={styles.titleSubtext} accessibilityLabel='Título da Secção - Horário da Corrida'>Horário</Text>

                <View style={styles.inputContainerChild}>
                  <View style={styles.pickerContainer}>
                    <PickerOverlay
                      placeholder={'Hora de Partida'}
                      dataList={timesData.data}
                      onSelect={value => setStartTime(value)}
                    />
                  </View>

                  <View style={styles.pickerContainer}>
                    <PickerOverlay
                      placeholder={'Hora de Chegada'}
                      dataList={timesData.data}
                      onSelect={value => setEndTime(value)}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.fourthInputContainer}>
                <Text style={styles.titleSubtext} accessibilityLabel='Título da Secção - Requisitos Adicionais da Corrida'>Requisitos Adicionais</Text>

                <View style={styles.inputContainerChild}>
                  <View style={styles.pickerContainer}>
                    <PickerOverlay
                      placeholder={conditionData.placeholder}
                      dataList={conditionData.data}
                      onSelect={value => setCondition(value)}
                    />
                  </View>

                  <View style={styles.pickerContainer}>
                    <PickerOverlay
                      placeholder={accessibilityData.placeholder}
                      dataList={accessibilityData.data}
                      onSelect={value => setAccessibility(value)}
                    />
                  </View>
                </View>
              </View>

              <TouchableOpacity style={styles.createButton} onPress={handleRaceCreation} disabled={loading} accessibilityLabel={errorMessage ? `Erro atual - ${errorMessage}. ${loading ? "Processando a criação da corrida" : "Botão - Criar Corrida"}` : (loading ? "Processando a criação da corrida" : "Botão - Criar Corrida")}>
                {loading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.createText}>Criar Corrida</Text>
                )}
              </TouchableOpacity>

              <Text style={{
                textAlign: 'center',
                color: successMessage ? 'green' : 'red',
                fontWeight: successMessage ? 'bold' : '500',
                fontSize: successMessage ? 15 : 14,
                marginTop: 15,
                paddingBottom: 15,
              }}

                accessibilityLabel={errorMessage ? 'Erro atual - ' + errorMessage : 'Mensagem de sucesso - ' + successMessage}
              >
                {errorMessage ? errorMessage : successMessage}
              </Text>
            </AppLayout>
          ) : (
            <View style={styles.errorContainer} accessibilityLabel={`Aviso - Erro de Verificação. Precisas de verificar o teu email para conseguires criar corridas, faz isso nas definições pelo botão abaixo.`}>
              <Text style={styles.errorMessage}>ERRO DE VERIFICAÇÃO</Text>
              <Text style={styles.errorDescription}>PRECISAS DE <Text style={styles.boldText}>VERIFICAR O TEU EMAIL</Text> PARA CONSEGUIRES <Text style={styles.boldText}>CRIAR CORRIDAS</Text></Text>

              <TouchableOpacity accessible accessibilityLabel="Botão - Definiçĩes" style={styles.goBackButton} onPress={() => navigation.navigate('Settings')}>
                <Text style={styles.goBackText}>Definiçĩes</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      ) : (
        <View style={styles.errorContainer} accessibilityLabel={`Aviso - Erro de Verificação. Precisas de permissões para poderes criar uma corrida. Retorna à página inicial usando o botão abaixo.`}>
          <Text style={styles.errorMessage}>ERRO DE PERMISSÕES</Text>
          <Text style={styles.errorDescription}>NÃO TENS PERMISSÕES PARA <Text style={styles.boldText}>CRIARES CORRIDAS</Text></Text>

          <TouchableOpacity accessible accessibilityLabel="Botão - Página Inicial" style={styles.goBackButton} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.goBackText}>Página Inicial</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  titleText: {
    fontWeight: 'bold',
    fontSize: 30,
    color: gColors.blue,
    textAlign: 'center',
    marginBottom: 25,
  },

  titleSubtext: {
    paddingLeft: 18,
    fontWeight: 'bold',
    fontSize: 20,
    color: gColors.blue,
  },

  mainInputContainer: {
    marginBottom: 50,
    gap: 10,
  },
  inputContainerChild: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    paddingTop: 10,
  },
  raceTitlte: {
    paddingLeft: 18,
    paddingRight: 20,

    ...Platform.select({
      ios: {
        paddingTop: 15,
        paddingBottom: 15,
      },
      android: {
        paddingTop: 8,
        paddingBottom: 8,
      },
    }),

    borderRadius: 10,
    fontSize: 16,
    backgroundColor: gColors.lightblue,

    maxHeight: 60,
  },

  raceDescription: {
    paddingLeft: 18,
    paddingRight: 20,

    ...Platform.select({
      ios: {
        paddingTop: 15,
        paddingBottom: 15,
      },
      android: {
        paddingTop: 8,
        paddingBottom: 8,
      },
    }),


    borderRadius: 10,
    fontSize: 16,
    backgroundColor: gColors.lightblue,

    maxHeight: 120,
  },
  raceImageContainer: {
    marginTop: 25,
  },
  raceImage: {
    width: '100%',
    minWidth: 250,
    height: 260,
    objectFit: 'cover',
    borderRadius: 18,
    marginTop: 20,
  },
  raceAddImageButton: {
    marginTop: 15,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: gColors.blue,
    borderRadius: 12,
    width: '100%',
  },
  raceRemoveImageButton: {
    marginTop: 15,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: gColors.red,
    borderRadius: 12,
    width: '100%',
  },
  raceStatusText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 17,
    color: gColors.white,
    alignItems: 'center',
  },

  submainInputContainer: {

  },
  raceDistrict: {

  },

  secInputContainer: {
    marginBottom: 50,
  },
  pickerContainer: {
    flex: 1,
  },
  raceDay: {

  },
  raceMonth: {

  },
  raceYear: {

  },

  thirdInputContainer: {
    marginBottom: 50,
  },
  raceStartTime: {

  },
  raceEndTime: {

  },

  fourthInputContainer: {
    marginBottom: 50,
  },
  raceCondition: {

  },
  raceAccessibility: {

  },

  createButton: {
    marginTop: 25,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: gColors.blue,
    borderRadius: 12,
    width: '100%',
  },
  createText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 17,
    color: gColors.white,
    alignItems: 'center',
  },

  errorContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '95%',
  },
  errorMessage: {
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    color: gColors.blue
  },
  errorDescription: {
    alignSelf: 'baseline',
    marginTop: 10,
    fontSize: 16,
    color: gColors.gray,
    textAlign: 'center',
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
    lineHeight: 25,
  },

  boldText: {
    fontWeight: '700',
  },

  goBackButton: {
    marginTop: 15,
    height: 50,
    width: 225,
    borderRadius: 8,
    backgroundColor: gColors.blue,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },

  goBackText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
});

export default Creation;
