import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "./taskSlice";
import parseReducer from "./parseSlice";

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
    parse: parseReducer,
  },
});
