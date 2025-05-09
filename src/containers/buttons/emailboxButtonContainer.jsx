import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsEnvelope } from "react-icons/bs";
import { setEmailBoxCoordinates } from "../../redux/slices/emailBoxCoordinatesReducer";
import { setActiveCoordinate } from "../../redux/slices/activeCoordinateReducer";
import { FieldTypeEnum } from "../../constants/fieldTypeEnum";

function EmailBoxButtonContainer({ documentBounding }) {
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

  const emailBoxCoordinates = useSelector(
    (state) => state.emailBoxCoordinatesReducer?.emailBoxCoordinates || []
  );

  const onDragEnd = (event) => {
    try {
      const field = supportedFields.find(
        (field) => field.type === FieldTypeEnum.EMAIL
      );

      const coordsLength = emailBoxCoordinates.length || 0;

      const pagex = event.pageX - documentBounding.left - field.width / 2;
    
      const pagey = event.pageY - documentBounding.top - field.height / 2;
      console.log('page y' + pagey);
      let newEle = {
        field_id: field.id,
        value: "",
        signatory_id: activeSignatory.id,
        user_index_id: activeSignatory.index,
        bgColor: activeSignatory.bgColor,
        name: `Email${coordsLength + 1}`,
        eleId: `emailEle${coordsLength}`,
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
        setEmailBoxCoordinates({
          emailBoxCoordinates: emailBoxCoordinates.concat(newEle),
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
      <BsEnvelope className="tool-icon" /> <p>Email</p>
    </button>
  );
}

export default EmailBoxButtonContainer;
