import React, { useState, useRef, useEffect } from "react";
import PDF, { usePdf } from "react-pdf-js";

const PdfViewer = ({ pdf, activePage, setPDFLoading, setPageCount, scale }) => {
  const onDocumentComplete = (numPages) => {
    // console.log('@@@ PDF: PAGES: '+ numPages);
    if (numPages) {
      setPageCount(numPages);
      setPDFLoading(false);
    }
  };
  useEffect(()=>{
    setPDFLoading(true);
  },[])
  // const canvasEl = useRef(null)

  // const [loading, numPages] = usePdf({ref});

  // const [loading, numPages] = usePdf({ canvasEl, file: pdf,activePage });
  // console.log('@@@ REF '+loading);
  // console.log('@@@ REF '+ JSON.stringify(canvasEl));

  

  const onDocumentError = (err) => {
    console.error("pdf viewer error:", err);
  };

  const onPageComplete = () => {
    console.log("pageCOMPLETE");
  };

  return (
    <div className="pdff">
      {pdf ? (
        <PDF
          scale={scale}
          rotate={0}
          file={pdf} // Pass the Blob URL instead of the raw URL
          onDocumentComplete={onDocumentComplete}
          onDocumentError={onDocumentError}
          page={activePage + 1}
          onPageComplete={onPageComplete}
        />
      ) : (
        <p>Loading PDF...</p>
      )}
      {/* <PDF
        // style={{width:"100vw"}}
         
        scale={scale}
        rotate={0}
        file={pdf}
        onDocumentComplete={onDocumentComplete}
        onDocumentError={onDocumentError}
        page={activePage + 1}
        onPageComplete={onPageComplete}
      /> */}
    </div>
  );
};
export default PdfViewer;
