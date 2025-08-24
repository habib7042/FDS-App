import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light',
  language: 'en',
  isLoading: false,
  error: null,
  networkStatus: 'connected',
  appConfig: {
    baseUrl: 'http://localhost:3000/api',
    timeout: 30000,
    retryAttempts: 3,
  },
  notifications: [],
  modals: {
    visible: false,
    type: null,
    data: null,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setNetworkStatus: (state, action) => {
      state.networkStatus = action.payload;
    },
    setAppConfig: (state, action) => {
      state.appConfig = { ...state.appConfig, ...action.payload };
    },
    addNotification: (state, action) => {
      state.notifications.unshift({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      });
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    showModal: (state, action) => {
      state.modals = {
        visible: true,
        type: action.payload.type,
        data: action.payload.data,
      };
    },
    hideModal: (state) => {
      state.modals = {
        visible: false,
        type: null,
        data: null,
      };
    },
  },
});

export const {
  setTheme,
  setLanguage,
  setLoading,
  setError,
  clearError,
  setNetworkStatus,
  setAppConfig,
  addNotification,
  removeNotification,
  clearNotifications,
  showModal,
  hideModal,
} = uiSlice.actions;

export default uiSlice.reducer;