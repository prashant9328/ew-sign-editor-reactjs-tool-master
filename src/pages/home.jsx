import * as React from "react";
import { RiBallPenLine, RiSuitcaseLine, RiFontSize } from "react-icons/ri";
import {
BsCalendar2Date,
BsTextareaT,
BsCheck2Square,
BsBuildings,
BsApp
} from "react-icons/bs";
import { BiUser } from "react-icons/bi";
import { MdOutlineAlternateEmail, MdDelete } from "react-icons/md";
import DragTool from "../components/drag-tool";
import ProgressIndicator from "../components/progress-indicator";
import CustomSelect from "../components/custom-select";
import { useSearchParams } from "react-router-dom";
import PdfViewer from "../components/PDFViewer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
const colorsWithHighOpacity = [
  "rgba(11, 30, 79, 0.8)",
  "rgba(112, 105, 147, 0.8)",
  "rgba(216, 0, 54, 0.8)",
  "rgba(255, 76, 40, 0.8)",
  "rgba(137, 153, 68, 0.8)",
];
const colors = [
  "rgba(11, 30, 79, 0.5)",
  "rgba(112, 105, 147, 0.5)",
  "rgba(216, 0, 54, 0.5)",
  "rgba(255, 76, 40, 0.5)",
  "rgba(137, 153, 68, 0.5)",
];

const [options, setOptions] = React.useState([]);
const [signatoryIdList, setSignatoryIdList] = React.useState([]);

const [selectedEleUserDefaultValue, setSelectedEleUserDefaultValue] =
  React.useState(options[0]);
const [selectedSigner, setSelectedSigner] = React.useState();
const [searchParams] = useSearchParams();

const [isPDFLoading, setIsPDFLoading] = React.useState(false);
const [isLoading, setIsLoading] = React.useState(true);
const [isFetching, setIsFetching] = React.useState(true);
const [isFileShared, setIsFileShared] = React.useState(false);
const [isToolSelectionMode, setIsToolSelectionMode] = React.useState(false);
const [selectedElement, setSelectedElement] = React.useState({});

const uuid = searchParams.get("uuid");
const template_instance_uuid = searchParams.get("template_instance_uuid")?? null;
// const userId = searchParams.get("userid");

const [activePage, setActivePage] = React.useState(0);
const [imgLst, setImgLst] = React.useState([]);
const [img, setImg] = React.useState(null);
//fields
const [fields, setFields] = React.useState([]);

// SIGNATURE TOOL
const [signEleCount, setSignEleCount] = React.useState(0);
const [signElems, setSignElems] = React.useState([]);

// Text Tool
const [textEleCount, setTextEleCount] = React.useState(0);
const [textElems, setTextElems] = React.useState([]);

// Date Tool
const [dateEleCount, setDateEleCount] = React.useState(0);
const [dateElems, setDateElems] = React.useState([]);

// Checkbox Tool
const [checkBoxEleCount, setCheckBoxEleCount] = React.useState(0);
const [checkBoxElems, setCheckBoxElems] = React.useState([]);

const [previousCoord, setPreviousCoord] = React.useState({ x: 0, y: 0 });

React.useEffect(() => {
  const data = {
    uuid: uuid,
    templateInstanceUUID: template_instance_uuid
  };
  console.log(`@@@ ${process.env.REACT_APP_API_URL}/api/admin/fetchImagesData`);
    fetch(`${process.env.REACT_APP_API_URL}/api/admin/fetchImagesData`, {
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

      const tempFields = [];
      if (data.allFieldsData != null && data.allFieldsData.length > 0) {
        data.allFieldsData.forEach((fieldData) => {
          tempFields.push({
            id: fieldData.id,
            name: fieldData.name,
            type: fieldData.type,
            width: fieldData.width,
            height: fieldData.height,
            minWidth: fieldData.minWidth,
            minHeight: fieldData.minHeight,
            maxWidth: fieldData.maxWidth,
            maxHeight: fieldData.maxHeight,
          });
        });
        setFields(tempFields);
      }

      const signatoryList = [];
      const signatureFlow = data.signatureFlow;
      if(signatureFlow === "OR") {
        const signatory = { id: 0, bgColor: colors[0], toolColor: colorsWithHighOpacity[0], value: 0, label: "User 1"};
        
        signatoryList.push(signatory);
        signatoryIdList.push(signatory.id);
      } else if (signatureFlow === "AND" && data.signatoryList != null && data.signatoryList.length > 0){
        let signatoryIdList = [];
        data.signatoryList.forEach((signatory, index) => {
          signatory.bgColor = colors[index];
          signatory.toolColor = colorsWithHighOpacity[index];
          signatory.value = signatory.name;
          signatory.label = signatory.name;
          signatoryList.push(signatory);
          signatoryIdList.push(signatory.id);
        });
      }

      setSelectedSigner(signatoryList[0]);
      setOptions(signatoryList);
      setSignatoryIdList(signatoryIdList);

      data.images.forEach((file) => {
        // console.log("@@@ PATH: " + file.path);
        tempArr.push(file.path);
      });
      setImgLst(tempArr);
    })
    .finally(() => {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    });
  //
}, []);

