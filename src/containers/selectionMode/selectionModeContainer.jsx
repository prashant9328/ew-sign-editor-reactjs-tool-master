import React from "react";
import { useSelector } from "react-redux";
import { FieldTypeEnum } from "../../constants/fieldTypeEnum";
import SelectedSignatureContainer from "./selectedSignatureContainer";
import SelectedTextBoxContainer from "./selectedTextBoxContainer";
import SelectedEmailBoxContainer from "./selectedEmailBoxContainer";
import SelectedDateContainer from "./selectedDateContainer";
import SelectedCheckBoxContainer from "./selectedCheckBoxContainer";
import { useState } from "react";
import {sendSalesforceFields} from "../../pages/homePage"
// import handleSalesforceFields from "./handleSalesforceFields";
// import handleSalesforceFields from "../../pages/homePage"

const SelectionModeContainer = ({handleSalesforceFields}) => {
  const [salesforceData, setSalesforceData]=useState([])
  const supportedFields = useSelector(
    (state) => state.supportedFields.supportedFields
  );
  const activeCoordinate = useSelector(
    (state) => state.activeCoordinate.activeCoordinate
  );

  const field = supportedFields.find(
    (field) => field.id === activeCoordinate.field_id
  );

 
  const handleSalesforceData = (data) => {
    console.log("Salesforce data in child:", data);
    const forceData = data; 
    
    if (typeof handleSalesforceFields === "function") {
      handleSalesforceFields(forceData);  
    } else {
      console.error("handleSalesforceFields is not a function");
    }
  };

  const generateSelectedCoordinatesContainer = (type) => {
    switch (type) {
      case FieldTypeEnum.SIGNATURE:
        return <SelectedSignatureContainer />;
      case FieldTypeEnum.TEXT:
        return <SelectedTextBoxContainer  />;
      case FieldTypeEnum.DATE:
        return <SelectedDateContainer sendSalesforceData={handleSalesforceData} />;
      case FieldTypeEnum.CHECKBOX:
        return <SelectedCheckBoxContainer />;
      case FieldTypeEnum.EMAIL:
        return <SelectedEmailBoxContainer />;
      default:
        return null;
    }
  };

  return generateSelectedCoordinatesContainer(field.type);
};

export default SelectionModeContainer;
