import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsCalendar2Date } from "react-icons/bs";
import { setDateCoordinates } from "../../redux/slices/dateCoordinatesReducer";
import { setActiveCoordinate } from "../../redux/slices/activeCoordinateReducer";
import { FieldTypeEnum } from "../../constants/fieldTypeEnum";

function DateButtonContainer({ documentBounding }) {
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

  const dateCoordinates = useSelector(
    (state) => state.dateCoordinates.dateCoordinates
  );

  const onDragEnd = (event) => {
    try{
    const field = supportedFields.find(
      (field) => field.type === FieldTypeEnum.DATE
    );
    const coordsLength = dateCoordinates.length;

    const pagex = event.pageX - documentBounding.left - field.width / 2;
    const pagey = event.pageY - documentBounding.top - field.height / 2;
    // const pageScreenY = event.screenY;
    // const pageScreenX = event.screenX;
    const pageScreenX = event.screenX - documentBounding.left - field.width / 2;
    const pageScreenY = event.screenY - documentBounding.top - field.width / 2;
    console.log('page screen x date' + pageScreenX);
    console.log('page screen y date' + pageScreenY);


    let newEle = {
      field_id: field.id,
      value: "",
      signatory_id: activeSignatory.id,
      user_index_id: activeSignatory.index,
      bgColor: activeSignatory.bgColor,
      name: `Date${coordsLength + 1}`,
      eleId: `dateEle${coordsLength}`,
      pageId: activePageNumber,
      x: pagex,
      y: pagey,
      screenX: pageScreenX,
      screenY: pageScreenY,
      width: field.width,
      height: field.height,
      isRequired: true,
      writeBack: false,
      updateFromSalesforce: false,
      mappingField: { label: "", value: "", type: "" },
    };

    dispatch(
      setDateCoordinates({ dateCoordinates: dateCoordinates.concat(newEle) })
    );
    dispatch(
      setActiveCoordinate({ activeCoordinate: newEle, isSelectionMode: true })
    );
  }catch(e){
    console.log('@@@ ERROR::'+e.message);  
    localStorage.setItem('unexpected-error',e.stack)
    window.location.href='/unexpected-error'    
    throw new Error(e.message);
  };
  };

  return (
    <button type="button" className="tool-btn" onDragEnd={onDragEnd} draggable>
      <BsCalendar2Date className="tool-icon" /> <p>Date</p>
    </button>
  );
}

export default DateButtonContainer;
