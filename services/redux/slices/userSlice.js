import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    common_data:{},
    success_stories:[],
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    COMMON_DATA : (state, action) => {
      state.common_data = action.payload
    },
    SUCCESS_STORIES : (state, action) => {
      state.success_stories = action.payload
    },
  },
});

export const getUSer = (state) => state.user;

export const { setUser, COMMON_DATA, SUCCESS_STORIES} = userSlice.actions;
export default userSlice.reducer;
