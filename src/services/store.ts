import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import chatReducer from "./chatSlice";
import customerReducer from "./customerSlice";
import promptsReducer from "./promptSlice";
import documentReducer from "./documentSlice"
import userReducer from "./userSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    chat: chatReducer,
    customers: customerReducer,
    prompts: promptsReducer,
    documents: documentReducer,
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