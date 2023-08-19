import { combineReducers } from "redux";
import activeSignatoryReducer from "./activeSignatoryReducer";
import activeCoordinateReducer from "./activeCoordinateReducer";
import activePageNumberReducer from "./activePageNumberReducer";
import signatoryListReducer from "./signatoryListReducer";
import supportedFieldsReducer from "./supportedFieldsReducer";
import signatureCoordinatesReducer from "./signatureCoordinatesReducer";
import textBoxCoordinatesReducer from "./textBoxCoordinatesReducer";
import dateCoordinatesReducer from "./dateCoordinatesReducer";
import checkBoxCoordinatesReducer from "./checkBoxCoordinatesReducer";
import generalDocumentReducer from "./generalDocumentReducer";
import salesforceFieldsMetadataReducer from "./salesforceFieldsMetadataReducer";

const rootReducer = combineReducers({
    activeSignatory: activeSignatoryReducer,
    activeCoordinate: activeCoordinateReducer,
    activePageNumber: activePageNumberReducer,
    signatoryList: signatoryListReducer,
    supportedFields: supportedFieldsReducer,
    signatureCoordinates: signatureCoordinatesReducer,
    textBoxCoordinates: textBoxCoordinatesReducer,
    dateCoordinates: dateCoordinatesReducer,
    checkBoxCoordinates: checkBoxCoordinatesReducer,
    generalDocumentData: generalDocumentReducer,
    salesforceFieldsMetadata: salesforceFieldsMetadataReducer,
});
export default rootReducer;