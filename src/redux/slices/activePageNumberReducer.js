import { createSlice } from "@reduxjs/toolkit";

export const activePageNumberSlice = createSlice({
  name: "activePageNumberSlice",
  initialState: {
    activePageNumber: 0,
  },
  reducers: {
    setActivePageNumber: (currentState, action) => {
      const { activePageNumber } = action.payload;
      currentState.activePageNumber = activePageNumber;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setActivePageNumber } = activePageNumberSlice.actions;

export default activePageNumberSlice.reducer;
