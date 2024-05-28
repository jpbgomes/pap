import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Text, View, TextInput, Platform, ImageBackground } from 'react-native';

import { useSelector } from 'react-redux';
import { RootState, store } from '../../redux/store';
import { setUserToken, setUserInfo, setAbilities, setCanCreateRaces } from '../../redux/userSlice';

import AppLayout from '../../layouts/appLayout';

import UserImage from '../../components/userImage';
import RaceImage from '../../components/raceImage';
import News from '../../components/news';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { gColors } from '../../../globalStyles';

import Logo from '../../components/logo';
import setup from '../../../setup';
import axios from 'axios';

const Bg = require('../../imgs/bg50.png');

const Home = ({ navigation }: any) => {
  const userData = useSelector((state: RootState) => state.user);
  const [groupedRaces, setGroupedRaces] = useState<any>({});
  const [filteredRaces, setFilteredRaces] = useState(null);

  const clearSearchBar = () => {
    setFilteredRaces(null);
  };

  const areAllCharactersPresent = (raceTitleRaw, filteredRacesRaw) => {
    const raceTitle = raceTitleRaw.toLowerCase();
    const filteredRaces = filteredRacesRaw ? filteredRacesRaw.toLowerCase() : '';

    const raceTitleCharCounts = new Map();
    const raceTitleWithoutSpaces = raceTitle.replace(/\s/g, '');

    for (const char of raceTitleWithoutSpaces) {
      raceTitleCharCounts.set(char, (raceTitleCharCounts.get(char) || 0) + 1);
    }

    const filteredRacesWithoutSpaces = filteredRaces.replace(/\s/g, '');

    for (const char of filteredRacesWithoutSpaces) {
      const countInRaceTitle = raceTitleCharCounts.get(char) || 0;
      if (countInRaceTitle === 0) {
        return false;
      }

      raceTitleCharCounts.set(char, countInRaceTitle - 1);
    }

    return true;
  };

  const groupRacesByIdAndName = (races: any) => {
    const grouped: any = {};

    races.forEach((race: any) => {
      const key = `${race.id}_${race.name}`;

      if (grouped[key]) {
        grouped[key].push(race);
      } else {
        grouped[key] = [race];
      }
    });

    return grouped;
  };

  const fetchRacesData = async () => {
    try {
      let raceResult = await setup.handleRaces();
      const grouped = groupRacesByIdAndName(raceResult);
      setGroupedRaces(grouped);
    } catch (error) {

    }
  };

  useEffect(() => {
    const intervalDuration = groupedRaces === null || Object.keys(groupedRaces).length === 0 ? 2500 : 15000;
    const intervalId = setInterval(fetchRacesData, intervalDuration);

    return () => {
      clearInterval(intervalId);
    };
  }, [groupedRaces]);

  function showRaceDetails(race: any, index: any) {
    navigation.navigate('RaceDetails', { race: index })
  }

  const handleLogout = async () => {
    store.dispatch(setUserToken(null));
    store.dispatch(setUserInfo({ Id: null, Name: null, Username: null, RunnerType: null, AvatarImage: null, BannerImage: null, IsVerified: null }));
    store.dispatch(setAbilities([]));
    store.dispatch(setCanCreateRaces(null));
  };

  return (
    <ImageBackground source={Bg} style={styles.imageBackground}>
      <AppLayout>
        <View style={styles.headerContainer} accessible accessibilityLabel={userData.userToken ? `Cartão - Bem-Vindo ${userData.user.Name}` : `Cartão de Boas Vindas - Junta-te à comunidade e inicía sessão`}>
          {userData.userToken !== null ? (
            <>
              <View style={styles.headerLeftContainer}>
                <UserImage imageSize={60} imageSource={null} />

                <View style={styles.headerLeftTextContainer} accessible accessibilityLabel={`Bem-Vindo ${userData.user.Name}`}>
                  <Text style={styles.welcomeText}>Bem-Vindo</Text>
                  <Text style={styles.userNameText}>{userData.user.Name} !</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.headerRightContainer} onPress={handleLogout} accessible accessibilityLabel={`Botão - Terminar Sessão`}>
                <MaterialCommunityIcons name="arrow-right-bold-circle" size={30} color={gColors.blue} />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.headerLeftContainer}>
                <Logo imageSize={60} />

                <View style={styles.headerLeftTextContainer}>
                  <Text style={styles.welcomeText}>Junta-te à comunidade!</Text>
                </View>
              </View>
            </>
          )}
        </View>

        <View style={styles.contentContainer}>
          {groupedRaces === null || Object.keys(groupedRaces).length === 0 ? (
            <View style={styles.titleContainer} accessibilityLabel={`Secção - Indisponível, à procura de corridas ou carregando`}>
              <Text style={styles.raceStatusText}>Corridas Indisponíveis</Text>
              <ActivityIndicator style={styles.activityIndicator} size={75} color={gColors.blue} />
            </View>
          ) : (
            <>
              <View style={styles.titleContainer} accessibilityLabel={`Secção - Número de corridas encontradas, ${Object.keys(groupedRaces).length}`}>
                <Text style={styles.raceStatusText}>Corridas Disponíveis ({Object.keys(groupedRaces).length})</Text>
              </View>

              <View style={styles.searchPallet}>
                <TextInput
                  style={styles.searchInput}
                  placeholder='Barra de Pesquisa'
                  placeholderTextColor={gColors.gray}
                  onChangeText={(text) =>
                    setFilteredRaces(text)
                  }
                  value={filteredRaces}
                />
                <TouchableOpacity style={styles.searchIconArea} onPress={clearSearchBar} accessibilityLabel='Botão - Apagar conteúdo da barra de pesquisa'>
                  <MaterialCommunityIcons name="eraser" size={25} color={gColors.blue} />
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.racesHorizontalContainer}
              >
                {Object.keys(groupedRaces).map((key) => {
                  const races = groupedRaces[key];
                  const race = races[0];

                  const allCharactersPresent = areAllCharactersPresent(race.title, filteredRaces);

                  if (filteredRaces === "" || filteredRaces === null || allCharactersPresent) {
                    return (
                      <View key={race.id} style={styles.raceTouchableContainer} accessible accessibilityLabel={"Cartão da Corrida - " + race.title}>
                        {race.image_path && (
                          <RaceImage title={race.title} source={race.image_path} />
                        )}
                        <View style={styles.raceDetailsContainer}>
                          <View accessible accessibilityLabel={"Nome da corrida, " + race.title + ", edição, " + race.edition} style={styles.raceDetailsTop}>
                            <Text style={styles.raceTitle}>Nome: {race.title}</Text>
                            <Text style={styles.raceEdition}>Edição: {race.edition}</Text>
                          </View>

                          <TouchableOpacity style={styles.seeDetailsButton} onPress={() => showRaceDetails(race, races)} activeOpacity={0.7} accessibilityLabel='Botão - Ver Detalhes (Clique para obter mais dados sobre a corrida)'>
                            <Text style={styles.seeDetailsText}>Ver Detalhes</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  }
                })}
              </ScrollView>
            </>
          )}
        </View>

        <View style={styles.contentContainer} accessibilityLabel='Secção das Notícias'>
          <View style={styles.titleContainer}>
            <Text style={styles.raceStatusText}>Notícias</Text>
          </View>
          <News />
        </View>
      </AppLayout>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    height: '100%',
  },

  headerContainer: {
    width: '100%',
    height: 70,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 20,
    gap: 15,
    marginBottom: 45,
    backgroundColor: 'white',
  },
  headerLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 5,
  },
  headerLeftTextContainer: {
    gap: 5,
    height: '100%'
  },
  welcomeText: {
    fontSize: 15,
    fontWeight: '400',
    color: gColors.gray,
  },
  userNameText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: gColors.dark,
  },
  headerRightContainer: {
    padding: 6,
    borderRadius: 100,
  },

  contentContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 45,
    padding: 5,
  },
  titleContainer: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  raceStatusText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: gColors.dark,
    textAlign: 'left',
  },
  activityIndicator: {
    alignSelf: 'flex-start',
    marginTop: 20,
  },

  searchPallet: {
    width: '100%',
    height: 40,
    paddingLeft: 5,
    paddingRight: 5,
    flexDirection: "row",
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: gColors.white,
  },
  searchInput: {
    height: '100%',
    flex: 1,
    alignItems: 'center',
    backgroundColor: gColors.white,
    fontSize: 15,
  },
  searchIconArea: {
    width: 30,
    height: '100%',
    justifyContent: "center",
    alignItems: "center",
  },

  racesHorizontalContainer: {
    gap: 25,
    minHeight: 400,
    paddingTop: 15,
  },

  raceTouchableContainer: {
    flex: 1,
    borderRadius: 20,
    padding: 5,
    backgroundColor: gColors.white,
    justifyContent: 'space-around',
    // justifyContent: 'space-between',
  },
  raceDetailsContainer: {

  },
  raceDetailsTop: {
    marginTop: 15,
    alignItems: 'center',
  },
  raceTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    color: gColors.darkgray,
  },
  raceEdition: {
    fontSize: 16,
    fontWeight: '500',
    color: gColors.gray,
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

export default Home;