import React, { useEffect, useRef, useState } from "react";

export const Page = ({ page, dimensions, updateDimensions }) => {
  const canvasRef = useRef(null);
  const [width, setWidth] = useState((dimensions && dimensions.width) || 0);
  const [height, setHeight] = useState((dimensions && dimensions.height) || 0);

  useEffect(() => {
    const renderPage = async (p) => {
      const _page = await p;
      if (_page) {
        const context = canvasRef.current?.getContext("2d");
        const viewport = _page.getViewport({ scale: 1 });

        setWidth(viewport.width);
        setHeight(viewport.height);

        if (context) {
          await _page.render({
            canvasContext: canvasRef.current?.getContext("2d"),
            viewport,
          }).promise;

          const newDimensions = {
            width: viewport.width,
            height: viewport.height,
          };

          updateDimensions(newDimensions);
        }
      }
    };

    renderPage(page);
  }, [page, updateDimensions]);

  return (
    <div>
      <div className="mobile-canvas">

      <canvas className="mobile-canvas"
        ref={canvasRef}
        //  width={width} height={height}
        width={595}
        height={840}
        // style={{width:"100vw",height:"auto"}}
      />
      </div>
      <canvas 
      className="desktop-canvas"
        ref={canvasRef}
        //  width={width} height={height}
        width={595}
        height={840}
      />
    </div>
  );
};
