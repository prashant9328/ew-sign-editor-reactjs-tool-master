import { createSlice } from "@reduxjs/toolkit";

export const activeCoordinateSlice = createSlice({
  name: "activeCoordinateSlice",
  initialState: {
    isSelectionMode: false,
    activeCoordinate: {},
  },
  reducers: {
    setActiveCoordinate: (currentState, action) => {
      const { activeCoordinate, isSelectionMode } = action.payload;
      console.log(JSON.stringify(action.payload));
      currentState.activeCoordinate = activeCoordinate;
      currentState.isSelectionMode = isSelectionMode;
    }
  },
});

// Action creators are generated for each case reducer function
export const { setActiveCoordinate } = activeCoordinateSlice.actions;

export default activeCoordinateSlice.reducer;
