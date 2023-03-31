import * as React from "react";
import { RiBallPenLine, RiSuitcaseLine } from "react-icons/ri";
import {
  BsCalendar2Date,
  BsTextareaT,
  BsCheck2Square,
  BsBuildings,
} from "react-icons/bs";
import { BiUser } from "react-icons/bi";
import { MdOutlineAlternateEmail, MdDelete } from "react-icons/md";
import DragTool from "../components/drag-tool";
import ProgressIndicator from "../components/progress-indicator";
import CustomSelect from "../components/custom-select";
import { useSearchParams } from "react-router-dom";
import PdfViewer from '../components/PDFViewer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  // Temporary
  const colors = ["rgba(28, 95, 156, 0.5)", "rgba(255, 110, 49, 0.5)", "rgba(33, 255, 255, 0.5)", "rgba(64, 66, 88, 0.5)", "rgba(60, 207, 78, 0.5)"];
  const [options, setOptions] = React.useState([]);
  const [signatoryIdList, setSignatoryIdList] = React.useState([]);
  
  const [selectedEleUserDefaultValue, setSelectedEleUserDefaultValue] = React.useState(options[0]);
  const [searchParams] = useSearchParams();

  const [isPDFLoading, setIsPDFLoading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isFetching, setIsFetching] = React.useState(true);
  const [isFileShared, setIsFileShared] = React.useState(false);
  const [isToolSelectionMode, setIsToolSelectionMode] = React.useState(false);
  const [selectedElement, setSelectedElement] = React.useState({});

  const uuid = searchParams.get("uuid");
  const uuid_template_instance = searchParams.get("uuid_template_instance");
  const userId = searchParams.get("userid");

  const [activePage, setActivePage] = React.useState(0);
  const [imgLst, setImgLst] = React.useState([
    // 'https://cdn.glitch.global/5790e45e-8028-494f-9443-fac72a396419/Signature_Image.jpg?v=1676700133928',
  ]);
  const [img, setImg] = React.useState(null);
  //fields
  const [fields, setFields] = React.useState([]);

  // SIGNATURE TOOL
  const signEleDimension = {width: 130, height: 29, minWidth: 130, minHeight: 29, maxWidth: 300, maxHeight: 130};
  const [signEleCount, setSignEleCount] = React.useState(0);
  const [signElems, setSignElems] = React.useState([]);

  // Text Tool
  const textEleDimension = {width: 130, height: 26, minWidth: 85, minHeight: 29, maxWidth: 500, maxHeight: 30};
  const [textEleCount, setTextEleCount] = React.useState(0);
  const [textElems, setTextElems] = React.useState([]);

  // Date Tool
  const dateEleDimension = {width: 130, height: 26, minWidth: 120, minHeight: 29, maxWidth: 120, maxHeight: 30};
  const [dateEleCount, setDateEleCount] = React.useState(0);
  const [dateElems, setDateElems] = React.useState([]);
  const [previousCoord, setPreviousCoord] = React.useState({x: 0, y:0});

  React.useEffect(() => {
    //const uuid = JSON.parse(localStorage.getItem('data'));
    console.log(window.location.href);

    console.log("@@@ UUID: " + uuid);
    console.log("@@@ uuid_template_instance: " + uuid_template_instance);
    console.log("@@@ userId: " + userId);

    const data = {
      uuid: uuid,
      salesforceUserId: userId,
      uuid_template_instance: uuid_template_instance,
    };
    // setIsLoading(false);
    fetch(`${process.env.REACT_APP_API_URL}/api/fetchImagesData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((response) => {
        const tempArr = [];
        console.log("@@@ DATA FROM SERVER: " + JSON.stringify(response));

        // TODO: Add all elements which were saved by user previously.
        let data = response.data;
        // {"id":1,"name":"signatureBlock","type":"Signature","is_required":1,"default_height":100,"default_width":150}

        // if(data.allFieldsData != null && data.allFieldsData.length>0) {
        //   const tempFields = [];
        //   data.allFieldsData.forEach(fieldData => {
        //     tempFields.push({id: fieldData.id, name: fieldData.name, type: fieldData.type, width: signEleDimension.width, height: signEleDimension.height, minWidth: signEleDimension.minWidth, minHeight: signEleDimension.minHeight, maxWidth: signEleDimension.maxWidth, maxHeight: signEleDimension.maxHeight});
        //   });
        //   setFields(tempFields);
        // }
        setFields([
          {id: 1, name: 'Signature', type: 'Signature', width: signEleDimension.width, height: signEleDimension.height, minWidth: signEleDimension.minWidth, minHeight: signEleDimension.minHeight, maxWidth: signEleDimension.maxWidth, maxHeight: signEleDimension.maxHeight},
          {id: 2, name: 'Text', type: 'Text', width: textEleDimension.width, height: textEleDimension.height, minWidth: textEleDimension.minWidth, minHeight: textEleDimension.minHeight, maxWidth: textEleDimension.maxWidth, maxHeight: textEleDimension.maxHeight},
          {id: 4, name: 'Date', type: 'Date', width: dateEleDimension.width, height: dateEleDimension.height, minWidth: dateEleDimension.minWidth, minHeight: dateEleDimension.minHeight, maxWidth: dateEleDimension.maxWidth, maxHeight: dateEleDimension.maxHeight}
        ]);

        if(data.signatoryList != null && data.signatoryList.length>0) {
          let signatoryList = [];
          let signatoryIdList = [];
          data.signatoryList.forEach((signatory, index) => {
            signatory.bgColor = colors[index];
            signatory.id = signatory.id;
            signatory.value = signatory.name;
            signatory.label = signatory.name;
            signatoryList.push(signatory);
            signatoryIdList.push(signatory.id);
          })
          console.log('###'+JSON.stringify(signatoryList));
          setOptions(signatoryList);
          setSignatoryIdList(signatoryIdList);
        }
        if (data.cordinatesData != null && data.cordinatesData.length > 0) {
          let tempSignElems = [];
          let tempTextElems = [];
          let tempDateElems = [];
          data.cordinatesData.forEach((coord) => {
            const field = fields.find(field => field.id === coord.field_id);
            console.log('@@@ OPTION: '+ JSON.stringify(options));
            const option = options[coord.userIndex];
            const bgColor = option.bgColor;
            switch (field.name) {
              case "Signature":
                tempSignElems.push(
                  signElems.concat({
                    field_id: field.id,
                    signatory_id: coord.signatory_id,
                    bgColor: bgColor,
                    name: `Signature${signEleCount + 1}`,
                    eleId: `signEle${signEleCount}`,
                    pageId: coord.pageId,
                    x: coord.x,
                    y: coord.y,
                    width: coord.width,
                    height: coord.height,
                  })
                );
                setSignEleCount(signEleCount+1);
                break;
              case "Text":
                tempTextElems.push(
                  textElems.concat({
                    field_id: field.id,
                    signatory_id: coord.signatory_id,
                    bgColor: bgColor,
                    name: `Text${textEleCount + 1}`,
                    eleId: `textEle${textEleCount}`,
                    pageId: coord.pageId,
                    x: coord.x,
                    y: coord.y,
                    width: coord.width,
                    height: coord.height,
                  })
                );
                setTextEleCount(textEleCount+1);
                break;
              case "Date":
                tempDateElems.push(
                  dateElems.concat({
                    field_id: field.id,
                    signatory_id: coord.signatory_id,
                    bgColor: bgColor,
                    name: `Date${dateEleCount + 1}`,
                    eleId: `dateEle${dateEleCount}`,
                    pageId: coord.pageId,
                    x: coord.x,
                    y: coord.y,
                    width: coord.width,
                    height: coord.height,
                  })
                );
                setDateElems(dateEleCount+1);
                break;
              default:
                break;
            }
          });
          setSignElems(tempSignElems);
          setTextElems(tempTextElems);
          setDateElems(tempDateElems);
        }

        data.images.forEach((file) => {
          console.log("@@@ PATH: " + file.path);
          tempArr.push(file.path);
        });
        setImgLst(tempArr);
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      });
  }, []);

  React.useEffect(() => {
    getImage(activePage);
  }, [imgLst]); 

  function showToast(type, message) {
    switch (type) {
      case 'info':
        toast.info(message);
        break;
      case 'success':
        toast.success(message);
        break;
      case 'warn':
          toast.warn(message);
          break;
      case 'error':
        toast.error(message);
        break;
      default:
        toast(message);
        break;
    }
  } 

  function validateCoordinates(finalCoordData) {
    for(let id=0; id<signatoryIdList.length; id++) {
      if(finalCoordData.find(coord => coord.signatory_id === signatoryIdList[id])) {
        return true;
      }
    }
    return false;
  }

  function changeMode(selectedEle, isEditMode) {
    setSelectedElement(selectedEle);
    setIsToolSelectionMode(isEditMode);
    setSelectedEleUserDefaultValue(options[0]);
  }

  function handleSignatoryChange(fieldType, effect, e) {
    console.log('@@@ handleSignatoryChange: fieldType: '+ fieldType);
    console.log('@@@ handleSignatoryChange: effect: '+ effect);
    console.log('@@@ handleSignatoryChange: value: '+ JSON.stringify(e));

    switch (fieldType) {
      case "Signature":
        setSignElems(
          signElems.map((ele) => {
            if(ele.eleId === selectedElement.eleId) {
              ele.signatory_id = e.id;
              selectedElement.bgColor = ele.bgColor = e.bgColor;
            }
            return ele;
          })
        );

        break;
      case "Text":
        setTextElems(
          textElems.map((ele) => {
            if(ele.eleId === selectedElement.eleId) {
              ele.signatory_id = e.id;
              selectedElement.bgColor = ele.bgColor = e.bgColor;
            }
            return ele;
          })
        )
        break;
      case "Date":
        setDateElems(
          dateElems.map((ele) => {
            if(ele.eleId === selectedElement.eleId) {
              ele.signatory_id = e.id;
              selectedElement.bgColor = ele.bgColor = e.bgColor;
            }
            return ele;
          })
        )
        break;
    
      default:
        break;
    }
    setSelectedEleUserDefaultValue(options.filter(option => option.id === selectedElement.signatory_id));
  }

  function handleEleDelete() {
    console.log("@@@ selectedElement: DELETE: " + JSON.stringify(selectedElement));

    let foundField = fields.find(
      (field) => field.id === selectedElement.field_id
    );

    switch (foundField.name) {
      case "Signature": {
        setSignElems(
          signElems.filter((ele) => ele.eleId !== selectedElement.eleId)
        );
        break;
      }
      case "Text": {
        setTextElems(
          textElems.filter((ele) => ele.eleId !== selectedElement.eleId)
        );
        break;
      }
      case "Date": {
        setDateElems(
          dateElems.filter((ele) => ele.eleId !== selectedElement.eleId)
        );
        break;
      }
      default: {
        break;
      }
    }
    changeMode({}, false);
    console.log("@@@ signElems: AFTER DELETE " + JSON.stringify(signElems));
  }

  function handleSelectedEleNameChange(event) {
    // selected element
    switch (selectedElement.type) {
      case "Signature": {
        setSignElems(signElems.map((ele) => (ele.name = event.target.value)));
        break;
      }
      case "Text": {
        setTextElems(textElems.map((ele) => (ele.name = event.target.value)));
        break;
      }
      case "Date": {
        setDateElems(dateElems.map((ele) => (ele.name = event.target.value)));
        break;
      }
      default: {
        break;
      }
    }
  }

  function addNewElement(fieldId, name, eleId, width, height) {
    setSelectedEleUserDefaultValue(options[0]);
    setPreviousCoord({x: previousCoord.x + 30, y: previousCoord.y + 30});
    return {
      field_id: fieldId,
      signatory_id: options[0].id,
      bgColor: colors[0],
      name: name,
      eleId: eleId,
      pageId: activePage,
      x: previousCoord.x,
      y: previousCoord.y,
      width: width,
      height: height,
    };
  }

  function handleSignToolClick(event) {
    console.log("@@@ SIGN tool is selected!!! ");
    switch (event.detail) {
      case 1: {
        console.log("Single click");
        let newSignEle = addNewElement(
          1,
          `Signature${signEleCount + 1}`,
          `signEle${signEleCount}`,
          signEleDimension.width,
          signEleDimension.height
        );
        setSignElems(signElems.concat(newSignEle));
        setSignEleCount(signEleCount + 1);
        changeMode(newSignEle, true);
        break;
      }
      case 2: {
        console.log("Double click");
        break;
      }
      default: {
        break;
      }
    }
  }

  function handleTextBoxToolClick(event) {
    console.log("@@@ TEXT tool is selected!!! ");
    switch (event.detail) {
      case 1: {
        console.log("Single click");
        let newTextEle = addNewElement(
          2,
          `Text${textEleCount + 1}`,
          `textEle${textEleCount}`,
          textEleDimension.width,
          textEleDimension.height
        );
        setTextElems(textElems.concat(newTextEle));
        setTextEleCount(textEleCount + 1);
        changeMode(newTextEle, true);
        break;
      }
      case 2: {
        console.log("Double click");
        break;
      }
      default: {
        break;
      }
    }
  }

  function handleDateBoxToolClick(event) {
    console.log("@@@ DATE tool is selected!!! ");
    switch (event.detail) {
      case 1: {
        console.log("Single click");
        let newDateEle = addNewElement(
          3,
          `Date${dateEleCount + 1}`,
          `dateEle${dateEleCount}`,
          dateEleDimension.width,
          dateEleDimension.height
        );
        setDateElems(dateElems.concat(newDateEle));
        setDateEleCount(dateEleCount + 1);
        changeMode(newDateEle, true);
        break;
      }
      case 2: {
        console.log("Double click");
        break;
      }
      default: {
        break;
      }
    }
  }

  function handleDragStart(id, toolType, e) {
    console.log("@@@ handleDragStart");
    console.log("@@@ Id: handleDragStart: " + id);
    console.log("@@@ toolType: handleDragStart: " + toolType);
    console.log('@@@ SELECTED ELE: '+JSON.stringify(selectedElement));
    let ele;

    switch (toolType) {
      case "Signature": {
        ele = signElems.filter((ele) => ele.eleId === id);
        break;
      }
      case "Text": {
        ele = textElems.filter((ele) => ele.eleId === id);
        break;
      }
      case "Date": {
        ele = dateElems.filter((ele) => ele.eleId === id);
        break;
      }
      default: {
        break;
      }
    }
    console.log("@@@ ELE : " + JSON.stringify(ele));
    console.log("@@@ options : " + JSON.stringify(options));
    setSelectedElement(ele[0]);
    setIsToolSelectionMode(true);
    setSelectedEleUserDefaultValue(options.filter(option => option.id === ele[0].signatory_id));
    // changeMode(ele[0], true);
  }

  function handleDragStop(id, toolType, data, e) {
    // console.log("@@@ Data : Parent : handleDragStop : " + JSON.stringify(data));
    // console.log("@@@ toolType : Parent : handleDragStop : " + toolType);
    // console.log("@@@ Id: " + id);
    // PDF VIEWER - Width: 612px, height: 792px
    const pdfWidth = document.getElementsByTagName('canvas')[0].width;
    const pdfHeight = document.getElementsByTagName('canvas')[0].height;

    setPreviousCoord({x: data.x+30, y: data.y+30});
    switch (toolType) {
      case "Signature": {
          signElems.map((ele) => {
            //console.log(ele.eleId);
            if (ele.eleId === id) {
              const x = data.x + ele.width;
              const y = data.y + ele.height;

              ele.x = data.x;
              ele.y = data.y;
              ele.x = x < 0 ? 0 : (x > pdfWidth ? pdfWidth : data.x);
              ele.y = y < 0 ? 0 : (y > pdfHeight ? pdfHeight : data.y);
              return ele;
            }
          })
        break;
      }
      case "Text": {
          textElems.map((ele) => {
            //console.log(ele.eleId);
            if (ele.eleId === id) {
              ele.x = data.x;
              ele.y = data.y;
              return ele;
            }
          })
        break;
      }
      case "Date": {
          dateElems.map((ele) => {
            console.log(ele.eleId);
            if (ele.eleId === id) {
              ele.x = data.x;
              ele.y = data.y;
              return ele;
            }
          })
        break;
      }

      default: {
        break;
      }
    }
    //setIsToolSelectionMode(true);
    console.log("@@@ signElems : Parent : handleDragStop : " + JSON.stringify(signElems));
    return;
  }

  function handleResize(id, toolType, data, e) {
    console.log("@@@ Data : Parent : handleResize : " + JSON.stringify(data));
    console.log("@@@ toolType : Parent : handleDragStop : " + toolType);

    switch (toolType) {
      case "Signature": {
          signElems.map((ele) => {
            console.log(ele.eleId);
            if (ele.eleId === id) {
              ele.width = data.width;
              ele.height = data.height;
              return ele;
            }
          })
        break;
      }
      case "Text": {
        
          textElems.map((ele) => {
            console.log(ele.eleId);
            if (ele.eleId === id) {
              ele.width = data.width;
              ele.height = data.height;
              return ele;
            }
          })
        
        break;
      }
      case "Date": {
       
          dateElems.map((ele) => {
            console.log(ele.eleId);
            if (ele.eleId === id) {
              ele.width = data.width;
              ele.height = data.height;
              return ele;
            }
          })
        
        break;
      }
      default: {
        break;
      }
    }
  }

  function handlePaggination(index) {
    console.log("@@@ handlePaggination: " + index);
    console.log("@@@ activePage: " + activePage);
    console.log("@@@ Data: " + JSON.stringify(signElems));
    console.log("@@@ Selected Ele: " + JSON.stringify(selectedElement));
    if (index === activePage) return;
    setActivePage(index);
    getImage(index);
  }

  const getImage = async (index) => {
    setImg(imgLst[index]);
  };

  function handleContinue() {
    setIsLoading(true);
    setIsFetching(false);
    console.log("@@@ handleContinue.");
    console.log("@@@ FINAL MAPPING OBJECT: signElems: " + JSON.stringify(signElems));
    console.log("@@@ FINAL MAPPING OBJECT: textElems: " + JSON.stringify(textElems));
    console.log("@@@ FINAL MAPPING OBJECT: dateElems: " + JSON.stringify(dateElems));
    const finalCoordData = [...signElems, ...textElems, ...dateElems];
    console.log('@@@ finalCoordData: '+ JSON.stringify(finalCoordData));
    console.log('@@@ validateCoordinates: ' + validateCoordinates(finalCoordData));
    console.log('@@@ signatoryIdList: ' + JSON.stringify(signatoryIdList));

    const isValid = validateCoordinates(finalCoordData);
    console.log('@@@ isValid: '+ isValid);

    if(!isValid) {
      setIsLoading(false);
      showToast('error', 'Please add atleast one field for each user.');
    }

    if(isValid) {
      const body = {
        uuid_template_instance: uuid_template_instance,
        // TODO: Merge all types of element and send a object data.
        data: finalCoordData,
      };
  
      console.log('@@@ body: handleContinue: '+JSON.stringify(body));
      // setIsLoading(false);
      fetch(`${process.env.REACT_APP_API_URL}/api/submitCordinatesData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then((response) => {
          console.log(JSON.stringify(response));
        })
        .catch((error) => {
          console.log("@@@ Saved coordinate: " + JSON.stringify(error));
        })
        .finally(() => {
          setIsFileShared(true);
          setIsLoading(false);
        });
    }
  }

  return (
    <>
      <ToastContainer 
        position="top-center"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {isLoading || isPDFLoading ? (
        <div
          style={{
            position: "fixed",
            zIndex: 5,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#E8EFF5",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
              width: "100vw",
              flexDirection: "column",
            }}
          >
            <img src="https://media3.giphy.com/media/l7WGk7wh05yz1sTQNC/200w.gif" />
            {isFetching ? <h4>Fetching...</h4> : <h4>Saving...</h4>}
          </div>
        </div>
      ) : null}

      {isFileShared ? (
        <div
          style={{
            position: "absolute",
            zIndex: 5,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#E8EFF5",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
              width: "100vw",
              flexDirection: "column",
            }}
          >
            <img src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExNTkxODQ2YzNhNGQ3MmY4YTkxN2ZiMzEzODAyMTA5OWI4Yzk3ZDk1OSZjdD1z/I5dflEG9U9haQ3fUUv/giphy.gif" />
          </div>
        </div>
      ) : (
        <div className="container">
          <div className="left-sidebar">
            <div>
              {/* <div className="tools-title">Signer</div>
              <CustomSelect options={options} name="signatory"></CustomSelect> */}
              <div className="tools-title">Signature fields</div>
              <div className="signature-tool">
                <button
                  type="button"
                  className="tool-btn signature-btn working-btn"
                  onClick={handleSignToolClick}
                >
                  <RiBallPenLine className="tool-icon" />{" "}
                  <p style={{ marginLeft: "12px", color: "#ffffff" }}>
                    Signature
                  </p>
                </button>

                <button
                  type="button"
                  className="tool-btn btn-margin disabled-btn"
                >
                  <RiBallPenLine className="tool-icon" />{" "}
                  <p style={{ marginLeft: "12px", color: "#ffffff" }}>
                    Initails
                  </p>
                </button>
              </div>
              <div className="tools-title">Standard fields</div>
              <div className="standard-tool">
                <button
                  type="button"
                  className="tool-btn btn-margin working-btn"
                  onClick={handleTextBoxToolClick}
                >
                  <BsTextareaT className="tool-icon" />{" "}
                  <p style={{ marginLeft: "12px", color: "#ffffff" }}>
                    Text
                  </p>
                </button>

                <button
                  type="button"
                  className="tool-btn btn-margin working-btn"
                  onClick={handleDateBoxToolClick}
                >
                  <BsCalendar2Date className="tool-icon" />
                  <p style={{ marginLeft: "12px", color: "#ffffff" }}>
                    Date
                  </p>
                </button>
                <button
                  type="button"
                  className="tool-btn btn-margin disabled-btn"
                  // onClick={handleCheckBoxToolClick}
                >
                  <BsCheck2Square className="tool-icon" />{" "}
                  <p style={{ marginLeft: "12px", color: "#ffffff" }}>
                    Checkbox
                  </p>
                </button>
              </div>
              <div className="tools-title">Auto-fill fields</div>
              <div className="standard-tool">
                <button
                  type="button"
                  className="tool-btn btn-margin disabled-btn"
                >
                  <BsCalendar2Date className="tool-icon" />{" "}
                  <p style={{ marginLeft: "12px", color: "#ffffff" }}>
                    Date Signed
                  </p>
                </button>

                <button
                  type="button"
                  className="tool-btn btn-margin disabled-btn"
                >
                  <BiUser className="tool-icon" />{" "}
                  <p style={{ marginLeft: "12px", color: "#ffffff" }}>
                    Full Name
                  </p>
                </button>

                <button
                  type="button"
                  className="tool-btn btn-margin disabled-btn"
                >
                  <MdOutlineAlternateEmail className="tool-icon" />{" "}
                  <p style={{ marginLeft: "12px", color: "#ffffff" }}>Email</p>
                </button>

                <button
                  type="button"
                  className="tool-btn btn-margin disabled-btn"
                >
                  <BsBuildings className="tool-icon" />{" "}
                  <p style={{ marginLeft: "12px", color: "#ffffff" }}>
                    Company
                  </p>
                </button>

                <button
                  type="button"
                  className="tool-btn btn-margin disabled-btn"
                >
                  <RiSuitcaseLine className="tool-icon" />{" "}
                  <p style={{ marginLeft: "12px", color: "#ffffff" }}>
                    Job Title
                  </p>
                </button>
              </div>
            </div>
          </div>
          <div>
            <div className="document" id="center-img-div">
              {signElems.map((ele) => {
                // console.log('@@@ RENDERING SIGNATURE: '+ JSON.stringify(ele));
                if (ele.pageId === activePage) {
                  let toolName = "Signature";
                  let bgColor = ele.bgColor;
                  let field = fields.find(field => field.type === 'Signature');
                  return (
                    <DragTool
                      isEditMode={ele.eleId === selectedElement.eleId}
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
                      handleDragStart={(toolType, e) =>
                        handleDragStart(ele.eleId, toolType, e)
                      }
                      handleDragStop={(data, e) =>
                        handleDragStop(ele.eleId, toolName, data, e)
                      }
                      handleResize={(data, e) =>
                        handleResize(ele.eleId, toolName, data, e)
                      }
                      toolIcon={
                        <RiBallPenLine className={`${toolName.toLowerCase()}-tool-icon-position`} />
                      }
                    />
                  );
                }
              })}
              {textElems.map((ele) => {
                console.log(ele);
                if (ele.pageId === activePage) {
                  let toolName = "Text";
                  let bgColor = ele.bgColor;
                  let field = fields.find(field => field.type === 'Text');
                  return (
                    <DragTool
                      isEditMode={ele.eleId === selectedElement.eleId}
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
                      maxHeight={field.maxHeight}
                      maxWidth={field.maxWidth}
                      handleDragStart={(toolType, e) =>
                        handleDragStart(ele.eleId, toolType, e)
                      }
                      handleDragStop={(data, e) =>
                        handleDragStop(ele.eleId, toolName, data, e)
                      }
                      handleResize={(data, e) =>
                        handleResize(ele.eleId, toolName, data, e)
                      }
                      toolIcon={
                        <BsTextareaT className={`${toolName.toLowerCase()}-tool-icon-position`} />
                      }
                    />
                  );
                }
              })}
              {dateElems.map((ele) => {
                console.log(ele);
                if (ele.pageId === activePage) {
                  let toolName = "Date";
                  let bgColor = ele.bgColor;
                  return (
                    <DragTool
                      isEditMode={ele.eleId === selectedElement.eleId}
                      bgColor={bgColor}
                      toolType={toolName}
                      id={ele.eleId}
                      pageId={ele.pageId}
                      x={ele.x}
                      y={ele.y}
                      width={ele.width}
                      height={ele.height}
                      minWidth={dateEleDimension.minWidth}
                      minHeight={dateEleDimension.minHeight}
                      maxHeight={dateEleDimension.maxHeight}
                      maxWidth={dateEleDimension.maxWidth}
                      handleDragStart={(toolType, e) =>
                        handleDragStart(ele.eleId, toolType, e)
                      }
                      handleDragStop={(data, e) =>
                        handleDragStop(ele.eleId, toolName, data, e)
                      }
                      handleResize={(data, e) =>
                        handleResize(ele.eleId, toolName, data, e)
                      }
                      toolIcon={
                        <BsCalendar2Date
                          className={`${toolName.toLowerCase()}-tool-icon-position`}
                        />
                      }
                    />
                  );
                }
              })}

              {/* {console.log(img)} */}
              <div
                onClick={() => changeMode({}, false)}
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  zIndex: 1,
                }}
              ></div>
              {/* {img && <img src={img} style={{ width: "100%" }} />} */
                // console.log(`URL : ${process.env.REACT_APP_API_URL}/fetchpdf/?uuid=${uuid}`)
              }
              <PdfViewer pdf={`${process.env.REACT_APP_API_URL}/fetchpdf?uuid=${uuid}`}
                 activePage={activePage}
                 setPDFLoading={setIsPDFLoading}
              />
            </div>
          </div>
          <div
            className="right-sidebar"
            id="right-sidebar-div"
            style={{ position: "relative", paddingRight: "10px"}}
          >
            {isToolSelectionMode ? (
              <div className="right-sidebar-tool-detail">
                {/* <div style={{position:"absolute", right: "10px"}} onClick={() => setIsToolSelectionMode(false)}>
              <AiFillCloseSquare/>
            </div> */}
          
                <div class="right-sidebar-tool-header">
                  <RiBallPenLine style={{ margin: "8px", color: "#555d65" }} />
                  <span style={{ fontSize: "20px", color: "#555d65" }}>
                    {
                      fields.find(
                        (field) => field.id === selectedElement.field_id
                      ).name
                    }
                  </span>
                  <MdDelete
                    style={{
                      cursor: "pointer",
                      fontSize: "23px",
                      marginLeft: "34px",
                      color: "#555d65",
                    }}
                    onClick={handleEleDelete}
                  />
                </div>
                <div
                  style={{
                    border: "solid #979797",
                    borderWidth: "0 0 1px",
                    padding: "16px",
                  }}
                >
                  <label
                    htmlFor="currentSignatory"
                    style={{ fontSize: "13px", color: "#555d65" }}
                  >
                    Assigned to
                  </label>
                  <CustomSelect
                    value={selectedEleUserDefaultValue}
                    options={options}
                    name="currentSignatory"
                    onChange={(effect, e) => {
                      let fieldType = fields.find(field => field.id === selectedElement.field_id).type;
                      handleSignatoryChange(fieldType, effect, e);
                    }}
                  ></CustomSelect>
                </div>

                <div
                  key={selectedElement.name}
                  style={{
                    border: "solid #979797",
                    borderWidth: "0 0 1px",
                    padding: "16px",
                  }}
                >
                  <label style={{ fontSize: "13px", color: "#555d65" }}>
                    Field name<span style={{ color: "red" }}>*</span>
                  </label>
                  {/* <CustomSelect options={options} name="currentSignatory"></CustomSelect> */}
                  <input
                    defaultValue={selectedElement.name}
                    onChange={(event) => handleSelectedEleNameChange(event)}
                    style={{
                      height: "1.7rem",
                      width: "11.8rem",
                      borderRadius: "3px",
                      borderColor: "#cccccc",
                    }}
                  />
                </div>
              </div>
            ) : null}

            {/* {!isToolSelectionMode && */}
            <div style={{position: "absolute"}}>
            { imgLst &&
              imgLst.map((item, index) => {
                return (
                  <div
                    className="flexbox-container paggination"
                    onClick={() => handlePaggination(index)}
                    key={index}
                  >
                    <div className="flexbox-item">
                      <div className="page-count">{index + 1}</div>
                      <img
                        className="page-img"
                        style={{
                          border: index === activePage ? "2px solid" : "0px",
                        }}
                        src={imgLst[index]}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="navbar">
            <ProgressIndicator></ProgressIndicator>
            {!isToolSelectionMode && 
            <button className="continue-btn" onClick={handleContinue}>
              Save
            </button>
            }
            {isToolSelectionMode && 
              <button className="continue-btn" onClick={() => {setIsToolSelectionMode(false)}}>
                Done
              </button>
            }
          </div>
        </div>
      )}
    </>
  );
}
