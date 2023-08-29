import React from "react";
import { useDispatch, useSelector } from "react-redux";
import DragTool from "../../components/drag-tool";
import { RiBallPenLine } from "react-icons/ri";
import { setActiveCoordinate } from "../../redux/slices/activeCoordinateReducer";
import {
  updateCoordinatePosition,
  updateCoordinateSize,
} from "../../utils/updateCoordinates";
import { setSignatureCoordinates } from "../../redux/slices/signatureCoordinatesReducer";

const SignatureCoordinatesContainer = (scrollContainer) => {
  const dispatch = useDispatch();
  const supportedFields = useSelector(
    (state) => state.supportedFields.supportedFields
  );

  const activePageNumber = useSelector(
    (state) => state.activePageNumber.activePageNumber
  );

  const activeCoordinate = useSelector(
    (state) => state.activeCoordinate.activeCoordinate
  );

  const signatureCoordinates = useSelector(
    (state) => state.signatureCoordinates.signatureCoordinates
  );

  const handleDragStart = (id) => {
    const signatureCoordinate = signatureCoordinates.find(
      (ele) => ele.eleId === id
    );
    console.log(JSON.stringify(signatureCoordinate));
    if (signatureCoordinate) {
      dispatch(
        setActiveCoordinate({
          activeCoordinate: signatureCoordinate,
          isSelectionMode: true,
        })
      );
    }
  };

  const handleDragStop = (id, data) => {
    const updatedCoords = updateCoordinatePosition(
      signatureCoordinates,
      id,
      data.x,
      data.y
    );
    dispatch(setSignatureCoordinates({ signatureCoordinates: updatedCoords }));
  };

  const handleResize = (id, data) => {
    const updatedCoords = updateCoordinateSize(
      signatureCoordinates,
      id,
      data.width,
      data.height
    );
    dispatch(setSignatureCoordinates({ signatureCoordinates: updatedCoords }));
  };

  return signatureCoordinates.map((ele, index) => {
    if (ele.pageId === activePageNumber) {
      const toolName = "Signature";
      const bgColor = ele.bgColor;
      const field = supportedFields.find((field) => field.type === toolName);
      return (
        <DragTool
          key={index}
          isEditMode={activeCoordinate && ele.eleId === activeCoordinate.eleId}
          bounds={scrollContainer}
          bgColor={bgColor}
          toolType={toolName}
          id={ele.eleId}
          pageId={ele.pageId}
          x={ele.x}
          y={ele.y}
          width={ele.width}
          height={ele.height}
          minWidth={field.minWidth}
          minHeight={field.minHeight}
          maxWidth={field.maxWidth}
          maxHeight={field.maxHeight}
          handleDragStart={(toolType, e) => handleDragStart(ele.eleId)}
          handleDragStop={(data, e) => handleDragStop(ele.eleId, data)}
          handleResize={(data, e) => handleResize(ele.eleId, data)}
          toolIcon={
            <RiBallPenLine
              className={`${toolName.toLowerCase()}-tool-icon-position`}
            />
          }
        />
      );
    }
  });
};

export default SignatureCoordinatesContainer;
