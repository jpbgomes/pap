import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { gColors } from '../../../globalStyles';

import AnnounceLayout from '../../layouts/announceLayout';

const FAQ = ({ navigation }: any) => {
  return (
    <AnnounceLayout>
      <View style={styles.mainContainer}>
        <Text style={styles.faqMainText} accessibilityLabel='Título - Página de FAQ'>FAQ</Text>

        <View style={styles.faqContentContainer} accessibilityLabel='Cartão - Título, Tipo de Corredor. Pergunta, Como devo escolher o tipo de corredor? Resposta, Se visa guiar os outros, emprestando os seus olhos, deve registar-se como guia. Caso contrário, como atleta.'>
          <Text style={styles.faqContentTitle}>Tipo de Corredor</Text>
          <Text style={styles.faqContentQuestion}>Como devo escolher o tipo de corredor?</Text>
          <Text style={styles.faqContentAnswer}>Se visa guiar os outros, emprestando os seus olhos, deve registar-se como <Text style={styles.boldText}>guia</Text>. Caso contrário, como <Text style={styles.boldText}>atleta</Text>.</Text>
        </View>

        <View style={styles.faqContentContainer} accessibilityLabel='Cartão - Título, Condição Atual. Pergunta, Como devo escolher o tipo de condição atual? Resposta, Os tipos de corredores variam entre iniciante, experiente e avançado. Por favor escolha a opção que mais se adequa a sí.'>
          <Text style={styles.faqContentTitle}>Condição Atual</Text>
          <Text style={styles.faqContentQuestion}>Como devo escolher o tipo de condição atual?</Text>
          <Text style={styles.faqContentAnswer}>Os tipos de corredores variam entre <Text style={styles.boldText}>iniciante</Text>, <Text style={styles.boldText}>experiente</Text> e <Text style={styles.boldText}>avançado</Text>.</Text>
          <Text style={styles.faqContentAnswer}>Por favor escolha a opção que mais se adequa a sí.</Text>

        </View>

        <TouchableOpacity accessible accessibilityLabel="Botão - Página Inicial" style={styles.goBackButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.goBackText}>Página Inicial</Text>
        </TouchableOpacity>
      </View>
    </AnnounceLayout>
  );
};

const styles = StyleSheet.create({
  mainContainer: {

  },

  boldText: {
    fontWeight: 'bold',
  },

  faqMainText: {
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 30,
    color: gColors.blue,
  },
  faqContentContainer: {
    marginBottom: 45,
  },
  faqContentTitle: {
    fontWeight: 'bold',
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 20,
    color: gColors.gray,
  },
  faqContentQuestion: {
    fontWeight: 'bold',
    marginBottom: 15,
    fontSize: 17,
  },
  faqContentAnswer: {
    fontSize: 16,
    fontWeight: '500',
    color: gColors.gray,
  },

  goBackButton: {
    marginTop: 5,
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

export default FAQ;
