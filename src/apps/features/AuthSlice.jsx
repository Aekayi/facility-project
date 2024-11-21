import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    id : null,
    accessToken : null
};

const authSlice = createSlice({
    name : "auth",
    initialState,
    reducers : {
        setCredentials: (state, action) => {
            state.id = action.payload.id;
            state.accessToken = action.payload.accessToken;
          },
        clearCredentials : (state) => {
            state.id = null;
            state.accessToken = null;
          },  
    },
});

export const {setCredentials,clearCredentials} = authSlice.actions;
export default authSlice.reducer;

