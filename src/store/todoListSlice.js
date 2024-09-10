import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { BASE_URL } from "../constants/index";

export const getTodoList = createAsyncThunk(
  "todoList/getTodoList",
  async function (_, { rejectWithValue }) {
    try {
      const response = await axios.get(BASE_URL);

      if (response.status !== 200) {
        throw new Error("Loading data server error!");
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteItem = createAsyncThunk(
  "todoList/deleteItem",
  async function (id, { rejectWithValue, dispatch }) {
    try {
      const response = await axios.delete(BASE_URL + id);

      if (response.status !== 200) {
        throw new Error("Delete data from server error!");
      }

      dispatch(removeItem({ id }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const postItem = createAsyncThunk(
  "todoList/postItem",
  async function (title, { rejectWithValue, dispatch, getState }) {
    try {
      const state = getState().todoList.todoList;
      const item = {
        userId: 1,
        id: state.length + 1,
        title: title,
        completed: false,
      };

      const response = await axios.post(BASE_URL, item);

      if (response.status !== 201) {
        throw new Error("Can't add task. Server error.");
      }

      dispatch(addItem(item));
      dispatch(setModalStatus(false));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const editItem = createAsyncThunk(
  "todoList/editItem",
  async function (item, { rejectWithValue, dispatch, getState }) {
    try {
      const response = await axios.patch(BASE_URL + item.id, item);

      if (response.status !== 200) {
        throw new Error("Update server error.");
      }

      dispatch(updateItem(item));
      dispatch(setModalStatus(false));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const patchItem = createAsyncThunk(
  "todoList/updateCompleted",
  async function (id, { rejectWithValue, dispatch, getState }) {
    const item = getState().todoList.todoList.find((item) => item.id === id);
    try {
      const response = await axios.patch(BASE_URL + id, {
        completed: !item.completed,
      });

      if (response.status !== 200) {
        throw new Error("Update complete status server error.");
      }

      dispatch(updateItemStatus({ id }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const setErrorState = (state, payload) => {
  state.status = "error";
  state.loading = false;
  state.error = payload;
};

const todoListSlice = createSlice({
  name: "todoList",
  initialState: {
    todoList: null,
    isModalActive: null,
  },
  reducers: {
    addItem(state, action) {
      const { payload } = action;
      state.todoList.push(payload);
    },
    removeItem(state, action) {
      const { payload } = action;
      state.todoList = state.todoList.filter(
        (todoItem) => todoItem.id !== payload.id
      );
    },
    updateItemStatus(state, action) {
      const { payload } = action;
      const todoItem = state.todoList.find((item) => item.id === payload.id);
      todoItem.completed = !todoItem.completed;
    },
    updateItem(state, action) {
      const { payload } = action;
      const todoItem = state.todoList.find((item) => item.id === payload.id);
      todoItem.title = payload.title;
    },
    setModalStatus(state, action) {
      const { payload } = action;
      state.isModalActive = payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getTodoList.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });

    builder.addCase(getTodoList.fulfilled, (state, { payload }) => {
      state.status = "resolved";
      state.todoList = payload;
    });

    builder.addCase(getTodoList.rejected, (state, { payload }) => {
      setErrorState(state, payload);
    });

    builder.addCase(deleteItem.rejected, (state, { payload }) => {
      setErrorState(state, payload);
    });

    builder.addCase(patchItem.rejected, (state, { payload }) => {
      setErrorState(state, payload);
    });

    builder.addCase(postItem.rejected, (state, { payload }) => {
      setErrorState(state, payload);
    });

    builder.addCase(editItem.rejected, (state, { payload }) => {
      setErrorState(state, payload);
    });
  },
});

export const {
  addItem,
  removeItem,
  updateItemStatus,
  updateItem,
  setModalStatus,
} = todoListSlice.actions;

export default todoListSlice.reducer;
