import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ActivityIndicator, Platform } from 'react-native';

import { store } from '../../../assets/redux/store';
import { setUserToken } from '../../../assets/redux/userSlice';

import AppLayout from '../../layouts/appLayout';

import { MaterialCommunityIcons } from '@expo/vector-icons';;
import { gColors } from '../../../globalStyles';

import axios from 'axios';
import setup from '../../../setup';

const Login = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      setEmail('');
      setPassword('');
      setShowPassword(false);
      setErrorMessage('');
      setSuccessMessage('');
      setLoading(false);
    });

    const unsubscribeBlur = navigation.addListener('blur', () => {
      setEmail('');
      setPassword('');
      setShowPassword(false);
      setErrorMessage('');
      setSuccessMessage('');
      setLoading(false);
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  const fetchClientData = async () => {
    await setup.handleUser();
    await setup.handleAbilities();
    await setup.handleToken();
  };

  const clearErrorAndInputs = () => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    setEmail('');
    setPassword('');
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

  const showPasswordChange = () => {
    setShowPassword(!showPassword);
  };

  const navigateToLogin = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const userData = {
        email: email,
        password: password,
      };

      const response = await axios.post(`${setup.appUrl}/api/login`, userData, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const token = response.data.token;
      store.dispatch(setUserToken(token));

      clearErrorAndInputs();
      fetchClientData();
      navigation.navigate('Home');
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
          <Text style={styles.headerTitle} accessibilityLabel='Título - Página de Login'>Login</Text>
          <Text style={styles.headerSubtitle} accessibilityLabel='Subtítulo - Bem-vindo de volta, tens andado desaparecido!'>Bem-vindo de volta, tens andado desaparecido!</Text>
        </View>

        <View style={styles.contentContainer}>
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

            <TouchableOpacity style={styles.showPasswordButton} onPress={showPasswordChange} accessibilityLabel='Botão - Mostrar Password'>
              {showPassword ? (
                <MaterialCommunityIcons name="eye-off" size={20} color='gray' />
              ) : (
                <MaterialCommunityIcons name="eye" size={20} color='gray' />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotPasswordButton} onPress={() => navigation.navigate('ForgotPassword')} accessibilityLabel='Botão - Esqueceu-se da password?'>
            <Text style={styles.forgorPasswordText}>Esqueceu-se da password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={navigateToLogin} disabled={loading} accessibilityLabel={errorMessage ? `Erro atual - ${errorMessage}. ${loading ? "Processando o início de sessão" : "Botão - Iniciar Sessão"}` : (loading ? "Processando o início de sessão" : "Botão - Iniciar Sessão")}>
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.loginText}>Iniciar Sessão</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.createAccountButton} onPress={() => navigation.navigate('Register')} accessibilityLabel='Botão - Criar uma nova conta'>
            <Text style={[styles.createAccountText]}>Criar uma nova conta</Text>
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
    fontSize: 18,
    textAlign: 'center',
  },

  contentContainer: {
    marginTop: 50,
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
  forgotPasswordButton: {

  },
  forgorPasswordText: {
    paddingTop: 10,
    paddingBottom: 10,
    alignSelf: 'flex-end',
    fontWeight: 'bold',
    fontSize: 14.5,
    color: gColors.blue,
  },
  loginButton: {
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: gColors.blue,
    borderRadius: 12,
  },
  loginText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 17,
    color: gColors.white,
  },
  createAccountButton: {

  },
  createAccountText: {
    paddingTop: 10,
    paddingBottom: 10,
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 14.5,
    color: gColors.gray,
  },
});

export default Login;
