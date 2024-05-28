import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AnnounceLayout from '../../layouts/announceLayout';
import { gColors } from '../../../globalStyles';

const Terms = ({ navigation }: any) => {
  const accessText = `
    Termos de Serviço - Ao usar a nossa aplicação, autoriza que os seus dados poderão ser utilizados em futuros projetos relacionados com o Sexto Sentido. 
    Concorda também que a sua imagem, pode ser utilizada para questões de marketing como fotos, vídeos e posts em geral para as redes sociais. 
    Garantimos também que a sua informação pessoal está segura e não será dada a terceiros.
  `;

  return (
    <AnnounceLayout>
      <View style={styles.mainContainer}>
        <Text style={styles.termsMainText} accessibilityLabel='Título - Termos'>Termos</Text>

        <View accessibilityLabel={accessText}>
          <Text style={styles.termsText}>Ao usar a nossa aplicação, <Text style={styles.boldText}>autoriza que os seus dados poderão</Text> ser utilizados em futuros projetos relacionados com o Sexto Sentido.</Text>
          <Text style={styles.termsText}>Concorda também que a sua imagem, pode ser utilizada para questões de <Text style={styles.boldText}>marketing como fotos, vídeos e posts em geral para as redes sociais.</Text></Text>
          <Text style={styles.termsText}>Garantimos também que a sua informação pessoal <Text style={styles.boldText}>está segura e não será dada a terceiros.</Text></Text>
        </View>

        <TouchableOpacity accessible accessibilityLabel="Botão - Retroceder para a página inicial" style={styles.goBackButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.goBackText}>Página Inicial</Text>
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

  termsMainText: {
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 20,
    color: gColors.blue
  },
  termsText: {
    alignSelf: 'baseline',
    marginTop: 20,
    fontSize: 16,
    color: gColors.gray,
  },

  boldText: {
    fontWeight: '700',
  },

  goBackButton: {
    marginTop: 50,
    height: 50,
    width: '100%',
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

export default Terms;
