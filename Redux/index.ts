import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GameSettings } from "../types";

export type RootState = {
  settings: GameSettings;
};

const initialState = {
  settings: {
    humanName: "",
    machineName: "",
    difficulty: 0.82,
    valid: false,
  } as GameSettings,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState: initialState.settings,
  reducers: {
    setSettings(state, action: PayloadAction<GameSettings>) {
      return action.payload;
    },
    resetSettings(state) {
      return initialState.settings;
    },
  },
});

export const { setSettings, resetSettings } = settingsSlice.actions;

const reducer = {
  settings: settingsSlice.reducer,
};

export const Store = configureStore({
  reducer,
  devTools: process.env.NODE_ENV !== "production",
});
