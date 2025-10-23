// import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";


// export default configureStore({
//   reducer: {
//     user: userSlice,
//   },
// });

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