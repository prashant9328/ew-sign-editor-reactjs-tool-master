import { createSlice } from "@reduxjs/toolkit";

export const signatureCoordinatesSlice = createSlice({
  name: "signatureCoordinatesSlice",
  initialState: {
    signatureCoordinates: [],
  },
  reducers: {
    setSignatureCoordinates: (currentState, action) => {
      const { signatureCoordinates } = action.payload;
      currentState.signatureCoordinates = signatureCoordinates;
    },
    
  },
});

// Action creators are generated for each case reducer function
export const { setSignatureCoordinates } = signatureCoordinatesSlice.actions;

export default signatureCoordinatesSlice.reducer;
