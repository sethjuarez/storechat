import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import chatReducer from "./chatSlice";
import customerReducer from "./customerSlice";

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    customers: customerReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;