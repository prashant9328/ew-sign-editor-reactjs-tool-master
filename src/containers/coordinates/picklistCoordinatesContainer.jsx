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

const PicklistCoordinatesContainer = (scrollContainer) => {
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

  function handleDragStart(id) {
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
  }

  function handleDragStop(id, data) {
    const updatedCoords = updateCoordinatePosition(
      picklistCoordinates,
      id,
      data.x,
      data.y
    );
    dispatch(setPicklistCoordinates({ picklistCoordinates: updatedCoords }));
  }

  function handleResize(id, data) {
    const updatedCoords = updateCoordinateSize(
      picklistCoordinates,
      id,
      data.width,
      data.height
    );
    dispatch(setPicklistCoordinates({ picklistCoordinates: updatedCoords }));
  }

  return picklistCoordinates.map((ele, index) => {
    if (ele.pageId === activePageNumber) {
      const toolName = "PickList";
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
          iconPlacement="flex-end"
          toolIcon={
            <BsChevronDown
              className={`${toolName.toLowerCase()}-tool-icon-position`}
            />
          }
        />
      );
    }
  });
};

export default PicklistCoordinatesContainer;
