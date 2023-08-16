import { createSlice } from "@reduxjs/toolkit";

export const textBoxCoordinatesSlice = createSlice({
  name: "textBoxCoordinatesSlice",
  initialState: {
    textBoxCoordinates: [],
  },
  reducers: {
    setTextBoxCoordinates: (currentState, action) => {
      const { textBoxCoordinates } = action.payload;
      currentState.textBoxCoordinates = textBoxCoordinates;
    }
  },
});

// Action creators are generated for each case reducer function
export const { setTextBoxCoordinates } = textBoxCoordinatesSlice.actions;

export default textBoxCoordinatesSlice.reducer;