React.useEffect(() => {
  getImage(activePage);
}, [imgLst]);

function showToast(type, message) {
  switch (type) {
    case "info":
      toast.info(message);
      break;
    case "success":
      toast.success(message);
      break;
    case "warn":
      toast.warn(message);
      break;
    case "error":
      toast.error(message);
      break;
    default:
      toast(message);
      break;
  }
}

function validateCoordinates(finalCoordData) {
  if(finalCoordData.length===0) return false;

  const finalCoordSignatoryIdList = [];
  for (let i = 0; i < finalCoordData.length; i++) {
    finalCoordSignatoryIdList.push(finalCoordData[i].signatory_id);
  }

  let checker = (arr, target) => target.every(v => arr.includes(v));
  return checker(finalCoordSignatoryIdList, signatoryIdList);
}

function changeMode(selectedEle, isEditMode, selectedOption=options[0]) {
  console.log("@@@ changeMode: CALLED....");

  setSelectedElement(selectedEle);
  setIsToolSelectionMode(isEditMode);
  setSelectedEleUserDefaultValue(selectedOption);
}

function handleSignatoryChange(fieldType, effect, e) {
    console.log("@@@ handleSignatoryChange: CALLED....");
    if(effect === 'all_tool') {
        setSelectedSigner(e);
        setSelectedElement({});
        setIsToolSelectionMode(false);
        setSelectedEleUserDefaultValue(e);
        return;
    }

    switch (fieldType) {
      case "Signature":
        setSignElems(
          signElems.map((ele) => {
            if (ele.eleId === selectedElement.eleId) {
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
            if (ele.eleId === selectedElement.eleId) {
              ele.signatory_id = e.id;
              selectedElement.bgColor = ele.bgColor = e.bgColor;
            }
            return ele;
          })
        );
        break;
      case "Date":
        setDateElems(
          dateElems.map((ele) => {
            if (ele.eleId === selectedElement.eleId) {
              ele.signatory_id = e.id;
              selectedElement.bgColor = ele.bgColor = e.bgColor;
            }
            return ele;
          })
        );
        break;
      case "Checkbox":
          setCheckBoxElems(
            checkBoxElems.map((ele) => {
              if (ele.eleId === selectedElement.eleId) {
                ele.signatory_id = e.id;
                selectedElement.bgColor = ele.bgColor = e.bgColor;
              }
              return ele;
            })
          );
          break;
      default:
        break;
    }
    setSelectedEleUserDefaultValue(
        options.filter((option) => option.id === selectedElement.signatory_id)
    );
}


function handleEleDelete() {
  let foundField = fields.find(
    (field) => field.id === selectedElement.field_id
  );
  
  console.log('@@@ foundField: '+ JSON.stringify(foundField));
  switch (foundField.name) {
    case "Signature": {
      let currentSignElems = signElems;
      let emptyArr = [];
      setSignElems(emptyArr);
      console.log(
        "@@@ signElems: DELETE: BEFORE: " + JSON.stringify(signElems)
      );
      let tempSignElems = currentSignElems.filter((ele) => ele.eleId !== selectedElement.eleId);
      console.log('@@@ tempSignElems: '+ JSON.stringify(tempSignElems));
      setTimeout(() =>
      {
        setSignElems(tempSignElems);
      }, 0);
      // );
      break;
    }
    case "Text": {
      let currentTextElems = textElems;
      let emptyArr = [];
      setTextElems(emptyArr);
      console.log(
        "@@@ textElems: DELETE: BEFORE: " + JSON.stringify(textElems)
      );
      let tempTextElems = currentTextElems.filter((ele) => ele.eleId !== selectedElement.eleId);
      console.log('@@@ tempSignElems: '+ JSON.stringify(tempTextElems));
      setTimeout(() =>
      {
        setTextElems(tempTextElems);
      }, 0);
      
      break;
    }
    case "Date": {
      let currrentDateElems = dateElems;
      let emptyArr = []
      setDateElems(emptyArr);
      console.log(
        "@@@ dateElems: DELETE: BEFORE: " + JSON.stringify(dateElems)
      );
      
      let tempDateElems = currrentDateElems.filter((ele) => ele.eleId !== selectedElement.eleId);
      console.log('@@@ tempSignElems: '+ JSON.stringify(tempDateElems));
      setTimeout(() =>
      {
        setDateElems(tempDateElems);
      }, 0);  
      break;
    }
    case "Checkbox": {
      let currenctCheckboxElems = checkBoxElems;
      let emptyArr = [];
      setCheckBoxElems(emptyArr);
      console.log(
        "@@@ checkBoxElems: DELETE: BEFORE: " + JSON.stringify(checkBoxElems)
      );
      let tempCheckBoxElems = currenctCheckboxElems.filter((ele) => ele.eleId !== selectedElement.eleId)
      console.log('@@@ tempSignElems: '+ JSON.stringify(tempCheckBoxElems));
      setTimeout(() =>
      {
        setCheckBoxElems(tempCheckBoxElems);
      }, 0);        
      break;
    }
    default: {
      break;
    }
  }
  changeMode({}, false ,selectedSigner );
}
function handleSelectedEleNameChange(event) {
  console.log("@@@ handleSelectedEleNameChange: CLICKED..... ");

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
    case "Checkbox": {
      setCheckBoxElems(checkBoxElems.map((ele) => (ele.name = event.target.value)));
      break;
    }
    default: {
      break;
    }
  }
}

