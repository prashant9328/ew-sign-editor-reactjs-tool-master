import React from "react";
import { useDispatch, useSelector } from "react-redux";
import DragTool from "../../components/drag-tool";
import {
    setActiveCoordinate
  } from "../../redux/slices/activeCoordinateReducer";
import { updateCoordinatePosition, updateCoordinateSize } from "../../utils/updateCoordinates";
import {
    setCheckBoxCoordinates
} from "../../redux/slices/checkBoxCoordinatesReducer";

const CheckBoxCoordinatesContainer = (scrollContainer) => {
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

    const checkBoxCoordinates = useSelector(
        (state) => state.checkBoxCoordinates.checkBoxCoordinates
    );

    function handleDragStart(id) {
        const checkBoxCoordinate = checkBoxCoordinates.find((ele) => ele.eleId === id);

        if(checkBoxCoordinate) {
            dispatch(setActiveCoordinate({activeCoordinate: checkBoxCoordinate, isSelectionMode: true}));
        }
    }

    function handleDragStop(id, data) {
        const updatedCoords = updateCoordinatePosition(checkBoxCoordinates, id, data.x, data.y);
        dispatch(setCheckBoxCoordinates({checkBoxCoordinates: updatedCoords}));
    }

    function handleResize(id, data) {
        const updatedCoords = updateCoordinateSize(checkBoxCoordinates, id, data.width, data.height);
        dispatch(setCheckBoxCoordinates({checkBoxCoordinates: updatedCoords}));
    }

    return (
        checkBoxCoordinates.map((ele) => {
            if (ele.pageId === activePageNumber) {
                const toolName = "Checkbox";
                const bgColor = ele.bgColor;
                const field = supportedFields.find(
                    (field) => field.type === toolName
                );
                return (
                    <DragTool
                    isEditMode={
                        activeCoordinate &&
                      ele.eleId === activeCoordinate.eleId
                    }
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
                    handleDragStart={(toolType, e) =>
                      handleDragStart(ele.eleId)
                    }
                    handleDragStop={(data, e) =>
                      handleDragStop(ele.eleId, data)
                    }
                    handleResize={(data, e) =>
                      handleResize(ele.eleId, data)
                    }
                    toolIcon={
                        <></>
                    }
                  />
                )
            }
        })

    );
}

export default CheckBoxCoordinatesContainer;