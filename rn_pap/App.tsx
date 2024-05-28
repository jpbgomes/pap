import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';

import { Provider } from 'react-redux';
import { store } from './assets/redux/store';
import setup from './setup';

import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { gColors } from './globalStyles';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import HomeScreen from './assets/screens/Home/index';
import LoginScreen from './assets/screens/Login/index';
import ForgotPasswordScreen from './assets/screens/ForgotPassword/index';
import RegisterScreen from './assets/screens/Register/index';
import TermsScreen from './assets/screens/Terms/index';
import RaceDetailsScreen from './assets/screens/Race/Details/index';
import CreationScreen from './assets/screens/Race/Creation/index';

import ChatsScreen from './assets/screens/Chats/index';

import ProfileScreen from './assets/screens/Profile/index';
import SettingsScreen from './assets/screens/Settings/index';
import FaqScreen from './assets/screens/Faq/index';

const tabsData = [
  { name: "Home", iconName: 'home' },
  { name: "Chats", iconName: 'chat-processing' },
  { name: "Creation", iconName: 'card-plus' },
  { name: "Profile", iconName: 'card-account-details' },
  { name: "Settings", iconName: 'account-cog' },
  { name: "Login", iconName: 'account' },
  { name: "Register", iconName: 'archive-plus' },
  { name: "Terms", iconName: 'calendar-text' },
  { name: "Faq", iconName: 'help-circle' },
];

function getTabBarIcon(routeName: any, focused: any) {
  const tabInfo = tabsData.find(tab => tab.name === routeName) ?? { iconName: null };
  const color = focused ? gColors.blue : gColors.gray;
  return <MaterialCommunityIcons name={tabInfo.iconName} size={28} color={color} />;
}

const Stack = createNativeStackNavigator();

function HomeStack() {
  const state = store.getState();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
      initialRouteName="Races"
    >
      <Stack.Screen name="Races" component={HomeScreen} />
      <Stack.Screen name="RaceDetails" component={RaceDetailsScreen} />

      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ userName: state.user.user.Username }}
      />
    </Stack.Navigator>
  )
}

function LoginStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
      initialRouteName="LoginS"
    >
      <Stack.Screen name="LoginS" component={LoginScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  )
}

const Tab = createBottomTabNavigator();

function App(): React.JSX.Element {
  const state = store.getState();
  const [isLoggedIn, setLoggedIn] = useState(false);

  const [forceUpdateKey, setForceUpdateKey] = useState(0);

  useEffect(() => {
    const checkToken = async () => {
      await setup.handleToken();
      await setup.handleChatData();
    };

    checkToken();

    const intervalId = setInterval(() => {
      checkToken();
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const checkLogin = () => {
      if (state.user.userToken !== null) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    };

    const intervalId = setInterval(() => {
      checkLogin();
      setForceUpdateKey((prevKey) => prevKey + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [state.user.userToken]);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tab.Navigator initialRouteName='Login' screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused }) => getTabBarIcon(route.name, focused),

          tabBarShowLabel: false,

          tabBarLabelStyle: {
            color: '#101010',
            fontWeight: '500',
            fontSize: 13,
          },

          tabBarStyle: {
            position: 'absolute',

            borderTopEndRadius: 35,
            borderTopStartRadius: 35,
            paddingTop: 6,
            paddingBottom: 6,
            alignItems: 'center',
            alignSelf: 'center',
            width: '100%',
            height: 70,

            ...Platform.select({
              ios: {
                shadowColor: gColors.dark,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.75,
                shadowRadius: 3,
              },
              android: {
                borderTopWidth: 0.75,
                borderLeftWidth: 0.75,
                borderRightWidth: 0.75,

                borderTopColor: gColors.lightblue,
                borderLeftColor: gColors.lightblue,
                borderRightColor: gColors.lightblue,
              },
            }),
          },
        })}
        >
          <Tab.Screen name="Home" component={HomeStack} options={{
            tabBarAccessibilityLabel: "Página Inicial",
          }} />

          {isLoggedIn ? (
            <>
              <Tab.Screen name="Chats" component={ChatsScreen} options={{
                tabBarAccessibilityLabel: "Página de Chats",
              }} />

              {state.user.canCreateRaces && (
                <Tab.Screen name="Creation" component={CreationScreen} options={{
                  tabBarAccessibilityLabel: "Página de Criação",
                }} />
              )}

              <Tab.Screen name="Settings" component={SettingsScreen} options={{
                tabBarAccessibilityLabel: "Página de Definições",
              }} />
              <Tab.Screen name="Faq" component={FaqScreen} options={{
                tabBarAccessibilityLabel: "Página FAQ",
              }} />
            </>
          ) : (
            <>
              <Tab.Screen name="Login" component={LoginStack} options={{
                tabBarAccessibilityLabel: "Página de Login",
              }} />
              <Tab.Screen name="Register" component={RegisterScreen} options={{
                tabBarAccessibilityLabel: "Página de Registo",
              }} />
              <Tab.Screen name="Terms" component={TermsScreen} options={{
                tabBarAccessibilityLabel: "Página de Termos",
              }} />
            </>
          )}
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
