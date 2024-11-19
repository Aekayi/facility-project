import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (credentials) => {
    console.log("Calling API with credentials:", credentials);
    const request = await axios.post(
      `https://x8ki-letl-twmt.n7.xano.io/api:eW0rqhTG/auth/login`,
      credentials
    );
    console.log("API Response:", response.data);
    const response = await request.data;
    localStorage.setItem("user", JSON.stringify(response));

    return response;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    status: "idle",
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.status = loading;
      state.user = null;
      state.error = null;
    }),
      builder.addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      }),
      builder.addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "An error occurred";

        state.isAuthenticated = false;
      });
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
