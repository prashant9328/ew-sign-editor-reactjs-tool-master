import { createSlice } from "@reduxjs/toolkit";

export const dateCoordinatesSlice = createSlice({
  name: "dateCoordinatesSlice",
  initialState: {
    dateCoordinates: [],
  },
  reducers: {
    setDateCoordinates: (currentState, action) => {
      const { dateCoordinates } = action.payload;
      currentState.dateCoordinates = dateCoordinates;
    }
  },
});

// Action creators are generated for each case reducer function
export const { setDateCoordinates } = dateCoordinatesSlice.actions;

export default dateCoordinatesSlice.reducer;
