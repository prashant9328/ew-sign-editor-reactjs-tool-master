import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RiBallPenLine } from "react-icons/ri";
import { setSignatureCoordinates } from "../../redux/slices/signatureCoordinatesReducer";
import { setActiveCoordinate } from "../../redux/slices/activeCoordinateReducer";
import { FieldTypeEnum } from "../../constants/fieldTypeEnum";

function SignatureButtonContainer({ documentBounding }) {
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

  const signatureCoordinates = useSelector(
    (state) => state.signatureCoordinates.signatureCoordinates
  );

  const onDragEnd = (event) => {
    try{
    const field = supportedFields.find(
      (field) => field.type === FieldTypeEnum.SIGNATURE
    );
    const coordsLength = signatureCoordinates.length;

    const pagex = event.pageX - documentBounding.left - field.width / 2;
    const pagey = event.pageY - documentBounding.top - field.height / 2;
    const pageScreenY = event.screenY;
    const pageScreenX = event.screenX;


    let newEle = {
      field_id: field.id,
      signatory_id: activeSignatory.id,
      user_index_id: activeSignatory.index,
      bgColor: activeSignatory.bgColor,
      name: `Signature${coordsLength + 1}`,
      eleId: `signEle${coordsLength}`,
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
      mappingField: "",
    };

    dispatch(
      setSignatureCoordinates({
        signatureCoordinates: signatureCoordinates.concat(newEle),
      })
    );
    dispatch(
      setActiveCoordinate({ activeCoordinate: newEle, isSelectionMode: true })
    );
  }
  catch(e){
    console.log('@@@ ERROR::'+e.message);  
    localStorage.setItem('unexpected-error',e.stack)
    window.location.href='/unexpected-error'    
    throw new Error(e.message);
  };
  
  };

  return (
    <button
      type="button"
      className="tool-btn signature-btn"
      onDragEnd={onDragEnd}
      draggable
    >
      <RiBallPenLine className="tool-icon" /> <p>Signature</p>
    </button>
  );
}

export default SignatureButtonContainer;
