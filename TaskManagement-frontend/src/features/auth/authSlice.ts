import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TokenResponseDto } from "../../types/auth";

interface AuthState {
  user: TokenResponseDto | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading:false
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    loginStart:(state)=>{
        state.loading=true;
    },
    loginSuccess:(state,action:PayloadAction<TokenResponseDto>)=>{
        state.user=action.payload;
        state.isAuthenticated=true;
        state.loading=false;
    },
    loginFailure:(state)=>{
        state.user=null;
        state.isAuthenticated=false;
        state.loading=false;
    }
    ,
    logout1: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading=false;
    },
  },
});

export const { loginStart,loginSuccess,loginFailure, logout1 } = authSlice.actions;

export default authSlice.reducer;