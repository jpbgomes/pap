import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ActivityIndicator, Platform } from 'react-native';
import { gColors } from '../../../globalStyles';


import { useDispatch, useSelector } from 'react-redux';

import { RootState, store } from '../../../assets/redux/store';
import { setUserInfo } from '../../../assets/redux/userSlice';

import axios from 'axios';
import setup from '../../../setup';

import AnnounceLayout from '../../layouts/announceLayout';

const ForgotPassword = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.user);

  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      setEmail('');
      setErrorMessage('');
      setSuccessMessage('');
      setLoading(false);
    });

    const unsubscribeBlur = navigation.addListener('blur', () => {
      setEmail('');
      setErrorMessage('');
      setSuccessMessage('');
      setLoading(false);
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  const handleGenericErrors = (response: any, setErrorMessage: any, setSuccessMessage: any) => {
    if (response && response.data && response.data.errors) {
      const errors = response.data.errors;
      const errorKeys = Object.keys(errors);

      if (errorKeys.length > 0) {
        setSuccessMessage('');
        setErrorMessage(errors[errorKeys[0]]);
      }
    }
  };

  const checkErrors = (response: any) => {
    handleGenericErrors(response, setErrorMessage, setSuccessMessage);
  };

  const clearErrorAndInputs = () => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    setEmail('');
  };

  const sendForgotEmail = async () => {
    if (loading) return;

    const token = await userData.userToken;

    try {
      setLoading(true);

      const userData = {
        email: email,
      };

      const response = await axios.post(`${setup.appUrl}/api/resetPassword`, userData, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      setErrorMessage('');
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
  };

  return (
    <AnnounceLayout>
      <View style={styles.mainContainer}>
        <Text style={styles.mainText} accessibilityLabel='Título - Recuperar Password'>Recuperar Password</Text>

        <Text style={styles.forgotText} accessibilityLabel='Subtítulo - Introduz o email associado à tua conta no campo abaixo, para te enviarmos um link de recuperação.'>Introduz o <Text style={styles.boldText}>email</Text> associado à tua conta, para te enviarmos um link de recuperação.</Text>

        <TextInput
          style={styles.inputText}
          placeholder='Email'
          placeholderTextColor={gColors.gray}
          value={email}
          onChangeText={(text) => setEmail(text)}
        />

        <TouchableOpacity style={styles.sendEmailButton} onPress={sendForgotEmail} disabled={loading} accessibilityLabel={errorMessage ? `Erro atual - ${errorMessage}. ${loading ? "Processando o envío do email" : "Botão - Enviar Email"}` : (loading ? "Processando o envío do email" : "Botão - Enviar Email")}>
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.sendEmailText}>Enviar Email</Text>
          )}
        </TouchableOpacity>

        <Text style={{
          textAlign: 'center',
          color: successMessage ? 'green' : 'red',
          fontWeight: successMessage ? 'bold' : '500',
          fontSize: successMessage ? 15 : 14,
          paddingTop: 15,
          paddingBottom: 15,
        }}

          accessibilityLabel={errorMessage ? 'Erro atual - ' + errorMessage : 'Mensagem de sucesso - ' + successMessage}
        >

          {errorMessage ? errorMessage : successMessage}
        </Text>

        <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()} accessibilityLabel='Botão - Voltar à página de iniciar sessão'>
          <Text style={[styles.goBackText]}>Voltar à página de iniciar sessão</Text>
        </TouchableOpacity>
      </View>
    </AnnounceLayout>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    width: '85%',
    alignSelf: 'center',
  },

  mainText: {
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 20,
    color: gColors.blue
  },
  forgotText: {
    alignSelf: 'baseline',
    marginTop: 20,
    marginBottom: 40,
    fontSize: 16,
    color: gColors.gray,
    // textAlign: 'center',
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

  boldText: {
    fontWeight: '700',
  },

  sendEmailButton: {
    marginTop: 25,
    height: 50,
    width: '100%',
    borderRadius: 8,
    backgroundColor: gColors.blue,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },

  sendEmailText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },

  goBackButton: {
    paddingTop: 10,
  },
  goBackText: {
    paddingTop: 10,
    paddingBottom: 10,
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 14.5,
    color: gColors.gray,
  },
});

export default ForgotPassword;