function addNewElement(fieldId, name, eleId, width, height) {
  console.log("@@@ addNewElement..... ");

  setSelectedEleUserDefaultValue(selectedSigner);
  setPreviousCoord({ x: previousCoord.x + 30, y: previousCoord.y + 30 });
  return {
    field_id: fieldId,
    signatory_id: selectedSigner.id,
    bgColor: selectedSigner.bgColor,
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
  console.log("@@@ handleSignToolClick: CLICKED..... ");
  const field = fields.find(field => field.type === 'Signature');
  switch (event.detail) {
    case 1: {
      // console.log("Single click");
      let newSignEle = addNewElement(
        field.id,
        `Signature${signEleCount + 1}`,
        `signEle${signEleCount}`,
        field.width,
        field.height
      );
      setSignElems(signElems.concat(newSignEle));
      setSignEleCount(signEleCount + 1);
      changeMode(newSignEle, true, selectedSigner);
      break;
    }
    case 2: {
      // console.log("Double click");
      break;
    }
    default: {
      break;
    }
  }
}

function handleTextBoxToolClick(event) {
  console.log("@@@ handleTextBoxToolClick: CALLED..... ");

  // console.log("@@@ TEXT tool is selected!!! ");
  const field = fields.find(field => field.type === 'Text');
  switch (event.detail) {
    case 1: {
      // console.log("Single click");
      let newTextEle = addNewElement(
        field.id,
        `Text${textEleCount + 1}`,
        `textEle${textEleCount}`,
        field.width,
        field.height
      );
      setTextElems(textElems.concat(newTextEle));
      setTextEleCount(textEleCount + 1);
      changeMode(newTextEle, true, selectedSigner);
      break;
    }
    case 2: {
      // console.log("Double click");
      break;
    }
    default: {
      break;
    }
  }
}

function handleDateBoxToolClick(event) {
  console.log("@@@ handleDateBoxToolClick: CALLED..... ");

  // console.log("@@@ DATE tool is selected!!! ");
  const field = fields.find(field => field.type === 'Date');

  switch (event.detail) {
    case 1: {
      // console.log("Single click");
      let newDateEle = addNewElement(
        field.id,
        `Date${dateEleCount + 1}`,
        `dateEle${dateEleCount}`,
        field.width,
        field.height
      );
      setDateElems(dateElems.concat(newDateEle));
      setDateEleCount(dateEleCount + 1);
      changeMode(newDateEle, true, selectedSigner);
      break;
    }
    case 2: {
      // console.log("Double click");
      break;
    }
    default: {
      break;
    }
  }
}

function handleCheckBoxToolClick(event) {
  console.log("@@@ handleCheckBoxToolClick: CALLED..... ");
  
  const field = fields.find(field => field.type === 'Checkbox');
  switch (event.detail) {
    case 1: {
      // console.log("Single click");
      let newCheckEle = addNewElement(
        field.id,
        `Checkbox${checkBoxEleCount + 1}`,
        `checkBoxEle${checkBoxEleCount}`,
        field.width,
        field.height
      );
      setCheckBoxElems(checkBoxElems.concat(newCheckEle));
      setCheckBoxEleCount(checkBoxEleCount + 1);
      changeMode(newCheckEle, true, selectedSigner);
      break;
    }
    case 2: {
      // console.log("Double click");
      break;
    }
    default: {
      break;
    }
  }
} 

function handleDragStart(id, toolType, e) {
  let emptyArr = [];
  setSelectedEleUserDefaultValue(emptyArr);
  console.log('@@@ handleDragStart: CALLED.....');
  // console.log("@@@ handleDragStart");
  // console.log("@@@ Id: handleDragStart: " + id);
  // console.log("@@@ toolType: handleDragStart: " + toolType);
  // console.log("@@@ SELECTED ELE: " + JSON.stringify(selectedElement));
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
    case "Checkbox": {
      ele = checkBoxElems.filter((ele) => ele.eleId === id);
      break;
    }
    default: {
      break;
    }
  }
  console.log("@@@ ELE : " + JSON.stringify(ele));
  setSelectedElement(ele[0]);
  setIsToolSelectionMode(true);
}

