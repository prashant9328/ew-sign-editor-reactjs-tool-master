import { useDispatch, useSelector } from "react-redux";
import DragTool from "../../components/drag-tool";
import { BsEnvelope } from "react-icons/bs";
import { setActiveCoordinate } from "../../redux/slices/activeCoordinateReducer";
import {
  updateCoordinatePosition,
  updateCoordinateSize,
} from "../../utils/updateCoordinates";
import { setEmailBoxCoordinates } from "../../redux/slices/emailBoxCoordinatesReducer";

const EmailBoxCoordinatesContainer = (scrollContainer) => {
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

  const emailBoxCoordinates = useSelector(
    (state) => state.emailBoxCoordinatesReducer?.emailBoxCoordinates || []
  );

  function handleDragStart(id) {
    const emailBoxCoordinate = emailBoxCoordinates.find(
      (ele) => ele.eleId === id
    );

    if (emailBoxCoordinate) {
      dispatch(
        setActiveCoordinate({
          activeCoordinate: emailBoxCoordinate,
          isSelectionMode: true,
        })
      );
    }
  }

  function handleDragStop(id, data) {
    const updatedCoords = updateCoordinatePosition(
      emailBoxCoordinates,
      id,
      data.x,
      data.y
    );
    dispatch(setEmailBoxCoordinates({ emailBoxCoordinates: updatedCoords }));
  }

  function handleResize(id, data) {
    const updatedCoords = updateCoordinateSize(
      emailBoxCoordinates,
      id,
      data.width,
      data.height
    );
    dispatch(setEmailBoxCoordinates({ emailBoxCoordinates: updatedCoords }));
  }

  return emailBoxCoordinates.map((ele, index) => {
    if (ele.pageId === activePageNumber) {
      const toolName = "Email";
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
            <BsEnvelope
              className={`${toolName.toLowerCase()}-tool-icon-position`}
            />
          }
        />
      );
    }
  });
};

export default EmailBoxCoordinatesContainer;
