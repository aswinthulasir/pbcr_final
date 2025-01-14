import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import patientReducer from './slices/patientSlice';
import stateAdminReducer from './slices/stateAdminSlice';
import centerAdminReducer from './slices/centerAdminSlice';
import hospitalAdminReducer from './slices/hospitalAdminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    patient: patientReducer,
    stateAdmin: stateAdminReducer,
    centerAdmin: centerAdminReducer,
    hospitalAdmin: hospitalAdminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});