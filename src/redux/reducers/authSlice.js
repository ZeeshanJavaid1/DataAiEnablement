// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi, signupApi } from "../../api/apiService";

// --- Login thunk
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginApi(credentials); // returns { token, user }
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// --- Signup thunk
export const signup = createAsyncThunk(
  "auth/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const data = await signupApi(userData); // returns { token, user }
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const EXPIRY_DURATION = 30 * 60 * 1000; // 30 minutes

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    user: null,
    token: null,
    status: "idle",
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem("auth");
    },
    loadUserFromStorage: (state) => {
      const saved = localStorage.getItem("auth");
      if (saved) {
        const { token, user, expiry } = JSON.parse(saved);
        if (Date.now() < expiry) {
          state.isLoggedIn = true;
          state.user = user;
          state.token = token;
        } else {
          // Token expired
          localStorage.removeItem("auth");
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isLoggedIn = true;
        state.token = action.payload.token;
        state.user = action.payload.user;

        localStorage.setItem("auth", JSON.stringify({
          token: state.token,
          user: state.user,
          expiry: Date.now() + EXPIRY_DURATION,
        }));
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(signup.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isLoggedIn = true;
        state.token = action.payload.token;
        state.user = action.payload.user;

        localStorage.setItem("auth", JSON.stringify({
          token: state.token,
          user: state.user,
          expiry: Date.now() + EXPIRY_DURATION,
        }));
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout, loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;
