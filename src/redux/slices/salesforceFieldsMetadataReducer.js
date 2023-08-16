import { createSlice } from "@reduxjs/toolkit";

export const salesforceFieldsMetadataSlice = createSlice({
  name: "salesforceFieldsMetadataSlice",
  initialState: {
    sobjectAPIName: "",
    salesforceFieldsMetadata: {},
  },
  reducers: {
    setSalesforceFieldsMetadata: (currentState, action) => {
      const { sobjectAPIName, salesforceFieldsMetadata } = action.payload;
      currentState.sobjectAPIName = sobjectAPIName;
      currentState.salesforceFieldsMetadata = salesforceFieldsMetadata;
    }
  },
});

// Action creators are generated for each case reducer function
export const { setSalesforceFieldsMetadata } = salesforceFieldsMetadataSlice.actions;

export default salesforceFieldsMetadataSlice.reducer;
