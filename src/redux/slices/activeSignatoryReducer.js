import { createSlice } from "@reduxjs/toolkit";

export const activeSignatorySlice = createSlice({
  name: "activeSignatorySlice",
  initialState: {
    activeSignatory: {},
  },
  reducers: {
    setActiveSignatory: (currentState, action) => {
      const { activeSignatory } = action.payload;
      currentState.activeSignatory = activeSignatory;
    }
  },
});

// Action creators are generated for each case reducer function
export const { setActiveSignatory } = activeSignatorySlice.actions;

export default activeSignatorySlice.reducer;
