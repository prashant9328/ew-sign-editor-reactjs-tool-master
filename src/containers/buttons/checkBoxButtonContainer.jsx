import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsCheck2Square } from "react-icons/bs";
import { setCheckBoxCoordinates } from "../../redux/slices/checkBoxCoordinatesReducer";
import { setActiveCoordinate } from "../../redux/slices/activeCoordinateReducer";
import { FieldTypeEnum } from "../../constants/fieldTypeEnum";

function CheckboxButtonContainer({ documentBounding }) {
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

  const checkBoxCoordinates = useSelector(
    (state) => state.checkBoxCoordinates.checkBoxCoordinates
  );

  const onDragEnd = (event) => {
    const field = supportedFields.find(
      (field) => field.type === FieldTypeEnum.CHECKBOX
    );
    const coordsLength = checkBoxCoordinates.length;

    const pagex = event.pageX - documentBounding.left - field.width / 2;
    const pagey = event.pageY - documentBounding.top - field.height / 2;

    let newEle = {
      field_id: field.id,
      value: false,
      signatory_id: activeSignatory.id,
      user_index_id: activeSignatory.index,
      bgColor: activeSignatory.bgColor,
      name: `Checkbox${coordsLength + 1}`,
      eleId: `checkBoxEle${coordsLength}`,
      pageId: activePageNumber,
      x: pagex,
      y: pagey,
      width: field.width,
      height: field.height,
      isRequired: true,
      writeBack: false,
      updateFromSalesforce: false,
      mappingField: { label: "", value: "", type: "" },
    };

    dispatch(
      setCheckBoxCoordinates({
        checkBoxCoordinates: checkBoxCoordinates.concat(newEle),
      })
    );
    dispatch(
      setActiveCoordinate({ activeCoordinate: newEle, isSelectionMode: true })
    );
  };

  return (
    <button type="button" className="tool-btn" onDragEnd={onDragEnd} draggable>
      <BsCheck2Square className="tool-icon" /> <p>Checkbox</p>
    </button>
  );
}

export default CheckboxButtonContainer;
