// import React,{useRef} from "react";
// import { useDispatch, useSelector } from "react-redux";
// import DragTool from "../../components/drag-tool";
// import { BsTextareaT } from "react-icons/bs";
// import { setActiveCoordinate } from "../../redux/slices/activeCoordinateReducer";
// import {
//   updateCoordinatePosition,
//   updateCoordinateSize,
// } from "../../utils/updateCoordinates";
// import { setTextBoxCoordinates } from "../../redux/slices/textBoxCoordinatesReducer";

// const TextBoxCoordinatesContainer = (scrollContainer) => {
//   const elementRef = useRef(null);

//   const dispatch = useDispatch();
//   const supportedFields = useSelector(
//     (state) => state.supportedFields.supportedFields
//   );

//   const activePageNumber = useSelector(
//     (state) => state.activePageNumber.activePageNumber
//   );

//   const activeCoordinate = useSelector(
//     (state) => state.activeCoordinate.activeCoordinate
//   );

//   const textBoxCoordinates = useSelector(
//     (state) => state.textBoxCoordinates.textBoxCoordinates
//   );

//   function handleDragStart(id) {
//     const textBoxCoordinate = textBoxCoordinates.find(
//       (ele) => ele.eleId === id
//     );

//     if (textBoxCoordinate) {
//       dispatch(
//         setActiveCoordinate({
//           activeCoordinate: textBoxCoordinate,
//           isSelectionMode: true,
//         })
//       );
//     }
//   }

//   function handleDragStop(id, data) {

//     // const parent = elementRef[id];
//     // const child = parent.querySelector(".drag-tool"); 
//     // console.log("ref props : ",child)    
    
//     const updatedCoords = updateCoordinatePosition(
//       textBoxCoordinates,
//       id,
//       data.x,
//       data.y
//     );
//     dispatch(setTextBoxCoordinates({ textBoxCoordinates: updatedCoords }));
//   }

//   function handleResize(id, data) {
//     const updatedCoords = updateCoordinateSize(
//       textBoxCoordinates,
//       id,
//       data.width,
//       data.height
//     );
//     dispatch(setTextBoxCoordinates({ textBoxCoordinates: updatedCoords }));
//   }

//   return textBoxCoordinates.map((ele, index) => {
//     if (ele.pageId === activePageNumber) {
//       const toolName = "Text";
//       const bgColor = ele.bgColor;
//       const field = supportedFields.find((field) => field.type === toolName);
//       return (
//         <div id={ele.eleId} ref={elementRef}>
//           <DragTool
//             key={index}
//             className="elementRef"
//             isEditMode={activeCoordinate && ele.eleId === activeCoordinate.eleId}
//             bounds={scrollContainer}
//             bgColor={bgColor}
//             toolType={toolName}
//             id={ele.eleId}
//             pageId={ele.pageId}
//             x={ele.x}
//             y={ele.y}
//             width={ele.width}
//             height={ele.height}
//             minWidth={field.minWidth}
//             minHeight={field.minHeight}
//             maxWidth={field.maxWidth}
//             maxHeight={field.maxHeight}
//             handleDragStart={(toolType, e) => handleDragStart(ele.eleId)}
//             handleDragStop={(data, e) => handleDragStop(ele.eleId, data)}
//             handleResize={(data, e) => handleResize(ele.eleId, data)}
//             toolIcon={
//               <BsTextareaT
//                 className={`${toolName.toLowerCase()}-tool-icon-position`}
//               />
//             }
//           />
//         </div>
//       );
//     }
//   });
// };

// export default TextBoxCoordinatesContainer;


import React from "react";
import { useDispatch, useSelector } from "react-redux";
import DragTool from "../../components/drag-tool";
import { BsTextareaT } from "react-icons/bs";
import { setActiveCoordinate } from "../../redux/slices/activeCoordinateReducer";
import {
  updateCoordinatePosition,
  updateCoordinateSize,
} from "../../utils/updateCoordinates";
import { setTextBoxCoordinates } from "../../redux/slices/textBoxCoordinatesReducer";

const TextBoxCoordinatesContainer = ({ scrollContainer }) => {
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

  const textBoxCoordinates = useSelector(
    (state) => state.textBoxCoordinates.textBoxCoordinates
  );

  function handleDragStart(id) {
    const textBoxCoordinate = textBoxCoordinates.find((ele) => ele.eleId === id);
    if (textBoxCoordinate) {
      dispatch(
        setActiveCoordinate({
          activeCoordinate: textBoxCoordinate,
          isSelectionMode: true,
        })
      );
    }
  }

  function handleDragStop(id, data) {
    const updatedCoords = updateCoordinatePosition(
      textBoxCoordinates,
      id,
      data.x,
      data.y
    );
    // dispatch(setTextBoxCoordinates({ textBoxCoordinates: updatedCoords }));
    setTimeout(() => {
      dispatch(setTextBoxCoordinates({ textBoxCoordinates: updatedCoords }));
    }, 0);
    dispatch(
      setActiveCoordinate({ activeCoordinate: {}, isSelectionMode: false })
    );
  }

  function handleResize(id, data) {
    const updatedCoords = updateCoordinateSize(
      textBoxCoordinates,
      id,
      data.width,
      data.height
    );
    setTimeout(() => {
      dispatch(setTextBoxCoordinates({ textBoxCoordinates: updatedCoords }));
    }, 0);
    dispatch(
      setActiveCoordinate({ activeCoordinate: {}, isSelectionMode: false })
    );  
  }

  return (
    <>
      {textBoxCoordinates.map((ele, index) => {
        if (ele.pageId !== activePageNumber) return null;

        const toolName = "Text";
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
              <BsTextareaT
                className={`${toolName.toLowerCase()}-tool-icon-position`}
              />
            }
          />
        );
      })}
    </>
  );
};

export default TextBoxCoordinatesContainer;