function handleDragStop(id, toolType, data, e) {
  console.log('@@@ handleDragStop: CALLED.....');
  setPreviousCoord({ x: data.x + 30, y: data.y + 30 });
  let eleValue = [];
  switch (toolType) {
    case "Signature": {
      signElems.map((ele) => {
        if (ele.eleId === id) {
          ele.x = data.x;
          ele.y = data.y;
          eleValue.push(ele);
          return ele;
        }
      });

      break;
    }
    case "Text": {
      textElems.map((ele) => {
        if (ele.eleId === id) {
          ele.x = data.x;
          ele.y = data.y;
          eleValue.push(ele);
          return ele;
        }
      });
      break;
    }
    case "Date": {
      dateElems.map((ele) => {
        // console.log(ele.eleId);
        if (ele.eleId === id) {
          ele.x = data.x;
          ele.y = data.y;
          eleValue.push(ele);
          return ele;
        }
      });
      break;
    }
    case "Checkbox": {
      checkBoxElems.map((ele) => {
        // console.log(ele.eleId);
        if (ele.eleId === id) {
          ele.x = data.x;
          ele.y = data.y;
          eleValue.push(ele);
          return ele;
        }
      });
      break;
    }
    default: {
      break;
    }
  }
  setSelectedEleUserDefaultValue(
    options.filter((option) => option.id === eleValue[0].signatory_id)
  );
  return;
}

function handleResize(id, toolType, data, e) {
  switch (toolType) {
    case "Signature": {
      signElems.map((ele) => {
        // console.log(ele.eleId);
        if (ele.eleId === id) {
          ele.width = data.width;
          ele.height = data.height;
          return ele;
        }
      });
      break;
    }
    case "Text": {
      textElems.map((ele) => {
        // console.log(ele.eleId);
        if (ele.eleId === id) {
          ele.width = data.width;
          ele.height = data.height;
          return ele;
        }
      });

      break;
    }
    case "Date": {
      dateElems.map((ele) => {
        // console.log(ele.eleId);
        if (ele.eleId === id) {
          ele.width = data.width;
          ele.height = data.height;
          return ele;
        }
      });

      break;
    }
    case "Checkbox": {
      checkBoxElems.map((ele) => {
        // console.log(ele.eleId);
        if (ele.eleId === id) {
          ele.width = data.width;
          ele.height = data.height;
          return ele;
        }
      });

      break;
    }
    default: {
      break;
    }
  }
}

