import { configureStore } from "@reduxjs/toolkit";
import todoListReducer from "./todoListSlice";

const store = configureStore({
  reducer: {
    todoList: todoListReducer,
  },
});

export default store;
