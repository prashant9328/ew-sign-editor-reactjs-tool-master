import React from "react";
import { useDispatch, useSelector } from "react-redux";
import DragTool from "../../components/drag-tool";
import { BsChevronDown } from "react-icons/bs";
import { setActiveCoordinate } from "../../redux/slices/activeCoordinateReducer";
import {
  updateCoordinatePosition,
  updateCoordinateSize,
} from "../../utils/updateCoordinates";
import { setPicklistCoordinates } from "../../redux/slices/picklistCoordinatesReducer";

const PicklistCoordinatesContainer = ({ scrollContainer }) => {
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
  const picklistCoordinates = useSelector(
    (state) => state.picklistCoordinates.picklistCoordinates
  );

  const handleDragStart = (id) => {
    const picklistCoordinate = picklistCoordinates.find(
      (ele) => ele.eleId === id
    );

    if (picklistCoordinate) {
      dispatch(
        setActiveCoordinate({
          activeCoordinate: picklistCoordinate,
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
      picklistCoordinates,
      id,
      data.x,
      data.y
    );
    dispatch(setPicklistCoordinates({ picklistCoordinates: updatedCoords }));
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
      picklistCoordinates,
      id,
      data.width,
      data.height
    );
    dispatch(setPicklistCoordinates({ picklistCoordinates: updatedCoords }));
  };

  return picklistCoordinates.map((ele) => {
    if (ele.pageId !== activePageNumber) return null;

    const toolName = "PickList";
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
        iconPlacement="flex-end"
        toolIcon={
          <BsChevronDown
            className={`${toolName.toLowerCase()}-tool-icon-position`}
          />
        }
      />
    );
  });
};

export default PicklistCoordinatesContainer;
