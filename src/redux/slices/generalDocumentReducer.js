import { createSlice } from "@reduxjs/toolkit";

export const generalDocumentSlice = createSlice({
  name: "generalDocumentSlice",
  initialState: {
    generalDocumentData : {
      orgId: '',
      templateUUID: '',
      documentUUID: '',
      signatureFlow: '',
      iv: '',
      token: ''
    }
  },
  reducers: {
    setGeneralDocumentData: (currentState, action) => {
      const { generalDocumentData } = action.payload;
      currentState.generalDocumentData = generalDocumentData;
    }
  },
});

// Action creators are generated for each case reducer function
export const { setGeneralDocumentData } = generalDocumentSlice.actions;

export default generalDocumentSlice.reducer;