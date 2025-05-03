// import React, { useEffect, useRef, useState } from "react";
// import { Rnd } from "react-rnd";

// const DragTool = ({
//   isEditMode = false,
//   enableResizing = true,
//   bgColor="rgb(28,95,156, 0.5)",
//   toolType,
//   toolIcon,
//   eleId,
//   pageId,
//   x,
//   y,
//   width,
//   height,
//   minWidth,
//   minHeight,
//   maxHeight,
//   maxWidth,
//   handleDragStart,
//   handleDragStop,
//   handleResize,
//   iconPlacement = "flex-start",
// }) => {  
//   const currentElementref = useRef(null);
//   const [currentState, setCurrentState] = useState({
//     id: eleId,
//     pageId: pageId,
//     x: x,
//     y: y,
//     width: width,
//     height: height,
//   });
  
//   return (
//     <Rnd
//       // bounds=".document"
//       className=".drag-tool"
//       style={{ 
//         position: "absolute", 
//         display: "flex",
//         alignItems: "center",
//         justifyContent: iconPlacement,
//         padding:  "0px 10px",
//         border: "solid 1px #000000",
//         background: `${bgColor}`,
//         zIndex: 9999
//       }}
//       enableResizing={enableResizing}
//       size={{ width: currentState.width, height: currentState.height }}
//       position={{ x: currentState.x<0 ? '0':currentState.x > 595-currentState.width? 595-currentState.width: currentState.x, y: currentState.y<0? '0':currentState.y> 840 - currentState.height ? 840 - currentState.height : currentState.y }}
//       minWidth={minWidth}
//       minHeight={minHeight}
//       // maxHeight={maxHeight}
//       // maxWidth={maxWidth}
//       onDragStart={(e, d) => {                
//         handleDragStart(toolType, e);
//       }}
//       onDragStop={(e, d) => {        
//         // setCurrentState({ ...currentState, x: d.x, y: d.y });
//         // handleDragStop({ x: d.x, y: d.y }, e);

//         ref.style.transform.translate(x,y)
//       }}
//       onResizeStop={(e, direction, ref, delta, position) => {
//         let width = parseInt(ref.style.width.substring(0, ref.style.width.length-2));
//         let height = parseInt(ref.style.height.substring(0, ref.style.height.length-2));

//         setCurrentState({
//           ...currentState,
//           width: width,
//           height: height,
//           ...position,
//         });

//         handleResize(
//           {
//             width: width,
//             height: height,
//           },
//           e
//         );
//       }}
//     >
//         {isEditMode ? 
//         <>
//           <div className="resize-circle tl-resize"></div>
//           <div className="resize-circle tr-resize"></div>
//           <div className="resize-circle br-resize"></div>
//           <div className="resize-circle bl-resize"></div>
//         </>
//         : null}
//       {toolIcon}
//     </Rnd>
//   );
// };

// export default DragTool;


import React from "react";
import { Rnd } from "react-rnd";

const DragTool = ({
  isEditMode = false,
  enableResizing = true,
  bgColor = "rgb(28,95,156, 0.5)",
  toolType,
  toolIcon,
  eleId,
  pageId,
  x,
  y,
  width,
  height,
  minWidth,
  minHeight,
  maxHeight,
  maxWidth,
  handleDragStart,
  handleDragStop,
  handleResize,
  iconPlacement = "flex-start",
}) => {
  return (
    <Rnd
      className="drag-tool"
      style={{
        position: "absolute",
        display: "flex",
        alignItems: "center",
        justifyContent: iconPlacement,
        padding: "0px 10px",
        border: "solid 1px #000000",
        background: `${bgColor}`,
        zIndex: 9999,
      }}
      enableResizing={enableResizing}
      size={{ width, height }}
      position={{
        x: x < 0 ? 0 : x > 595 - width ? 595 - width : x,
        y: y < 0 ? 0 : y > 840 - height ? 840 - height : y,
      }}
      minWidth={minWidth}
      minHeight={minHeight}
      maxWidth={maxWidth}
      maxHeight={maxHeight}
      onDragStart={(e, d) => {
        handleDragStart(toolType, e);
      }}
      onDragStop={(e, d) => {
        handleDragStop(eleId, { x: d.x, y: d.y });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        const newWidth = parseInt(ref.style.width, 10);
        const newHeight = parseInt(ref.style.height, 10);

        handleResize(
          {
            width: newWidth,
            height: newHeight,
            ...position,
          },
          e
        );
      }}
    >
      <div style={{ width: "100%", height: "100%" }}>
        {isEditMode && (
          <>
            <div className="resize-circle tl-resize"></div>
            <div className="resize-circle tr-resize"></div>
            <div className="resize-circle br-resize"></div>
            <div className="resize-circle bl-resize"></div>
          </>
        )}
        {toolIcon}
      </div>
    </Rnd>
  );
};

export default DragTool;

