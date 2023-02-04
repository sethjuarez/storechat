import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@types";

const initialState: User = {
  name: "",
  email: "",
  expires: "",
  status: "unauthenticated",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state = { ...action.payload };
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
