import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsTextareaT } from "react-icons/bs";
import {
  setTextBoxCoordinates
} from "../../redux/slices/textBoxCoordinatesReducer";
import {
  setActiveCoordinate
} from "../../redux/slices/activeCoordinateReducer";
import { FieldTypeEnum } from "../../constants/fieldTypeEnum";

function TextBoxButtonContainer({ documentBounding }) {
  const dispatch = useDispatch();
  const supportedFields = useSelector(
      (state) => state.supportedFields.supportedFields
  );
  const activeSignatory = useSelector(
      (state) => state.activeSignatory.activeSignatory
  );

  const activePageNumber = useSelector(
      (state) => state.activePageNumber.activePageNumber
  );

  const textBoxCoordinates = useSelector(
      (state) => state.textBoxCoordinates.textBoxCoordinates
  );
  

  const onDragEnd = (event) => {
    const pagex = event.pageX - documentBounding.left;
    const pagey = event.pageY - documentBounding.top;
    
    const field = supportedFields.find((field) => field.type === FieldTypeEnum.TEXT);
    const coordsLength = textBoxCoordinates.length;

    let newEle = {
      field_id: field.id,
      value: "",
      signatory_id: activeSignatory.id,
      user_index_id: activeSignatory.index,
      bgColor: activeSignatory.bgColor,
      name: `Text${coordsLength + 1}`,
      eleId: `textEle${coordsLength}`,
      pageId: activePageNumber,
      x: pagex,
      y: pagey,
      width: field.width,
      height: field.height,
      isRequired: true,
      writeBack: false,
      updateFromSalesforce: false,
      mappingField: {label: "", value: "", type: ""}
    };

    dispatch(
      setTextBoxCoordinates({textBoxCoordinates: textBoxCoordinates.concat(newEle)})
    );
    dispatch(setActiveCoordinate({activeCoordinate: newEle, isSelectionMode: true}));

  }

  return (
    <button
      type="button"
      className="tool-btn"
      onDragEnd={onDragEnd}
      draggable
    >
      <BsTextareaT className="tool-icon" /> <p>Text</p>
    </button>
  );
}

export default TextBoxButtonContainer;
