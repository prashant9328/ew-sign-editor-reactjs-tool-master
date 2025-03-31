import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsTextareaT } from "react-icons/bs";
import { setTextBoxCoordinates } from "../../redux/slices/textBoxCoordinatesReducer";
import { setActiveCoordinate } from "../../redux/slices/activeCoordinateReducer";
import { FieldTypeEnum } from "../../constants/fieldTypeEnum";
import { log } from "react-modal/lib/helpers/ariaAppHider";

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

  let eventObg = {}

  const onDragEnd = (event) => {
    event.persist(); 
    for (let key in event) {
      try {
        eventObg[key] = event[key];
      } catch (err) {
        eventObg[key] = `Unable to clone property: ${err.message}`;
      }
    }

    console.log("Cloned Event Object:", eventObg);
    
    
    try{
    const field = supportedFields.find(
      (field) => field.type === FieldTypeEnum.TEXT
    );
    const coordsLength = textBoxCoordinates.length;

    const pagex = event.pageX - documentBounding.left - field.width / 2;
    
    const pagey = event.pageY - documentBounding.top - field.height / 2;
    console.log('page y' + pagey);

    // const pageScreenY = event.screenY;
    // const pageScreenX = event.screenX;

    // console.log('page screen' + pageScreen);
    
    

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
      // screenX: pageScreenX,
      // screenY: pageScreenY,
      width: field.width,
      height: field.height,
      isRequired: true,
      writeBack: false,
      updateFromSalesforce: false,
      editable:true,
      mappingField: { label: "", value: "", type: "" },

    };

    dispatch(
      setTextBoxCoordinates({
        textBoxCoordinates: textBoxCoordinates.concat(newEle),
      })
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
      <BsTextareaT className="tool-icon" /> <p>Text</p>
    </button>
  );
}

export default TextBoxButtonContainer;
