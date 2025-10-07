import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {   sendEmailToCommpany  } from '../../api/apiService';



// Send message to company thunk
export const sendCompanyMessage = createAsyncThunk(
  'contactUs/sendCompanyMessage',
  async ({ formData }, { rejectWithValue }) => {
    try {
        debugger
      const data = await sendEmailToCommpany(formData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to send message.'
      );
    }
  }
);

  const contactUsSlice = createSlice({
    name: 'contactUs',
    initialState: {
      companyData: [],
      status: 'idle',
      error: null,
      sendMessageStatus: 'idle',
      sendMessageError: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
          // Send message to company cases
      .addCase(sendCompanyMessage.pending, (state) => {
        state.sendMessageStatus = 'loading';
        state.sendMessageError = null;
      })
      .addCase(sendCompanyMessage.fulfilled, (state) => {
        state.sendMessageStatus = 'succeeded';
      })
      .addCase(sendCompanyMessage.rejected, (state, action) => {
        state.sendMessageStatus = 'failed';
        state.sendMessageError = action.payload;
      });
  
        
    },
  });
  
  export default contactUsSlice.reducer;