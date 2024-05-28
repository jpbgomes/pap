import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, Image, View, TouchableOpacity, Linking, Text, ActivityIndicator } from 'react-native';

import { gColors } from '../../globalStyles';

import setup from '../../setup';

const News = () => {
  const [stories, setStories] = useState([]);

  const fetchStoriesData = async () => {
    try {
      let storiesResult = await setup.handleStories();

      setStories(storiesResult || []);
    } catch (error) {
      setStories([]);
    }
  };

  useEffect(() => {
    fetchStoriesData();

    const interval = setInterval(() => {
      fetchStoriesData();
    }, stories.length > 0 ? 120000 : 3000);

    return () => clearInterval(interval);
  }, []);

  const openLink = (url) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.racesHorizontalContainer}
      accessibilityLabel='Cartão Horizontal que contém as notícias, arraste para o lado para ver cada notícia em detalhe.'
    >
      {stories.length > 0 ? (
        stories.map((story, index) => (
          <View key={index} style={styles.newsItemContainer} accessibilityLabel={`Cartão de Notícia - Título, ${story.title}, para abrir o link da notícia, clique no botáo abaixo,`}>
            <Image
              source={
                story.image.startsWith('http')
                  ? { uri: story.image }
                  : { uri: setup.appUrl + "/" + story.image }
              }
              style={styles.newsImage}
            />
            <View style={styles.newsTextContainer}>
              <Text style={styles.newsTitle}>{story.title}</Text>

              <TouchableOpacity style={styles.seeDetailsButton} onPress={() => openLink(story.url)} accessibilityLabel='Botão - Ler Mais (Abrir Link no Browser)'>
                <Text style={styles.seeDetailsText}>Ler Mais</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <ActivityIndicator size={75} color={gColors.blue} accessibilityLabel={'Notícias Inexistentes ou Carregando'} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  racesHorizontalContainer: {
    gap: 25,
    minHeight: 200,
    paddingTop: 15,
  },
  newsItemContainer: {
    flex: 1,
    borderRadius: 20,
    padding: 5,
    width: 275,
    justifyContent: 'space-around',
    backgroundColor: gColors.white,
  },
  newsImage: {
    width: '100%',
    minWidth: 200,
    height: 250,
    borderRadius: 18,
  },
  newsTextContainer: {
    marginTop: 5,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: gColors.dark,
    paddingLeft: 5,
    paddingRight: 5,
  },

  seeDetailsButton: {
    height: 35,
    width: '95%',
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: gColors.blue,
    marginTop: 15,
  },
  seeDetailsText: {
    color: gColors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default News;