function handlePaggination(index) {
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
  const finalCoordData = [...signElems, ...textElems, ...dateElems, ...checkBoxElems];
  const isValid = validateCoordinates(finalCoordData);

  if (!isValid) {
    setIsLoading(false);
    showToast("error", "Please add atleast one field for each user.");
  }

  if (isValid) {
    const body = {
      // TODO: Merge all types of element and send a object data.
      data: finalCoordData,
      uuid: uuid,
      templateInstanceUUID: template_instance_uuid
    };

  fetch(`${process.env.REACT_APP_API_URL}/api/admin/setTemplateCoordinates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
  .then((res) => res.json())
  .then((response) => {
    console.log(JSON.stringify(response));
    setIsFileShared(true);
  })
  .catch((error) => {
    console.log("@@@ Saved coordinate: " + JSON.stringify(error));
    toast.error(JSON.stringify(error));
  })
  .finally(() => {
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
          }}>
          <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                width: "100vw",
                flexDirection: "column",
                fontFamily: "sans-serif",
              }}
            >
              <img src="https://www.eruditeworks.com/wp-content/uploads/2021/07/imgpsh_fullsize_anim.png" />
              <br/>
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
              <div className="tools-title">Signer</div>
              <CustomSelect 
                  value={selectedSigner}
                  options={options} 
                  name="signer"
                  type="all_tool"
                  onChange={(effect, e) => {
                    handleSignatoryChange('', effect, e);
                  }}>            
              </CustomSelect>

              <div className="tools-title">Fields</div>
              <div className="flex-container">
                  <button
                      type="button"
                      className="flex-item tool-btn signature-btn"
                      onClick={handleSignToolClick}>
                      <RiBallPenLine className="tool-icon" />{" "}
                      <p>Signature</p>
                  </button>

                  <button
                      type="button"
                      className="tool-btn btn-margin"
                      onClick={handleTextBoxToolClick}>
                    <BsTextareaT className="tool-icon" />{" "}
                    <p>Text</p>
                  </button>

                  <button
                      type="button"
                      className="tool-btn btn-margin flex-item "
                      onClick={handleDateBoxToolClick}>
                      <BsCalendar2Date className="tool-icon" />
                      <p>Date</p>
                  </button>

                  <button
                      type="button"
                      className="tool-btn btn-margin flex-item "
                      onClick={handleCheckBoxToolClick}>
                      <BsCheck2Square className="tool-icon" />{" "}
                      <p>Checkbox</p>
                  </button>

                  <button
                      type="button"
                      className="tool-btn btn-margin disabled-btn flex-item">
                      <BsCalendar2Date className="tool-icon" />{" "}
                      <p>Date Signed</p>
                  </button>

                  <button
                      type="button"
                      className="tool-btn btn-margin disabled-btn flex-item">
                      <BiUser className="tool-icon" />{" "}
                      <p>Full Name</p>
                  </button>

                  <button
                      type="button"
                      className="tool-btn btn-margin disabled-btn flex-item" >
                      <MdOutlineAlternateEmail className="tool-icon" />{" "}
                      <p>Email</p>
                  </button>

                  <button
                      type="button"
                      className="tool-btn btn-margin disabled-btn flex-item">
                      <BsBuildings className="tool-icon" />{" "}
                      <p>Company</p>
                  </button>

                  <button 
                      type="button"
                      className="tool-btn btn-margin disabled-btn flex-item">
                      <RiSuitcaseLine className="tool-icon" />{" "}
                      <p>Job Title</p>
                  </button>
                <div className="flex-item" style={{marginLeft: '67px'}}></div>
            </div>
        </div>
        <div>
          <div className="document" id="center-img-div">
          
            {signElems.map((ele) => {
              if (ele.pageId === activePage) {
                console.log('@@@ RENDERING SIGNATURE: INSIDE: '+ JSON.stringify(ele));
                const toolName = "Signature";
                const bgColor = ele.bgColor;
                const field = fields.find(
                  (field) => field.type === toolName
                );
                return (
                  <DragTool
                    isEditMode={
                      selectedElement && ele.eleId === selectedElement.eleId
                    }
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
                      <RiBallPenLine
                        className={`${toolName.toLowerCase()}-tool-icon-position`}
                      />
                    }
                  />
                );
              }
            })}
            {textElems.map((ele) => {
              // console.log(ele);
              if (ele && ele.pageId === activePage) {
                console.log('@@@ RENDERING TEXT: INSIDE: '+ JSON.stringify(ele));
                const toolName = "Text";
                const bgColor = ele.bgColor;
                const field = fields.find((field) => field.type === toolName);
                return (
                  <DragTool
                    isEditMode={
                      selectedElement && ele.eleId === selectedElement.eleId
                    }
                    enableResizing={
                      {left: true, right: true}
                    }
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
                      <BsTextareaT
                        className={`${toolName.toLowerCase()}-tool-icon-position`}
                      />
                    }
                  />
                );
              }
            })}

            {dateElems.map((ele) => {
              // console.log(ele);
              if (ele && ele.pageId === activePage) {
                console.log('@@@ RENDERING DATE: INSIDE: '+ JSON.stringify(ele));
                const toolName = "Date";
                const bgColor = ele.bgColor;
                const field = fields.find(field => field.type === toolName);
                return (
                  <DragTool
                    isEditMode={
                      selectedElement && ele.eleId === selectedElement.eleId
                    }
                    enableResizing={
                      {top: true, bottom: true}
                    }
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
                      <BsCalendar2Date
                        className={`${toolName.toLowerCase()}-tool-icon-position`}
                      />
                    }
                  />
                );
              }
            })}

            {checkBoxElems.map((ele) => {
              // console.log(ele);
              if (ele && ele.pageId === activePage) {
                console.log('@@@ RENDERING DATE: INSIDE: '+ JSON.stringify(ele));
                const toolName = "Checkbox";
                const bgColor = ele.bgColor;
                const field = fields.find(field => field.type === toolName);
                return (
                  <DragTool
                    isEditMode={false}
                    enableResizing={false}
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
                      <BsApp
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
            <PdfViewer
              pdf={`${process.env.REACT_APP_API_URL}/fetchpdf?uuid=${uuid}`}
              activePage={activePage}
              setPDFLoading={setIsPDFLoading}
            />
          </div>
        </div>
        <div
          className="right-sidebar"
          id="right-sidebar-div"
          style={{ position: "relative", paddingRight: "10px" }}
        >
          {isToolSelectionMode ? (
            <div className="right-sidebar-tool-detail">
              <div class="right-sidebar-tool-header">
                <RiBallPenLine style={{ margin: "8px", color: "#555d65" }} />
                <span style={{ fontSize: "18px", color: "#555d65", marginTop: "3px" }}>
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

                <div style={{padding: "10px",}}>
                    <label htmlFor="currentSignatory" class="field-lbl">Assigned to</label>
                    <div class="remove-margin">
                        <CustomSelect
                            value={selectedEleUserDefaultValue}
                            options={options}
                            name="currentSignatory"
                            type="single_tool"
                            onChange={(effect, e) => {
                              let fieldType = fields.find(
                                (field) => field.id === selectedElement.field_id
                              ).type;
                              handleSignatoryChange(fieldType, effect, e);
                            }}></CustomSelect>
                      </div>
                </div>

                <div key={selectedElement.name} style={{padding: "10px",}}>
                    <label class="field-lbl">Field name<span style={{ color: "red" }}>*</span></label>
                    <input defaultValue={selectedElement.name} onChange={(event) => handleSelectedEleNameChange(event)}
                        class="input-field"/>
                </div>
            </div>
          ) : null}

          <div style={{ position: "absolute" }}>
            {imgLst &&
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
                          border: index === activePage ? "2px solid #6e859b" : "1px solid #b3b3b34d",
                        }}
                        src={imgLst[index]}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="navbar <ProgressIndicator></ProgressIndicator>">
            <img src="https://eruditeworksprivatelimited4--partial.sandbox.file.force.com/servlet/servlet.ImageServer?id=0159D0000001Rlv&oid=00D9D0000008fSF&lastMod=1686396736000" class="logo"/>
            
            {!isToolSelectionMode && (
                <button className="continue-btn" onClick={handleContinue}>
                    Save
                </button>
            )}
            {isToolSelectionMode && (
              <button className="continue-btn" onClick={() => {setIsToolSelectionMode(false);}}>
                  Done
              </button>
           )}
        </div>        
      </div>
    )}
  </>
);
}
