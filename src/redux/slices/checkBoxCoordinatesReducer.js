import { createSlice } from "@reduxjs/toolkit";

export const checkboxCoordinatesSlice = createSlice({
  name: "checkboxCoordinatesSlice",
  initialState: {
    checkBoxCoordinates: [],
  },
  reducers: {
    setCheckBoxCoordinates: (currentState, action) => {
      const { checkBoxCoordinates } = action.payload;
      currentState.checkBoxCoordinates = checkBoxCoordinates;
    }
  },
});

// Action creators are generated for each case reducer function
export const { setCheckBoxCoordinates } = checkboxCoordinatesSlice.actions;

export default checkboxCoordinatesSlice.reducer;
