import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsChevronDown } from "react-icons/bs";
import { setPicklistCoordinates } from "../../redux/slices/picklistCoordinatesReducer";
import { setActiveCoordinate } from "../../redux/slices/activeCoordinateReducer";
import { FieldTypeEnum } from "../../constants/fieldTypeEnum";

function PicklistButtonContainer({ documentBounding }) {
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

  const picklistCoordinates = useSelector(
    (state) => state.picklistCoordinates.picklistCoordinates
  );

  const onDragEnd = (event) => {
    try {
      const field = supportedFields.find(
        (field) => field.type === FieldTypeEnum.PICKLIST
      );

      const coordsLength = picklistCoordinates.length || 0;

      const pagex =
        event.pageX - (documentBounding.left - field.width / 2) || 0;
      const pagey =
        event.pageY - (documentBounding.top - field.height / 2) || 0;
      let newEle = {
        field_id: field.id,
        value: "",
        signatory_id: activeSignatory.id,
        user_index_id: activeSignatory.index,
        bgColor: activeSignatory.bgColor,
        name: `PickList${coordsLength + 1}`,
        eleId: `picklistEle${coordsLength}`,
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
        setPicklistCoordinates({
          picklistCoordinates: picklistCoordinates.concat(newEle),
        })
      );

      dispatch(
        setActiveCoordinate({
          activeCoordinate: newEle,
          isSelectionMode: true,
        })
      );
    } catch (e) {
      localStorage.setItem("unexpected-error", e.stack);
      window.location.href = "/unexpected-error";
      throw new Error(e.message);
    }
  };

  return (
    <button type="button" className="tool-btn" onDragEnd={onDragEnd} draggable>
      <BsChevronDown className="tool-icon" /> <p>PickList</p>
    </button>
  );
}

export default PicklistButtonContainer;
