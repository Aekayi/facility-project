import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./features/apiSlice";
import persistStore from "redux-persist/es/persistStore";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage/session"; 
import authReducer from "./features/AuthSlice"

const persistConfig = {
  key: "root",
  storage 
};

const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth:persistedReducer
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: false,
  }).concat(apiSlice.middleware),
  
});
export const persistor = persistStore(store);