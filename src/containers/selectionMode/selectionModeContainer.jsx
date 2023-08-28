import React from "react";
import { useSelector } from "react-redux";
import { FieldTypeEnum } from "../../constants/fieldTypeEnum";
import SelectedSignatureContainer from "./selectedSignatureContainer";
import SelectedTextBoxContainer from "./selectedTextBoxContainer";
import SelectedDateContainer from "./selectedDateContainer";
import SelectedCheckBoxContainer from "./selectedCheckBoxContainer";

const SelectionModeContainer = () => {
  const supportedFields = useSelector(
    (state) => state.supportedFields.supportedFields
  );
  const activeCoordinate = useSelector(
    (state) => state.activeCoordinate.activeCoordinate
  );

  const field = supportedFields.find(
    (field) => field.id === activeCoordinate.field_id
  );

  const generateSelectedCoordinatesContainer = (type) => {
    switch (type) {
      case FieldTypeEnum.SIGNATURE:
        return <SelectedSignatureContainer />;
      case FieldTypeEnum.TEXT:
        return <SelectedTextBoxContainer />;
      case FieldTypeEnum.DATE:
        return <SelectedDateContainer />;
      case FieldTypeEnum.CHECKBOX:
        return <SelectedCheckBoxContainer />;
      default:
        return null;
    }
  };

  return generateSelectedCoordinatesContainer(field.type);
};

export default SelectionModeContainer;
