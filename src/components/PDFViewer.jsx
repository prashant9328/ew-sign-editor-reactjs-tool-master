import React, {useState, useRef} from "react";
import '../App.css';
import PDF, {usePdf} from "react-pdf-js";
const PdfViewer = ({pdf,activePage, setPDFLoading})=> {  
    const onDocumentComplete = (numPages) =>{
        if(numPages){
            setPDFLoading(false);    
        }
    }

    // const canvasEl = useRef(null)
    
    // const [loading, numPages] = usePdf({ref});
    
    // const [loading, numPages] = usePdf({ canvasEl, file: pdf,activePage });
    // console.log('@@@ REF '+loading);
    // console.log('@@@ REF '+ JSON.stringify(canvasEl));
    const onDocumentError = (err) => {
      console.error('pdf viewer error:', err);
    }

    const onPageComplete = () =>{
      console.log('pageCOMPLETE');
    }
    return (
    <div className="pdfWrapper">
        <PDF
            rotate={0}
            file={pdf}
            onDocumentComplete={onDocumentComplete}
            onDocumentError={onDocumentError}
            page={activePage+1}
            onPageComplete={onPageComplete}
            
        />
         
    </div>
    
    )
  
};
export default PdfViewer;