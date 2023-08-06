import React, {useState, useEffect} from "react";
import { useControls } from "react-zoom-pan-pinch";
import { TbZoomInFilled, TbZoomOutFilled } from "react-icons/tb";
import { BiChevronRight, BiChevronLeft } from "react-icons/bi";

export const Paggination = ({totalPage, activePage, handlePaggination
}) => {
  const { zoomIn, zoomOut } = useControls();

  //
  const [currentPageNo, setCurrentPageNo] = useState(1);
  const [leftArrowShown, setLeftArrowShown] = useState(currentPageNo > 1);
  const [rightArrowShown, setRightArrowShown] = useState(
    currentPageNo !== totalPage
  );

  useEffect(() => {
    setCurrentPageNo(activePage + 1);
    return () => {};
  }, [activePage]);

  useEffect(() => {
    if (currentPageNo) {
      console.log('currentPageNo: '+ currentPageNo);

      
      setLeftArrowShown(currentPageNo > 1);
      setRightArrowShown(currentPageNo !== totalPage);
    }

    return () => {};
  }, [currentPageNo]);

  const handleTextChange = (e) => {
    try {

      const value = e.target.value;

      var oldValue = currentPageNo;

      if (value === "") {
        setCurrentPageNo("");
        return;
      }

      if (value !== 0 && value <= totalPage) {
        setCurrentPageNo(parseInt(value));
        handlePaggination(parseInt(value) - 1);

      } else {
        setCurrentPageNo(oldValue);

      }
    } catch (err) {
      console.log(err);
    }
  };
  //
  const handleArrowKeyPress = (e) => {
    console.log('handleArrowKeyPress');
    const value = e.target.value;
    console.log('value new' +value);

    try {
      const { keyCode } = e;

      if (keyCode === 38) {
        // handle up arrow key
        if (currentPageNo < totalPage) {
          setCurrentPageNo(currentPageNo + 1);
          handlePaggination(parseInt(value));
        }

      } else if (keyCode === 40) {
        // handle down arrow key
        if (currentPageNo > 1) {
          setCurrentPageNo(currentPageNo - 1);
          handlePaggination(parseInt(value) - 2);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const navigateController = (type) => {
    console.log('@@ type: '+ type);
    console.log('@@ currentPageNo: '+ currentPageNo);
    switch (type) {
      case "back":
        if(leftArrowShown) {
          handlePaggination(currentPageNo - 2);
          setCurrentPageNo(currentPageNo - 1);
        } 
        break;
      case "next":
        if(rightArrowShown) {
          handlePaggination(currentPageNo);
          setCurrentPageNo(currentPageNo + 1);
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="pagination-container">
      <div className="pagination-inner-container shadow">
        <div className="px-1">
          <BiChevronLeft style={{color: leftArrowShown ? "white" : "gray", cursor: leftArrowShown ? "pointer" : "no-drop"}} onClick={() => {navigateController('back')}}/>
        </div>


        <input
          className="currentpage-shown-container form-control custom-font"
          value={currentPageNo}
          onChange={handleTextChange}
          onKeyDown={handleArrowKeyPress}
          max={totalPage}
          min={1}
        />
        <span className="text-light">/</span>
        <span className="text-light custom-font">{totalPage}</span>

        <div className="px-1">
          <BiChevronRight style={{color: rightArrowShown ? "white" : "gray", cursor: rightArrowShown ? "pointer" : "no-drop"}} onClick={() => {navigateController('next')}}/>
        </div>
  
        <div className="zoom-btn-container">
          <TbZoomOutFilled className="text-light" style={{cursor: "pointer"}} onClick={() => {zoomOut()}} />
          &nbsp;  
          <span className="text-light">zoom</span>
          &nbsp;  
          <TbZoomInFilled className="text-light" style={{cursor: "pointer"}} onClick={() => {zoomIn()}}/>
        </div>
      </div>
    </div>
  );
};