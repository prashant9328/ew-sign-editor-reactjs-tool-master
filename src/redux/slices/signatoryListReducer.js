import { createSlice } from "@reduxjs/toolkit";

export const signatoryListSlice = createSlice({
  name: "signatoryListSlice",
  initialState: {
    signatoryList: [],
  },
  reducers: {
    setSignatoryList: (currentState, action) => {
      const { signatoryList } = action.payload;
      currentState.signatoryList = signatoryList;
    }
  },
});

// Action creators are generated for each case reducer function
export const { setSignatoryList } = signatoryListSlice.actions;

export default signatoryListSlice.reducer;
