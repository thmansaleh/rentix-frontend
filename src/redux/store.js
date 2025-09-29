import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice';
import addCaseReducer from './slices/addCaseSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    addCase: addCaseReducer,
    // Add other slices as needed
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(),
});

export default store;
