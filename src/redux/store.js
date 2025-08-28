import { configureStore } from "@reduxjs/toolkit";
import vehiclesReducer from "./slices/vehiclesSlice";
import addContractSliceReducer from "./slices/addContractSlice";
import addCarSliceReducer from "./slices/addCarSlice";
import editCarSliceReducer from "./slices/editCarSlice";

const store = configureStore({
  reducer: {
    vehicles: vehiclesReducer,
    addContract: addContractSliceReducer,
    addCar: addCarSliceReducer,
    editCar: editCarSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['addContract/setCarImages', 'addCar/setCarImages', 'addCar/addCarImage'],
        // Ignore these field paths in all actions
        ignoredActionsPaths: ['payload.file'],
        // Ignore these paths in the state
        ignoredPaths: ['addContract.carImages', 'addCar.carImages'],
      },
    }),
});

export default store;
