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

const SignatureCoordinatesContainer = ({ scrollContainer }) => {
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
    if (!data || typeof data.x !== "number" || typeof data.y !== "number") {
      console.error("Invalid drag data:", data);
      return;
    }

    const updatedCoords = updateCoordinatePosition(
      signatureCoordinates,
      id,
      data.x,
      data.y
    );
    dispatch(setSignatureCoordinates({ signatureCoordinates: updatedCoords }));
  };

  const handleResize = (id, data) => {
    if (
      !data ||
      typeof data.width !== "number" ||
      typeof data.height !== "number"
    ) {
      console.error("Invalid resize data:", data);
      return;
    }

    const updatedCoords = updateCoordinateSize(
      signatureCoordinates,
      id,
      data.width,
      data.height
    );
    dispatch(setSignatureCoordinates({ signatureCoordinates: updatedCoords }));
  };

  return signatureCoordinates.map((ele, index) => {
    if (ele.pageId !== activePageNumber) return null;

    const toolName = "Signature";
    const bgColor = ele.bgColor;
    const field = supportedFields.find((field) => field.type === toolName);

    return (
      <DragTool
        key={ele.eleId}
        isEditMode={activeCoordinate?.eleId === ele.eleId}
        bounds={scrollContainer}
        bgColor={bgColor}
        toolType={toolName}
        eleId={ele.eleId}
        pageId={ele.pageId}
        x={ele.x}
        y={ele.y}
        width={ele.width}
        height={ele.height}
        minWidth={field?.minWidth}
        minHeight={field?.minHeight}
        maxWidth={field?.maxWidth}
        maxHeight={field?.maxHeight}
        handleDragStart={() => handleDragStart(ele.eleId)}
        handleDragStop={(e, d) => handleDragStop(ele.eleId, d)}
        handleResize={(data, e) => handleResize(ele.eleId, data)}
        toolIcon={
          <RiBallPenLine
            className={`${toolName.toLowerCase()}-tool-icon-position`}
          />
        }
      />
    );
  });
};

export default SignatureCoordinatesContainer;
