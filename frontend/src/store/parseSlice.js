import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

export const parseVoiceText = createAsyncThunk(
  "parse/voice",
  async (text) => {
    const res = await axios.post(`${API_BASE}/parse`, { text });
    return res.data;
  }
);

const parseSlice = createSlice({
  name: "parse",
  initialState: {
    parsed: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearParsed(state) {
      state.parsed = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(parseVoiceText.pending, (state) => {
        state.loading = true;
      })
      .addCase(parseVoiceText.fulfilled, (state, action) => {
        state.loading = false;
        state.parsed = action.payload;
      })
      .addCase(parseVoiceText.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearParsed } = parseSlice.actions;
export default parseSlice.reducer;
