import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Customer } from "@types";
import { RootState } from "./store";

const initialState: Customer[] = [
    {
      name: "Seth",
      image: "/images/sethjuarez.jpg",
      age: 40,
      location: "Pacific",
    },
    {
      name: "Cassie",
      image: "/images/cassiebreviu.jpg",
      age: 23,
      location: "Central",
    },
    {
      name: "Vanessa",
      image: "/images/vanessadiaz.jpg",
      age: 23,
      location: "Eastern",
    },
  ];

const customerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    addCustomer: (state, action: PayloadAction<Customer>) => {
      state.push(action.payload);
    },
  },
});

export const { addCustomer } = customerSlice.actions;
export const selectCustomers = (state: RootState) => state.customers;
export default customerSlice.reducer;
