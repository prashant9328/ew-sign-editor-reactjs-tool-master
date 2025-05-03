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