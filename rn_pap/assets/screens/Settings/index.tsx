import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput, Platform, ImageBackground, Dimensions } from 'react-native'
import { Overlay } from '@rneui/themed';

import { useDispatch, useSelector } from 'react-redux';

import { RootState, store } from '../../../assets/redux/store';
import { setUserInfo } from '../../../assets/redux/userSlice';

import axios from 'axios';
import setup from '../../../setup';

import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

import { gColors } from '../../../globalStyles';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import UserImage from '../../components/userImage';
import AppLayout from '../../layouts/appLayout';
import PickerOverlay from '../../components/pickerOverlay';

const Settings = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.user);

  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessage2, setErrorMessage2] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const toggleOverlay = () => {
    setOverlayVisible(!isOverlayVisible);
  };

  const [isOverlayVisible2, setOverlayVisible2] = useState(false);
  const toggleOverlay2 = () => {
    setOverlayVisible2(!isOverlayVisible2);
  };

  const [successMessage, setSuccessMessage] = useState('');
  const [successMessage2, setSuccessMessage2] = useState('');

  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const [errorVerifyMessage, setErrorVerifyMessage] = useState('');
  const [successVerifyMessage, setSucessVerifyMessage] = useState('');

  const [loadingPicker, setLoadingPicker] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const [name, setName] = useState(null);
  const [password, setPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);

  const [sex, setSex] = useState(null);
  const [runnerType, setRunnerType] = useState(null);
  const [district, setDistrict] = useState(null);

  const [isPublic, setProfilePublic] = useState(null);

  const sexData = {
    placeholder: "Sexo",
    data: [
      { label: 'Masculino', value: 'male' },
      { label: 'Feminino', value: 'female' },
      { label: 'Outro', value: 'other' },
    ]
  };

  const runnerTypeData = {
    placeholder: "Tipo de Corredor",
    data: [
      { label: 'Atleta', value: 'atleta' },
      { label: 'Guia', value: 'guia' },
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

  const profileSettingsData = {
    placeholder: "Privacidade do perfil",
    data: [
      { label: 'Público', value: 'true' },
      { label: 'Privado', value: 'false' },
    ]
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setErrorMessage('');
        setErrorMessage2('');
        setShowPassword(false);
        setShowPassword2(false);
        setSuccessMessage('');
        setSuccessMessage2('');

        setErrorVerifyMessage('');
        setSucessVerifyMessage('');

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

  const showPasswordChange = () => {
    setShowPassword(!showPassword);
  };

  const showPasswordChange2 = () => {
    setShowPassword2(!showPassword2);
  };

  const clearErrorAndInputs = () => {
    setErrorMessage('');
    setName('');
    setPassword('');
    setNewPassword('');
  };

  const clearErrorAndInputs2 = () => {
    setErrorMessage2('');
    setSex(null);
    setRunnerType(null);
    setDistrict(null);
    setProfilePublic(null);
  };

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

  const checkErrors2 = (response: any) => {
    handleGenericErrors(response, setErrorMessage2, setSuccessMessage2);
  };

  const handleLibraryLaunch = async (imageUpdateType: any) => {
    if (loadingPicker) return;

    try {
      setLoadingPicker(true);
      if (imageUpdateType === "profile_photo") {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [20, 20],
          quality: 1,
        });

        if (!result.canceled) {
          let imgUri = (result.assets[0].uri);
          let compressedImage = await compressImage(imgUri);

          uploadImageToServer(compressedImage.uri, imageUpdateType);
          toggleOverlay();
        }
      } else if (imageUpdateType === "profile_banner") {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [16, 9],
          quality: 1,
        });

        if (!result.canceled) {
          let imgUri = (result.assets[0].uri);
          let compressedImage = await compressImage(imgUri);

          uploadImageToServer(compressedImage.uri, imageUpdateType);
          toggleOverlay2();
        }
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

  const uploadImageToServer = async (imageFile: any, imageType: any) => {
    const token = await userData.userToken;

    try {
      const formData = new FormData();

      const imageData: ImageData = {
        uri: imageFile,
        type: 'image/jpeg',
        name: 'photo.jpg',
      };

      formData.append('image', imageData);

      const response = await axios.post(`${setup.appUrl}/api/updatePhoto?type=${imageType}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      setErrorMessage('');
      await setup.handleUser();
    } catch (error: any) {
      setErrorMessage('Erro ao alterar a imagem, tente novamente');
    }
  };

  const removeImage = async (imageUpdateType: any) => {
    const token = await userData.userToken;

    if (imageUpdateType === "profile_photo") {
      toggleOverlay();
    } else if (imageUpdateType === "profile_banner") {
      toggleOverlay2();
    }

    try {
      const removeParameters = {
        type: imageUpdateType,
        token: token,
      };

      const response = await axios.post(`${setup.appUrl}/api/removePhoto`, removeParameters, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      await setup.handleUser();
    } catch (error: any) {
      setErrorMessage('Erro ao alterar a imagem, tente novamente');
    }
  };

  const handleUpdates = async () => {
    if (loading) return;

    const token = await userData.userToken;

    try {
      setLoading(true);

      const userNewCred = {
        name: name,
        password: password,
        newPassword: newPassword,
      };

      const response = await axios.post(`${setup.appUrl}/api/updateCred`, userNewCred, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data.nameChanged !== undefined) {
        store.dispatch(setUserInfo({
          ...userData,
          Name: name,
        }));
      }

      clearErrorAndInputs();
      clearErrorAndInputs2();
      setSuccessMessage(response.data.message);

      await setup.handleUser();
    } catch (error: any) {
      if (error.response) {
        checkErrors(error.response);
      } else {
        setErrorMessage('Estamos com alguns problemas, tente novamente');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdates2 = async () => {
    if (loading2) return;

    const token = await userData.userToken;

    try {
      setLoading2(true);

      const userNewData = {
        sexo: sex,
        tipo_de_corredor: runnerType,
        distrito: district,
        privacidade_do_perfil: isPublic,
      };

      const response = await axios.post(`${setup.appUrl}/api/updateData`, userNewData, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      clearErrorAndInputs();
      clearErrorAndInputs2();
      setSuccessMessage2(response.data.message);
    } catch (error: any) {
      if (error.response) {
        checkErrors2(error.response);
      } else {
        setErrorMessage2('Estamos com alguns problemas, tente novamente');
      }
    } finally {
      setLoading2(false);
    }
  };

  const resendEmail = async () => {
    if (loadingEmail) return;

    try {
      setLoadingEmail(true);

      const userForm = {
        username: userData.user.Username,
      };

      const response = await axios.post(`${setup.appUrl}/api/verifyEmail`, userForm, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      setErrorVerifyMessage('');
      setSucessVerifyMessage(response.data.message);
    } catch (error: any) {
      setErrorVerifyMessage('Estamos com alguns problemas, tente novamente');
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleUserFunc = async () => {
    if (loadingUpdate) return;

    try {
      setLoadingUpdate(true);
      await setup.handleUser()

      setErrorVerifyMessage('');
      setSucessVerifyMessage('');
    } catch (error: any) {
      setErrorVerifyMessage('Estamos com alguns problemas, tente novamente');
    } finally {
      setLoadingUpdate(false);
    }
  };

  return (
    <>
      {userData.user.Name !== null ? (
        <>
          {
            <ImageBackground
              style={styles.bannerBackgroundImage}
              source={
                userData.user.BannerImage
                  ? (userData.user.BannerImage.startsWith('http')
                    ? { uri: userData.user.BannerImage }
                    : { uri: setup.appUrl + "/" + userData.user.BannerImage })
                  : { uri: 'https://i.imgur.com/72oTVEt.jpg' }
              }
            >
              <TouchableOpacity style={styles.bannerButtonContainer} onPress={toggleOverlay2} accessibilityLabel={`Imagem do teu Banner. Clica duas vezes para a alterares`}>
              </TouchableOpacity>

              <View style={styles.bannerIconContainer}>
                <MaterialCommunityIcons style={styles.cameraIconForBanner} name="camera" size={20} color={gColors.blue} />
              </View>
            </ImageBackground>
          }

          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={toggleOverlay} style={styles.imageButton} activeOpacity={0.9} accessibilityLabel={`Imagem do teu Perfil. Clica duas vezes para a alterares`}>
              <UserImage imageSize={125} imageSource={null} />
            </TouchableOpacity>

            <Text style={styles.nameText} accessibilityLabel={`O teu nome, ${userData.user.Name}`}>{userData.user.Name}</Text>
            <Text style={styles.usernameText} accessibilityLabel={`O teu username, ${userData.user.Username}`}>@{userData.user.Username}</Text>
          </View >

          <AppLayout>
            <View style={styles.verifyHeaderContainer}>
              {userData.user.IsVerified ? (
                <>
                  <View style={styles.isVerifiedContainer} accessibilityLabel='Mensagem - Tens o email verificado'>
                    <MaterialCommunityIcons name="check-decagram" size={20} color={gColors.blue} />
                    <Text style={styles.verifiedText}>Email <Text style={styles.verifiedStateText}>Verificado</Text></Text>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.isVerifiedContainer} accessibilityLabel='Mensagem - Não tens o email verificado, usa os botões abaixo para o fazeres.'>
                    <MaterialCommunityIcons name="check-decagram-outline" size={20} color={gColors.red} />
                    <Text style={styles.verifiedText}>Email <Text style={styles.verifiedStateText}>Não Verificado</Text></Text>
                  </View>

                  <View style={styles.isVerifiedButtonsContainer}>
                    <TouchableOpacity style={styles.updateButton} onPress={resendEmail} disabled={loadingEmail} accessibilityLabel={errorVerifyMessage ? `Erro atual - ${errorVerifyMessage}. ${loadingEmail ? "Processando o re-envio do email de verificação" : "Botão - Re-Enviar Email"}` : (loadingEmail ? "Processando o re-envio do email de verificação" : "Botão - Re-Enviar Email")}>
                      {loadingEmail ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                      ) : (
                        <Text style={styles.updateText}>Re-Enviar Email</Text>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.updateButton} onPress={handleUserFunc} disabled={loadingUpdate} accessibilityLabel={errorVerifyMessage ? `Erro atual - ${errorVerifyMessage}. ${loadingUpdate ? "Processando o re-envio do email de verificação" : "Botão - Re-Enviar Email"}` : (loadingUpdate ? "Processando o re-envio do email de verificação" : "Botão - Re-Enviar Email")}>
                      {loadingUpdate ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                      ) : (
                        <Text style={styles.updateText}>Atualizar Tela</Text>
                      )}
                    </TouchableOpacity>
                  </View>

                  <Text style={{
                    textAlign: 'center',
                    color: successVerifyMessage ? 'green' : 'red',
                    fontWeight: successVerifyMessage ? 'bold' : '500',
                    fontSize: successVerifyMessage ? 15 : 14,
                  }}

                    accessibilityLabel={errorVerifyMessage ? 'Erro atual - ' + errorVerifyMessage : 'Mensagem de sucesso - ' + successVerifyMessage}
                  >

                    {errorVerifyMessage ? errorVerifyMessage : successVerifyMessage}
                  </Text>
                </>
              )}
            </View>

            <Overlay isVisible={isOverlayVisible2} onBackdropPress={toggleOverlay2} overlayStyle={styles.overlayContainer} accessibilityLabel='Cartão de Overlay Para Alterar a Imagem do Banner - Clica duas vezes para fechar'>
              <Text style={styles.overlayTitle} accessibilityLabel='Título das Opções - Alterar Imagem de Banner'>Alterar Banner</Text>

              <View style={styles.overlayButtonsContainer}>
                <TouchableOpacity style={styles.overlayButton} onPress={() => handleLibraryLaunch('profile_banner')} disabled={loadingPicker} accessibilityLabel='Botão - Galeria de Imagens'>
                  <Text style={styles.overlayText}>Galeria</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.overlayButton} onPress={() => removeImage('profile_banner')} accessibilityLabel='Botão - Remover Imagem Atual'>
                  <Text style={styles.overlayText}>Remover Atual</Text>
                </TouchableOpacity>
              </View>
            </Overlay>

            <Overlay isVisible={isOverlayVisible} onBackdropPress={toggleOverlay} overlayStyle={styles.overlayContainer} accessibilityLabel='Cartão de Overlay Para Alterar a Imagem do Banner - Clica duas vezes para fechar'>
              <Text style={styles.overlayTitle} accessibilityLabel='Título das Opções - Alterar Imagem de Perfil'>Alterar Imagem de Perfil</Text>

              <View style={styles.overlayButtonsContainer}>
                <TouchableOpacity style={styles.overlayButton} onPress={() => handleLibraryLaunch('profile_photo')} disabled={loadingPicker} accessibilityLabel='Botão - Galeria de Imagens'>
                  <Text style={styles.overlayText}>Galeria</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.overlayButton} onPress={() => removeImage('profile_photo')} accessibilityLabel='Botão - Remover Imagem Atual'>
                  <Text style={styles.overlayText}>Remover Atual</Text>
                </TouchableOpacity>
              </View>
            </Overlay>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputText}
                placeholder='Nome Novo'
                placeholderTextColor={gColors.gray}
                value={name}
                onChangeText={(text) => setName(text)}
              />
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordText}
                  placeholder='Password Atual'
                  placeholderTextColor={gColors.gray}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                />

                <TouchableOpacity style={styles.showPasswordButton} onPress={showPasswordChange}>
                  {showPassword ? (
                    <MaterialCommunityIcons name="eye-off" size={20} color='gray' />
                  ) : (
                    <MaterialCommunityIcons name="eye" size={20} color='gray' />
                  )}
                </TouchableOpacity>
              </View>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordText}
                  placeholder='Nova Password'
                  placeholderTextColor={gColors.gray}
                  secureTextEntry={!showPassword2}
                  value={newPassword}
                  onChangeText={(text) => setNewPassword(text)}
                />

                <TouchableOpacity style={styles.showPasswordButton} onPress={showPasswordChange2}>
                  {showPassword2 ? (
                    <MaterialCommunityIcons name="eye-off" size={20} color='gray' />
                  ) : (
                    <MaterialCommunityIcons name="eye" size={20} color='gray' />
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.updateButton} onPress={handleUpdates} disabled={loading} accessibilityLabel={errorMessage ? `Erro atual - ${errorMessage}. ${loading ? "Processando a atualização das credenciais" : "Botão - Atualizar Credenciais"}` : (loading ? "Processando a atualização das credenciais" : "Botão - Atualizar Credenciais")}>
                {loading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.updateText} >Atualizar Credenciais</Text>
                )}
              </TouchableOpacity>

              <Text style={{
                textAlign: 'center',
                color: successMessage ? 'green' : 'red',
                fontWeight: successMessage ? 'bold' : '500',
                fontSize: successMessage ? 15 : 14,
                marginTop: 5,
              }}

                accessibilityLabel={errorMessage ? 'Erro atual - ' + errorMessage : 'Mensagem de sucesso - ' + successMessage}
              >

                {errorMessage ? errorMessage : successMessage}
              </Text>
            </View>

            <View style={styles.inputContainer2}>
              <PickerOverlay
                placeholder={sexData.placeholder}
                dataList={sexData.data}
                onSelect={value => setSex(value)}
              />

              <PickerOverlay
                placeholder={runnerTypeData.placeholder}
                dataList={runnerTypeData.data}
                onSelect={value => setRunnerType(value)}
              />

              <PickerOverlay
                placeholder={districtData.placeholder}
                dataList={districtData.data}
                onSelect={value => setDistrict(value)}
              />

              <PickerOverlay
                placeholder={profileSettingsData.placeholder}
                dataList={profileSettingsData.data}
                onSelect={value => setProfilePublic(value)}
              />

              <TouchableOpacity style={styles.updateButton} onPress={handleUpdates2} disabled={loading2} accessibilityLabel={errorMessage2 ? `Erro atual - ${errorMessage2}. ${loading2 ? "Processando a atualização dos dados" : "Botão - Atualizar Dados"}` : (loadingEmail ? "Processando a atualização dos dados" : "Botão - Atualizar Dados")}>
                {loading2 ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.updateText}>Atualizar Dados</Text>
                )}
              </TouchableOpacity>

              <Text style={{
                textAlign: 'center',
                color: successMessage2 ? 'green' : 'red',
                fontWeight: successMessage2 ? 'bold' : '500',
                fontSize: successMessage2 ? 15 : 14,
                marginTop: 0,
                paddingBottom: 45,
              }}

                accessibilityLabel={errorMessage ? 'Erro atual - ' + errorMessage : 'Mensagem de sucesso - ' + successMessage}
              >

                {errorMessage2 ? errorMessage2 : successMessage2}
              </Text>
            </View>
          </AppLayout>
        </>
      ) : (
        <View style={styles.errorContainer} accessibilityLabel={`Aviso - Erro de Verificação. Precisas de permissões para poderes criar uma corrida. Retorna à página inicial usando o botão abaixo.`}>
          <Text style={styles.errorMessage}>ERRO DE LOGIN</Text>
          <Text style={styles.errorDescription}>NÃO TENS <Text style={styles.boldText}>SESSÃO INICIADA</Text></Text>

          <TouchableOpacity accessible accessibilityLabel="Botão - Página Inicial" style={styles.goBackButton} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.goBackText}>Página Inicial</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  bannerBackgroundImage: {
    width: '100%',
    height: 150,
  },
  bannerButtonContainer: {
    height: '100%',
  },
  bannerIconContainer: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    padding: 5,
    borderRadius: 100,
    backgroundColor: gColors.white,
  },
  cameraIconForBanner: {

  },
  mainText: {
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 30,
    color: gColors.blue,
  },

  headerContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageButton: {
    marginBottom: 10,
    alignSelf: 'center',
    marginTop: -70,
    borderRadius: 100,
    borderWidth: 5,
    borderColor: gColors.white,
  },
  nameText: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    color: gColors.dark,
  },
  usernameText: {
    fontSize: 18,
    fontWeight: '400',
    color: gColors.gray,
  },

  verifyHeaderContainer: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  isVerifiedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingTop: 5,
    paddingBottom: 5,
  },
  isVerifiedButtonsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  verifiedText: {
    fontSize: 16,
  },
  verifiedStateText: {

  },

  overlayContainer: {
    padding: 20,
    borderRadius: 15,
    width: '85%',
  },
  overlayTitle: {
    fontWeight: 'bold',
    fontSize: 25,
    textAlign: 'center',
    color: gColors.blue
  },
  overlayButtonsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 25,
    alignItems: 'center'
  },
  overlayButton: {
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: gColors.blue,
    borderRadius: 12,
    flex: 1,
  },
  overlayText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 17,
    color: gColors.white,
  },

  inputContainer: {
    width: '100%',
    gap: 15,
    marginTop: 40,
    marginBottom: 40,
  },
  inputContainer2: {
    width: '100%',
    gap: 15,
    paddingBottom: 250,
  },
  inputText: {
    paddingLeft: 18,
    paddingRight: 20,

    ...Platform.select({
      ios: {
        paddingTop: 15,
        paddingBottom: 15,
      },
      android: {
        paddingTop: 12,
        paddingBottom: 12,
      },
    }),

    borderRadius: 10,

    fontSize: 16,

    backgroundColor: gColors.lightblue
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    borderRadius: 10,

    backgroundColor: gColors.lightblue,
  },
  passwordText: {
    fontSize: 16,

    paddingLeft: 18,
    paddingRight: 18,

    ...Platform.select({
      ios: {
        paddingTop: 15,
        paddingBottom: 15,
      },
      android: {
        paddingTop: 12,
        paddingBottom: 12,
      },
    }),

    flex: 1,
  },
  showPasswordButton: {
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },
  pickerContainer: {
    marginTop: 15,
    borderRadius: 10,
    backgroundColor: gColors.lightblue,

    fontSize: 16,

    ...Platform.select({
      ios: {
        paddingTop: 15,
        paddingBottom: 15,

        paddingLeft: 18,
        paddingRight: 18,
      },
      android: {
        paddingLeft: 2,
      },
    }),
  },

  updateButton: {
    marginTop: 20,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: gColors.blue,
    borderRadius: 12,
    flex: 1,
  },
  updateText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    color: gColors.white,
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

export default Settings;
