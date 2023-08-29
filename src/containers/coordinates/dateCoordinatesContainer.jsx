import React from "react";
import { useDispatch, useSelector } from "react-redux";
import DragTool from "../../components/drag-tool";
import { BsCalendar2Date } from "react-icons/bs";
import { setActiveCoordinate } from "../../redux/slices/activeCoordinateReducer";
import {
  updateCoordinatePosition,
  updateCoordinateSize,
} from "../../utils/updateCoordinates";
import { setDateCoordinates } from "../../redux/slices/dateCoordinatesReducer";

const DateCoordinatesContainer = (scrollContainer) => {
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

  const dateCoordinates = useSelector(
    (state) => state.dateCoordinates.dateCoordinates
  );

  function handleDragStart(id) {
    const dateCoordinate = dateCoordinates.find((ele) => ele.eleId === id);

    if (dateCoordinate) {
      dispatch(
        setActiveCoordinate({
          activeCoordinate: dateCoordinate,
          isSelectionMode: true,
        })
      );
    }
  }

  function handleDragStop(id, data) {
    const updatedCoords = updateCoordinatePosition(
      dateCoordinates,
      id,
      data.x,
      data.y
    );
    dispatch(setDateCoordinates({ dateCoordinates: updatedCoords }));
  }

  function handleResize(id, data) {
    const updatedCoords = updateCoordinateSize(
      dateCoordinates,
      id,
      data.width,
      data.height
    );
    dispatch(setDateCoordinates({ dateCoordinates: updatedCoords }));
  }

  return dateCoordinates.map((ele, index) => {
    if (ele.pageId === activePageNumber) {
      const toolName = "Date";
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
            <BsCalendar2Date
              className={`${toolName.toLowerCase()}-tool-icon-position`}
            />
          }
        />
      );
    }
  });
};

export default DateCoordinatesContainer;
