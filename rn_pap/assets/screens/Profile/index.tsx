import React, { Component, useEffect, useState } from 'react'
import { Text, View, StyleSheet, ImageBackground, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
import { useRoute } from '@react-navigation/native';

import { useDispatch, useSelector } from 'react-redux';
import { RootState, store } from '../../../assets/redux/store';

import { gColors } from '../../../globalStyles';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import AppLayout from '../../layouts/appLayout';
import setup from '../../../setup';
import UserImage from '../../components/userImage';
import userSlice from '../../redux/userSlice';

type ProfileScreenRouteParams = {
  userName: string;
};

const Profile = ({ navigation }: any) => {
  const route = useRoute();

  const { userName } = route.params as ProfileScreenRouteParams;

  const userData = useSelector((state: RootState) => state.user);

  const [targetUser, setTargetUser] = useState<any>(null);
  const [day, setDay] = useState<number | null>(null);
  const [monthLabel, setMonthLabel] = useState<string | null>(null);
  const [year, setYear] = useState<number | null>(null);

  const fetchUserData = async () => {
    try {
      const userResult = await setup.handleSpecificUser(userName);

      if (userResult !== null) {
        setTargetUser(userResult.user);

        const date = new Date(userResult.user.created_at);
        setYear(date.getFullYear());
        let month = date.getMonth() + 1;
        setMonthLabel(months[month].label);
        setDay(date.getDate());
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userName]);

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      fetchUserData();
    });

    const unsubscribeBlur = navigation.addListener('blur', () => {
      fetchUserData();
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  const months = [
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
  ];

  const ShowProfile = () => {
    return (
      <>
        <View style={styles.profileStatusContainer}>
          <View style={styles.profileStatusBox}>
            <Text style={styles.profileBoxTitle}>Sexo</Text>
            <Text style={styles.profileBoxSubtitle}>{targetUser.sex || "Indefinido"}</Text>
          </View>

          <View style={styles.profileStatusBox}>
            <Text style={styles.profileBoxTitle}>Função</Text>
            <Text style={styles.profileBoxSubtitle}>{targetUser.runner_type}</Text>
          </View>

          <View style={styles.profileStatusBox}>
            <Text style={styles.profileBoxTitle}>Distrito</Text>
            <Text style={styles.profileBoxSubtitle}>{targetUser.district || "Indefinido"}</Text>
          </View>
        </View>

        <Text style={styles.joiningDateText}>Membro desde <Text style={styles.blueText}>{day}</Text> de <Text style={styles.blueText}>{monthLabel}</Text> de <Text style={styles.blueText}>{year}</Text></Text>
      </>
    )
  };


  if (!targetUser) {
    return (
      <>
        <View style={styles.errorContainer}>
          <Text style={styles.errorMessage}>ERRO</Text>
          <Text style={styles.errorDescription}>NÃO HÁ QUAQLQUER <Text style={styles.boldText}>PERFIL SELECIONADO</Text></Text>

          <TouchableOpacity accessible accessibilityLabel="Botão Retroceder" style={styles.goBackButton} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.goBackText}>Página Inicial</Text>
          </TouchableOpacity>
        </View>
      </>
    )
  } else {
    return (
      <>
        {targetUser.profile_banner_path ? (
          <ImageBackground
            style={styles.bannerBackgroundImage}
            source={
              targetUser.profile_banner_path.startsWith('http')
                ? { uri: targetUser.profile_banner_path }
                : { uri: setup.appUrl + "/" + targetUser.profile_banner_path }
            }
          />
        ) : (
          <ImageBackground
            style={styles.bannerBackgroundImage}
            source={{ uri: 'https://i.imgur.com/72oTVEt.jpg' }}
          />
        )}

        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.imageButton} activeOpacity={0.9}>
            <UserImage imageSize={145} imageSource={targetUser.profile_photo_path} />
          </TouchableOpacity>

          <Text style={styles.nameText}>{targetUser.name}</Text>
          <Text style={styles.usernameText}>@{targetUser.username}</Text>
        </View>

        <AppLayout>
          {targetUser.username === userData.user.Username ? (
            <ShowProfile />
          ) : (
            targetUser.is_profile_public === false || targetUser.is_profile_public === 0 ? (
              <View style={styles.profileStatusContainer}>
                <Text style={styles.profileStatusText}>PROFILE ISNT PUBLIC</Text>
              </View>
            ) : (
              <ShowProfile />
            )
          )}
        </AppLayout>
      </>
    )
  }
}

const styles = StyleSheet.create({
  bannerBackgroundImage: {
    width: '100%',
    height: 200,
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

  profileStatusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  profileStatusBox: {
    backgroundColor: gColors.blue,
    flex: 1,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 5,
    paddingRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    gap: 5,
  },
  profileBoxTitle: {
    fontSize: 17,
    fontWeight: '500',
    color: gColors.darkgray,
  },
  profileBoxSubtitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: gColors.white,
    textTransform: 'capitalize',
  },
  joiningDateText: {
    marginTop: 15,
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    color: gColors.darkgray,
  },
  blueText: {
    color: gColors.blue,
  },

  profileStatusText: {
    fontWeight: 'bold',
    fontSize: 25,
    textAlign: 'center',
    marginTop: 30,
    color: gColors.blue,
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

export default Profile;