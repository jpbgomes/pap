import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ActivityIndicator, Platform } from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { gColors } from '../../../globalStyles';

import axios from 'axios';
import setup from '../../../setup';
import AppLayout from '../../layouts/appLayout';
import PickerOverlay from '../../components/pickerOverlay';

const Register = ({ navigation }: any) => {
  const [hasVisualProblems, setHasVisualProblems] = useState(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const toggleOverlay = () => {
    setOverlayVisible(!isOverlayVisible);
  };

  const runnerData = {
    placeholder: "Tipo de corredor",
    data: [
      { label: 'Atleta', value: 'atleta' },
      { label: 'Guia', value: 'guia' },
    ]
  };

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      setHasVisualProblems(null);
      setNome('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      setShowPassword(false);
      setShowPassword2(false);

      setErrorMessage('');
      setSuccessMessage('');
      setLoading(false);
    });

    const unsubscribeBlur = navigation.addListener('blur', () => {
      setHasVisualProblems(null);
      setNome('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      setShowPassword(false);
      setShowPassword2(false);

      setErrorMessage('');
      setSuccessMessage('');
      setLoading(false);
    });

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

  const clearInputs = () => {
    setErrorMessage('');
    setNome('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setHasVisualProblems(null);
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

  const handleRegister = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const userData = {
        nome: nome,
        email: email,
        password: password,
        confirmacao_password: confirmPassword,
        tipo_de_corredor: hasVisualProblems,
      };

      const response = await axios.post(`${setup.appUrl}/api/register`, userData, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      setErrorMessage('');
      setSuccessMessage(response.data.message);
      clearInputs();
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

  return (
    <AppLayout>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle} accessibilityLabel='Título - Registo'>Registo</Text>
        </View>

        <View style={styles.contentContainer}>
          <TextInput
            style={styles.inputText}
            placeholder='Nome'
            placeholderTextColor={gColors.gray}
            value={nome}
            onChangeText={(text) => setNome(text)}
          />
          <TextInput
            style={styles.inputText}
            placeholder='Email'
            placeholderTextColor={gColors.gray}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordText}
              placeholder='Password'
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
              placeholder='Confirmar Password'
              placeholderTextColor={gColors.gray}
              secureTextEntry={!showPassword2}
              value={confirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
            />

            <TouchableOpacity style={styles.showPasswordButton} onPress={showPasswordChange2}>
              {showPassword2 ? (
                <MaterialCommunityIcons name="eye-off" size={20} color='gray' />
              ) : (
                <MaterialCommunityIcons name="eye" size={20} color='gray' />
              )}
            </TouchableOpacity>
          </View>

          <PickerOverlay
            placeholder={runnerData.placeholder}
            dataList={runnerData.data}
            onSelect={value => setHasVisualProblems(value)}
          />

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={loading} accessibilityLabel={errorMessage ? `Erro atual - ${errorMessage}. ${loading ? "Processando o registo" : "Botão - Registar"}` : (loading ? "Processando o registo" : "Botão - Registar")}>
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.registerText} >Registar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.haveAccountButton} onPress={() => navigation.navigate('Login')} accessibilityLabel='Botão - Já tens uma conta criada'>
            <Text style={[styles.haveAccountText]}>Já tens uma conta criada?</Text>
          </TouchableOpacity>

          <Text style={{
            textAlign: 'center',
            color: successMessage ? 'green' : 'red',
            fontWeight: successMessage ? 'bold' : '500',
            fontSize: successMessage ? 15 : 14,
            paddingBottom: 15,
          }}

            accessibilityLabel={errorMessage ? 'Erro atual - ' + errorMessage : 'Mensagem de sucesso - ' + successMessage}
          >

            {errorMessage ? errorMessage : successMessage}
          </Text>
        </View>
      </View>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 15,
    justifyContent: 'space-around',
  },
  headerContainer: {
    alignItems: 'center',
    gap: 20,
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 30,
    color: gColors.blue
  },
  headerSubtitle: {
    fontWeight: 'bold',
    fontSize: 17,
    textAlign: 'center',
  },

  contentContainer: {
    marginTop: 30,
    gap: 20,
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
        paddingTop: 8,
        paddingBottom: 8,
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
        paddingTop: 8,
        paddingBottom: 8,
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

  registerButton: {
    marginTop: 20,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: gColors.blue,
    borderRadius: 12,
  },
  registerText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 17,
    color: gColors.white,
  },
  haveAccountButton: {

  },
  haveAccountText: {
    paddingTop: 10,
    paddingBottom: 10,
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 14.5,
    color: gColors.gray,
  },
});

export default Register;
