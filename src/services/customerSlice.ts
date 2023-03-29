import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Customer } from "@types";
import { RootState } from "./store";

interface CustomerState {
  customers: Customer[];
  selected: number;
}

const initialState: CustomerState = {
  selected: 0,
  customers: [
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
    {
      name: "Daniel",
      image: "/images/danielschneider.jpg",
      age: 68,
      location: "Pacific",
    },
  ],
};

const customerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    addCustomer: (state, action: PayloadAction<Customer>) => {
      state.customers.push(action.payload);
    },
    setSelectedCustomer: (state, action: PayloadAction<number>) => {
      if(action.payload >= 0 && action.payload < state.customers.length)
        state.selected = action.payload;
    },
  },
});

export const { addCustomer, setSelectedCustomer } = customerSlice.actions;
export const selectCustomers = (state: RootState) => state.customers.customers;
export const selectCurrentCustomer = (state: RootState) => state.customers.selected;
export const currentCustomer = (state: RootState) => state.customers.customers[state.customers.selected];
export default customerSlice.reducer;
