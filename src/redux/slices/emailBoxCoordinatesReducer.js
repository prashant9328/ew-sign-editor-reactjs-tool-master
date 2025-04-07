import { createSlice } from "@reduxjs/toolkit";

export const emailBoxCoordinatesSlice = createSlice({
  name: "emailBoxCoordinatesSlice",
  initialState: {
    emailBoxCoordinates: [],
    allInvalidEmailCount: 0,
  },
  reducers: {
    setEmailBoxCoordinates: (currentState, action) => {
      const { emailBoxCoordinates } = action.payload;
      currentState.emailBoxCoordinates = emailBoxCoordinates;
    },
    setAllDefaultInvalidEmailCount: (currentState, action) => {
      currentState.allInvalidEmailCount = action.payload;
    },
  },
});

export const { setEmailBoxCoordinates, setAllDefaultInvalidEmailCount } =
  emailBoxCoordinatesSlice.actions;

export default emailBoxCoordinatesSlice.reducer;
