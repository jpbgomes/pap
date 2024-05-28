// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userToken: null,
    user: {
      Id: null,
      Name: null,
      Username: null,
      RunnerType: null,
      AvatarImage: null,
      BannerImage: null,
      IsVerified: null,
    },

    groups: [],
    participants: [],
    pairs: [],
    races: [],

    abilities: [],
    canCreateRaces: null,
  },
  reducers: {
    setUserToken: (state, action) => {
      state.userToken = action.payload;
    },
    setUserInfo: (state, action) => {
      state.user = action.payload;
    },

    setPairs: (state, action) => {
      state.pairs = action.payload;
    },
    setParticipants: (state, action) => {
      state.participants = action.payload || [];
    },
    setGroups: (state, action) => {
      state.groups = action.payload;
    },
    setRaces: (state, action) => {
      state.races = action.payload;
    },

    setAbilities: (state, action) => {
      state.abilities = action.payload;
      state.canCreateRaces = action.payload.some((ability: any) => ability.name === 'race_creation');
    },
    setCanCreateRaces: (state, action) => {
      state.canCreateRaces = action.payload;
    },
  },
});

export const { setUserToken, setUserInfo, setPairs, setParticipants, setGroups, setRaces, setAbilities, setCanCreateRaces } = userSlice.actions;
export default userSlice.reducer;
