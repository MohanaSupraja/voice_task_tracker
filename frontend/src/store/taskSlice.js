import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (filters = {}) => {
    const res = await axios.post(`${API_BASE}/tasks/filter`, filters);
    return res.data; // array of tasks
  }
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData, thunkAPI) => {
    const res = await axios.post(`${API_BASE}/tasks`,taskData);
    return res.data;
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, updates }) => {
    const res = await axios.put(`${API_BASE}/tasks/${id}`, updates);
    return res.data; // updated task object
  }
);

export const deleteTask = createAsyncThunk("tasks/deleteTask", async (id) => {
  await axios.delete(`${API_BASE}/tasks/${id}`);
  return id; // return deleted ID
});

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    items: [],
    loading: false,
    createStatus: "idle",
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      // FETCH TASKS
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createTask.pending, (state) => {
        state.createStatus = "loading";
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.createStatus = "success";
        state.items.unshift(action.payload);
      })
      .addCase(createTask.rejected, (state) => {
        state.createStatus = "error";
      })

      .addCase(updateTask.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.items.findIndex((t) => t._id === updated._id);
        if (idx !== -1) {
          state.items[idx] = updated;
        }
      })

      // DELETE TASK
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t._id !== action.payload);
      });
  },
});

export default taskSlice.reducer;
