import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Turn } from "@types";
import { RootState } from "./store";

const initialState: Turn[] = [];

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addTurn: (state, action: PayloadAction<Turn>) => {
      state.push(action.payload);
    },
    // TODO: perhaps use { reducer, prepare } instead of action: PayloadAction
    addRequest: (state, action: PayloadAction<string>) => {
      state.push({ message: action.payload, status: "done", type: "user" });
      state.push({
        message: "thanks for your question!",
        status: "waiting",
        type: "bot",
      });
    },
    addResponse: (state, action: PayloadAction<string>) => {
      if (
        state.length > 0 &&
        state[state.length - 1].type === "bot" &&
        state[state.length - 1].status === "waiting"
      ) {
        state[state.length - 1] = {
          message: action.payload,
          status: "done",
          type: "bot",
        };
      } else {
        state.push({
          message: action.payload,
          status: "done",
          type: "bot",
        });
      }
    },
    clearTurns: (state) => {
      state.splice(0, state.length);
    },
  },
});


export const { addTurn, addRequest, addResponse, clearTurns } = chatSlice.actions;
export const selectChat = (state: RootState) => state.chat;
export default chatSlice.reducer;
