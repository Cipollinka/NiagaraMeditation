import {createSlice} from '@reduxjs/toolkit';

import data from 'app/assets/data';

export interface UserInfo {
  name: string;
  notifications: boolean;
  email: string;
}

export interface CoreState {
  favorites: string[];
  userInfo?: UserInfo | null;
  currentRouteName?: string;
  hideWelcomeScreen: boolean;
  isPlaying: boolean;
  activeCardPlayingId: string;
  buttonYPosition: number | undefined;
  playedTime: {
    [key: string]: number;
  };
}

const initialState: CoreState = {
  favorites: [],
  userInfo: null,
  hideWelcomeScreen: false,
  currentRouteName: 'Home',
  isPlaying: false,
  activeCardPlayingId: data[0].id,
  buttonYPosition: undefined,
  playedTime: {},
};

export const coreSlice = createSlice({
  name: 'core',
  initialState,
  reducers: {
    reset(state) {
      state.favorites = [];
      state.userInfo = null;
      state.currentRouteName = 'Home';
      state.hideWelcomeScreen = false;
    },
    toggleIsPlaying(state, action) {
      state.isPlaying = action.payload;
    },
    setPlayedTime(state, action) {
      state.playedTime = {
        ...(state.playedTime || {}),
        [action.payload.id]: action.payload.playedTime,
      };
    },
    setActiveCardPlayingId(state, action) {
      state.activeCardPlayingId = action.payload;
    },
    setButtonYPosition(state, action) {
      state.buttonYPosition = action.payload;
    },
    toggleFavorite(state, action) {
      const index = (state.favorites || []).indexOf(action.payload);

      if (index === -1) {
        state.favorites = [...(state.favorites || []), action.payload];
      } else {
        state.favorites = state.favorites.filter(
          item => item !== action.payload,
        );
      }
    },
    setUserInfo: (state, action) => {
      state.userInfo = {...(state.userInfo || {}), ...action.payload};
    },
    setCurrentRouteName(state, action) {
      state.currentRouteName = action.payload;
    },
    setHideWelcomeScreen(state, action) {
      state.hideWelcomeScreen = action.payload;
    },
  },
});

export const {
  reset,
  toggleFavorite,
  setUserInfo,
  setActiveCardPlayingId,
  setButtonYPosition,
  toggleIsPlaying,
  setPlayedTime,
  setCurrentRouteName,
  setHideWelcomeScreen,
} = coreSlice.actions;
