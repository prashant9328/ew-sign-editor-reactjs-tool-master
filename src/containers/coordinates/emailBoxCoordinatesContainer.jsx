import { useDispatch, useSelector } from "react-redux";
import DragTool from "../../components/drag-tool";
import { BsEnvelope } from "react-icons/bs";
import { setActiveCoordinate } from "../../redux/slices/activeCoordinateReducer";
import {
  updateCoordinatePosition,
  updateCoordinateSize,
} from "../../utils/updateCoordinates";
import { setEmailBoxCoordinates } from "../../redux/slices/emailBoxCoordinatesReducer";

const EmailBoxCoordinatesContainer = ({ scrollContainer }) => {
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

  const handleDragStart = (id) => {
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
  };

  const handleDragStop = (id, data) => {
    if (!data || typeof data.x !== "number" || typeof data.y !== "number") {
      console.error("Invalid drag data:", data);
      return;
    }

    const updatedCoords = updateCoordinatePosition(
      emailBoxCoordinates,
      id,
      data.x,
      data.y
    );
    dispatch(setEmailBoxCoordinates({ emailBoxCoordinates: updatedCoords }));
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
      emailBoxCoordinates,
      id,
      data.width,
      data.height
    );
    dispatch(setEmailBoxCoordinates({ emailBoxCoordinates: updatedCoords }));
  };

  return emailBoxCoordinates.map((ele) => {
    if (ele.pageId !== activePageNumber) return null;

    const toolName = "Email";
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
          <BsEnvelope
            className={`${toolName.toLowerCase()}-tool-icon-position`}
          />
        }
      />
    );
  });
};

export default EmailBoxCoordinatesContainer;
