import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postApi,putApi } from "../../api/apiService";

// Thunk for sending code
export const sendCode = createAsyncThunk(
  "resetPassword/sendCode",
  async ({ emailOrPhone }, { rejectWithValue }) => {
    try {
      const response = await postApi("/Auth/SendCode", { emailOrPhone });
      return response.message;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to send code.");
    }
  }
);

// Thunk for verifying code
export const verifyCode = createAsyncThunk(
  "resetPassword/verifyCode",
  async ({ emailOrPhone, code }, { rejectWithValue }) => {
    try {
      const response = await postApi("/Auth/VerifyCode", { emailOrPhone, code });
      return response.message;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Code verification failed.");
    }
  }
);

export const resetPassword = createAsyncThunk(
  "resetPassword/resetPassword",
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const response = await putApi("/Auth/ResetPassword", data, token); // Fix token placement
      return response.data.message; // Ensure this matches backend response
    } catch (error) {
      return rejectWithValue(error.response?.data || "Password reset failed.");
    }
  }
);


export const forgotPassword = createAsyncThunk(
  "resetPassword/forgotPassword",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await putApi("/Auth/ForgetPassword", data); // Note: Corrected endpoint to match backend
      return response.message || "Password reset successful"; // Use response.message or provide a default
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Password reset failed"
      );
    }
  }
);


const resetPasswordSlice = createSlice({
  name: "resetPassword",
  initialState: {
    status: "idle",
    message: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendCode.pending, (state) => {
        state.status = "loading";
        state.message = null;
        state.error = null;
      })
      .addCase(sendCode.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload;
      })
      .addCase(sendCode.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(verifyCode.pending, (state) => {
        state.status = "loading";
        state.message = null;
        state.error = null;
      })
      .addCase(verifyCode.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload;
      })
      .addCase(verifyCode.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.status = "loading";
        state.message = null;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.status = "loading";
        state.message = null;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default resetPasswordSlice.reducer;
