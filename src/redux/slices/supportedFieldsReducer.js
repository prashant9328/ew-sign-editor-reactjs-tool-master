import { createSlice } from "@reduxjs/toolkit";

export const supportedFieldsSlice = createSlice({
  name: "supportedFieldsSlice",
  initialState: {
    supportedFields: [],
  },
  reducers: {
    setSupportedFields: (currentState, action) => {
      const { supportedFields } = action.payload;
      currentState.supportedFields = supportedFields;
    }
  },
});

// Action creators are generated for each case reducer function
export const { setSupportedFields } = supportedFieldsSlice.actions;

export default supportedFieldsSlice.reducer;
