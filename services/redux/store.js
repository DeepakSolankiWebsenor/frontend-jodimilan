import userSlice from "./slices/userSlice";
import notificationSlice from "./slices/notificationSlice"

import { configureStore } from '@reduxjs/toolkit'

import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'
import { combineReducers } from '@reduxjs/toolkit'


const persistConfig = {
  key: 'root',  
  version: 1,
  storage
};
const reducer = combineReducers({
  user: userSlice,
  notification: notificationSlice
})
const persistedReducer = persistReducer(persistConfig , reducer)

const Store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: false,
  }),
})

export default Store