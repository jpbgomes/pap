import React, { useState, useEffect } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import setup from '../../../../setup';
import { gColors } from '../../../../globalStyles';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import axios from 'axios';

const Details = ({ route, navigation }) => {
  const conditionsData = [
    { label: 'Iniciante', value: 'beginner' },
    { label: 'Experiente', value: 'experienced' },
    { label: 'Avançado', value: 'advanced' },
  ];

  const { race } = route.params;

  const [raceId, setRaceId] = useState('');
  const [raceName, setRaceName] = useState('');
  const [raceTitle, setRaceTitle] = useState('');
  const [raceEdition, setRaceEdition] = useState('');
  const [raceDescription, setRaceDescription] = useState('');
  const [raceImage, setRaceImage] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const userData = useSelector((state: RootState) => state.user);
  const racesImIn = useSelector((state: RootState) => state.user.races);
  const participants = useSelector((state: RootState) => state.user.participants);
  const pairs = useSelector((state: RootState) => state.user.pairs);

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      setup.handleChatData()
        .then(() => {
          setErrorMessage('');
          setSuccessMessage('');
          setLoading(false);
        })
        .catch(error => {
          console.error('Error handling chat data:', error);
          setErrorMessage('Error handling chat data');
          setLoading(false);
        });
    });

    const unsubscribeBlur = navigation.addListener('blur', () => {
      setup.handleChatData()
        .then(() => {
          setErrorMessage('');
          setSuccessMessage('');
          setLoading(false);
        })
        .catch(error => {
          console.error('Error handling chat data:', error);
          setErrorMessage('Error handling chat data');
          setLoading(false);
        });
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  useEffect(() => {
    if (race && race.length > 0) {
      setRaceId(race[0].id);
      setRaceName(race[0].name);
      setRaceTitle(race[0].title);
      setRaceEdition(race[0].edition);
      setRaceDescription(race[0].description);
      setRaceImage(race[0].image_path);
    }
  }, []);

  const clearErrorAndInputs = () => {
    setErrorMessage('');
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

  const joinRace = async (race: any) => {
    if (loading) return;

    const token = await userData.userToken;

    try {
      setLoading(true);

      const raceData = {
        race_id: raceId,
        race_name: raceName,
      };

      const response = await axios.post(`${setup.appUrl}/api/joinRace`, raceData, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
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
      await setup.handleChatData();
    }
  };

  const leaveRace = async (race: any) => {
    if (loading) return;

    const token = await userData.userToken;

    try {
      setLoading(true);

      const raceData = {
        race_id: raceId,
        race_name: raceName,
      };

      const response = await axios.post(`${setup.appUrl}/api/leaveRace`, raceData, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
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
      await setup.handleChatData();
    }
  };

  const joinPair = async (targetId: any) => {
    if (loading) return;

    const token = await userData.userToken;

    try {
      setLoading(true);

      if (userData.user.RunnerType === "guia") {
        if (targetId === "random") {
          const raceData = {
            race_id: raceId,
            athlete_id: 'random',
            guide_id: 'my_id',
          };

          const response = await axios.post(`${setup.appUrl}/api/joinPair`, raceData, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

          clearErrorAndInputs();
          setSuccessMessage(response.data.message);
        } else {
          const raceData = {
            race_id: raceId,
            athlete_id: targetId,
            guide_id: 'my_id',
          };

          const response = await axios.post(`${setup.appUrl}/api/joinPair`, raceData, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

          clearErrorAndInputs();
          setSuccessMessage(response.data.message);
        }
      } else if (userData.user.RunnerType === "atleta") {
        if (targetId === "random") {
          const raceData = {
            race_id: raceId,
            athlete_id: 'my_id',
            guide_id: 'random',
          };

          const response = await axios.post(`${setup.appUrl}/api/joinPair`, raceData, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

          clearErrorAndInputs();
          setSuccessMessage(response.data.message);
        } else {
          const raceData = {
            race_id: raceId,
            athlete_id: 'my_id',
            guide_id: targetId,
          };

          const response = await axios.post(`${setup.appUrl}/api/joinPair`, raceData, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

          clearErrorAndInputs();
          setSuccessMessage(response.data.message);
        }
      }
    } catch (error: any) {
      if (error.response) {
        checkErrors(error.response);
      } else {
        setErrorMessage('Estamos com alguns problemas, tente novamente');
      }
    } finally {
      setLoading(false);
      await setup.handleChatData();
    }
  };

  function imSignedIn(raceName) {
    let isIn = false;

    for (const key in racesImIn) {
      if (Object.hasOwnProperty.call(racesImIn, key)) {
        const race = racesImIn[key];

        if (race.name === raceName) {
          isIn = true;
          break;
        }
      }
    }

    if (!isIn) {
      for (const key in pairs) {
        if (Object.hasOwnProperty.call(pairs, key)) {
          const pair = pairs[key];
          if (pair.race_participant_id === raceId) {
            if (pair.athlete.user.username === userData.user.Username) {
              isIn = true;
              break;
            } else if (pair.guide.user.username === userData.user.Username) {
              isIn = true;
              break;
            }
          }
        }
      }
    }

    return isIn;
  }

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.container}>
        <View style={styles.mainContainer}>
          <View style={styles.headerContainer} accessibilityLabel={`Título - Página da corrida ${raceTitle}`}>
            <Text style={styles.raceMainText}>{raceTitle}</Text>
          </View>

          {raceImage && (
            <Image
              accessible
              accessibilityLabel={"Imagem da Corrida " + raceTitle}
              source={
                raceImage.startsWith('http')
                  ? { uri: raceImage }
                  : { uri: setup.appUrl + "/" + raceImage }
              }
              style={styles.raceImage}
            />
          )}

          <View>
            <View>
              <View style={styles.raceHeaderContainer}>
                <View style={styles.editionContainer} accessibilityLabel={`Edição - ${raceEdition}`}>
                  <MaterialCommunityIcons name="newspaper" size={20} color="#3f3f3f" />
                  <Text style={styles.raceEditionText}>Edição <Text style={styles.boldText}>{raceEdition}</Text></Text>
                </View>

                <View style={styles.districtContainer} accessibilityLabel={`Distrito da Corrida - ${race[0].district}`}>
                  <MaterialCommunityIcons name="crosshairs-gps" size={20} color="#3f3f3f" />
                  <Text style={styles.districtText}> {race[0].district}</Text>
                </View>
              </View>

              <View style={styles.dateContainer} accessibilityLabel={`Informações Adicionais - Data, ${race[0].date} - Condição Mínima, ${conditionsData.find(item => item.value === race[0].minimum_condition)?.label || 'Desconhecido'} - Horário, ${race[0].start_time} até ${race[0].end_time}`}>
                <Text style={styles.dateText}>Data: <Text style={styles.boldText}> {race[0].date}</Text></Text>

                <Text style={styles.conditionText}>
                  Condição Mínima: <Text style={styles.boldText}>
                    {conditionsData.find(item => item.value === race[0].minimum_condition)?.label || 'Desconhecido'}
                  </Text>
                </Text>

                <Text style={styles.startText}>Horário: <Text style={styles.boldText}> {race[0].start_time} - {race[0].end_time}</Text></Text>
              </View>
              <View style={styles.conditionContainer}>
                <Text style={styles.acessibilityText}>Acessibilidade: <Text style={styles.boldText}>{race[0].has_accessibility ? 'Ativa' : 'Desativada'}</Text></Text>
              </View>
            </View>

            <Text style={styles.descriptionText} accessibilityLabel={`Descrição da corrida - ${raceDescription}`}>
              <Text style={styles.boldText}>Descrição:</Text> {raceDescription}
            </Text>

            <View style={styles.actionContainer}>
              {userData.userToken !== null ? (
                imSignedIn(raceName) ? (
                  <TouchableOpacity
                    accessible
                    accessibilityLabel='Botão - Cancelar Inscrição'
                    style={styles.actionRedButton}
                    onPress={() => leaveRace(race)}
                    activeOpacity={0.7}
                    disabled={loading}
                  >
                    <Text style={styles.buttonText}>Cancelar Inscrição</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    accessible
                    accessibilityLabel="Botão - Inscrição na Corrida"
                    style={styles.actionButton}
                    onPress={() => joinRace(race)}
                    activeOpacity={0.7}
                    disabled={loading}
                  >
                    <Text style={styles.buttonText}>Inscrever-me</Text>
                  </TouchableOpacity>
                )
              ) : (
                <TouchableOpacity
                  accessible
                  accessibilityLabel="Botão - Inscrição na Corrida"
                  style={styles.actionButton}
                  onPress={() => navigation.navigate('Login')}
                  activeOpacity={0.7}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
              )}
            </View>

            {errorMessage || successMessage ? (
              <Text style={{
                textAlign: 'center',
                color: successMessage ? 'green' : 'red',
                fontWeight: successMessage ? 'bold' : '500',
                fontSize: successMessage ? 15 : 14,
                marginTop: 5,
                marginBottom: 15,
              }}

                accessibilityLabel={errorMessage ? 'Erro atual - ' + errorMessage : 'Mensagem de sucesso - ' + successMessage}
              >

                {errorMessage ? errorMessage : successMessage}
              </Text>
            ) : null}
          </View>

          {userData.userToken !== null && (
            <View style={styles.participantContainer}>
              {participants && typeof participants === 'object' ? (
                Object.entries(participants).map(([loopRaceName, raceParticipants]) => {
                  if (loopRaceName === raceName) {
                    return (
                      <View style={styles.pairsContainer} key={loopRaceName}>
                        <Text style={styles.raceMainText}>Pares Disponíveis</Text>

                        <TouchableOpacity style={styles.participantButton} onPress={() => joinPair('random')} activeOpacity={0.75}>
                          <Text style={styles.participantTitle}>ALEATÓRIO</Text>
                        </TouchableOpacity>

                        {raceParticipants.map(participant => (
                          <TouchableOpacity style={styles.participantButton} key={participant.id} onPress={() => joinPair(participant.user.id)} activeOpacity={0.75}>
                            <Image style={styles.participantImage} source={{ uri: participant.user.profile_photo_path }} />
                            <Text style={styles.participantTitle}>{participant.user.name}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    );
                  }
                  return null;
                })
              ) : (
                <Text>Não há participantes disponíveis de momento</Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  safeAreaView: {
    paddingTop: 35,
    paddingBottom: 80,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContainer: {
    width: '85%',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  raceImage: {
    width: '100%',
    height: 275,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 15,
  },
  boldText: {
    fontWeight: '700',
  },
  boldTextAndCapitalize: {
    fontWeight: '700',
    textTransform: 'capitalize'
  },
  raceMainText: {
    fontWeight: 'bold',
    fontSize: 22,
    textAlign: 'center',
    marginTop: 20,
  },
  raceSecondText: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },

  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    gap: 20,
    marginTop: 5,
  },
  actionRedButton: {
    marginTop: 25,
    marginBottom: 10,
    height: 40,
    width: 105,
    borderRadius: 8,
    backgroundColor: gColors.red,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    flex: 1,
  },
  actionButton: {
    marginTop: 25,
    marginBottom: 10,
    height: 40,
    width: 105,
    borderRadius: 8,
    backgroundColor: gColors.blue,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    flex: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },

  typeButtonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  typeButton: {
    marginTop: 50,
    height: 40,
    width: 105,
    borderRadius: 8,
    backgroundColor: gColors.blue,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    flex: 1,
  },
  typeButtonSelected: {
    marginTop: 50,
    height: 40,
    width: 105,
    borderRadius: 8,
    backgroundColor: "#0121ea",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  typeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'capitalize'
  },

  raceHeaderContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    paddingBottom: 10,
    marginBottom: 20,
  },
  editionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    padding: 5,
  },
  raceEditionText: {
    textTransform: 'capitalize',
    fontSize: 17
  },
  districtContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  districtText: {
    textTransform: 'capitalize',
    fontWeight: 'bold',
    fontSize: 17
  },
  dateContainer: {

  },
  dateText: {
    fontSize: 17,

  },
  startText: {
    fontSize: 17,

  },
  endText: {
    fontSize: 17,

  },
  conditionContainer: {

  },
  acessibilityText: {
    fontSize: 17,
  },
  conditionText: {
    fontSize: 17,
  },

  descriptionText: {
    fontSize: 16,
    marginTop: 35,
  },

  participantContainer: {
    width: '100%',
  },
  pairsContainer: {
    width: '100%',
    flexDirection: 'column',
    gap: 10,
  },

  participantButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 15,
    backgroundColor: gColors.blue,
  },
  participantTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: gColors.white,
  },
  participantImage: {
    width: 60,
    height: 60,
    borderRadius: 500,
  },
});

export default Details;
