import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  id: null,
  token: null,
  role: [],
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.id = action.payload.id;
      state.token = action.payload.token;
      state.role = Array.isArray(action.payload.role)
        ? action.payload.role
        : [];
      state.isAuthenticated = true;
    },
    clearCredentials: (state) => {
      state.id = null;
      state.token = null;
      state.role = [];
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;

export default authSlice.reducer;
