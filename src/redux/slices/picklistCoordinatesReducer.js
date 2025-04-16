import { createSlice } from "@reduxjs/toolkit";

export const picklistCoordinatesSlice = createSlice({
  name: "picklistCoordinatesSlice",
  initialState: {
    picklistCoordinates: [],
  },
  reducers: {
    setPicklistCoordinates: (state, action) => {
      const { picklistCoordinates } = action.payload;
      state.picklistCoordinates = picklistCoordinates || [];
    },
  },
});

export const { setPicklistCoordinates } = picklistCoordinatesSlice.actions;

export default picklistCoordinatesSlice.reducer;
