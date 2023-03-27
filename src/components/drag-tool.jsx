import React, { useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";

// const style = {
//   position: "absolute",
//   display: "flex",
//   alignItems: "center",
//   paddingLeft: "10px",
//   border: "solid 1px #000000",
//   background: "rgb(28,95,156, 0.5)",
//   zIndex: 2,
// };

const DragTool = ({
  isEditMode = false,
  bgColor="rgb(28,95,156, 0.5)",
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
}) => {
  const currentElementref = useRef(null);
  const [currentState, setCurrentState] = useState({
    id: eleId,
    pageId: pageId,
    x: x,
    y: y,
    width: width,
    height: height,
  });

  return (
    <Rnd
      bounds=".document"
      className=".drag-tool"
      style={{ 
        position: "absolute", 
        display: "flex",
        alignItems: "center",
        paddingLeft: "10px",
        border: "solid 1px #000000",
        background: `${bgColor}`,
        zIndex: 2
      }}
      size={{ width: currentState.width, height: currentState.height }}
      position={{ x: currentState.x, y: currentState.y }}
      minWidth={minWidth}
      minHeight={minHeight}
      maxHeight={maxHeight}
      maxWidth={maxWidth}
      onDragStart={(e, d) => {
        handleDragStart(toolType, e);
      }}
      onDragStop={(e, d) => {
        setCurrentState({ ...currentState, x: d.x, y: d.y });
        handleDragStop({ x: d.x, y: d.y }, e);
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        setCurrentState({
          ...currentState,
          width: ref.style.width,
          height: ref.style.height,
          ...position,
        });

        handleResize(
          {
            width: ref.style.width,
            height: ref.style.height,
          },
          e
        );
      }}
    >
        {isEditMode ? 
        <>
      <div className="resize-circle tl-resize"></div>
      <div className="resize-circle tr-resize"></div>
      <div className="resize-circle br-resize"></div>
      <div className="resize-circle bl-resize"></div>
        </>
        : null}
      {toolIcon}
    </Rnd>
  );
};

export default DragTool;
