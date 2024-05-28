import axios from 'axios';
import { store } from './assets/redux/store';
import { setUserToken, setUserInfo, setAbilities, setCanCreateRaces, setParticipants, setRaces, setPairs } from './assets/redux/userSlice';

// const appUrl = "http://192.168.43.62:8000";
const appUrl = "http://academiasextosentido.pt/public";

const handleChatData = async () => {
  const state = store.getState();
  const { userToken } = state.user;

  try {
    const response = await axios.get(`${appUrl}/api/getPairs`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      }
    });

    store.dispatch(setParticipants(response.data.participants));
    store.dispatch(setRaces(response.data.races));
    store.dispatch(setPairs(response.data.pairs));
  } catch (error: any) {
    store.dispatch(setParticipants(null));
  }
};

const handleToken = async () => {
  const state = store.getState();
  const { userToken } = state.user;

  try {
    const response = await axios.get(`${appUrl}/api/checkToken`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      }
    });
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      store.dispatch(setUserToken(null));
      store.dispatch(setUserInfo({ Id: null, Name: null, Username: null, RunnerType: null, AvatarImage: null, BannerImage: null, IsVerified: null }));
      store.dispatch(setCanCreateRaces(null));
    }
  }
};

const handleRaces = async () => {
  try {
    const response = await axios.get(`${appUrl}/api/races`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    return (response.data.races);
  } catch (error) {
    return (null);
  }
};

const handleStories = async () => {
  try {
    const response = await axios.get(`${appUrl}/api/stories`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    return (response.data.stories);
  } catch (error) {
    return (null);
  }
};

const handleUser = async () => {
  const state = store.getState();
  const { userToken } = state.user;

  try {
    const response = await axios.get(`${appUrl}/api/getUser`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      }
    });

    store.dispatch(setUserInfo({
      Id: response.data.user.id,
      Name: response.data.user.name,
      Username: response.data.user.username,
      RunnerType: response.data.user.runner_type,
      AvatarImage: response.data.user.profile_photo_path,
      BannerImage: response.data.user.profile_banner_path,
      IsVerified: response.data.user.email_verified_at,
    }));
  } catch (error) {
    store.dispatch(setUserInfo({ Id: null, Name: null, Username: null, RunnerType: null, AvatarImage: null, BannerImage: null, IsVerified: null }));
    store.dispatch(setCanCreateRaces(null));
  }
};

const handleAbilities = async () => {
  const state = store.getState();
  const { userToken } = state.user;

  try {
    const response = await axios.get(`${appUrl}/api/getAbilities`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      }
    });

    store.dispatch(setAbilities(response.data.abilities));

    const canCreateRaces = response.data.abilities.some((ability: any) => ability.name === 'race_creation');
    store.dispatch(setCanCreateRaces(canCreateRaces));
  } catch (error) {
    store.dispatch(setAbilities(null));
  }
};

const handleSpecificUser = async (username: string) => {
  const state = store.getState();
  const { userToken } = state.user;

  try {
    const response = await axios.get(`${appUrl}/api/getSpecificUser?username=${username}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      },
    });

    return response.data;
  } catch (error) {
    return null;
  }
};

const exportsObject = {
  appUrl,
  handleChatData,
  handleToken,
  handleRaces,
  handleStories,
  handleUser,
  handleAbilities,
  handleSpecificUser,
};

export default exportsObject;
