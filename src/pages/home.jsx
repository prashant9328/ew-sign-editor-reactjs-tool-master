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

export default function Home() {
  // Temporary
  const colors = ["rgba(28, 95, 156, 0.5)", "rgba(255, 110, 49, 0.5)", "rgba(33, 255, 255, 0.5)", "rgba(64, 66, 88, 0.5)", "rgba(60, 207, 78, 0.5)"];
  const [options, setOptions] = React.useState([
    { id: 12, bgColor: colors[0], value: "sudip", label: "Sudip"},
    { id: 13, bgColor: colors[1], value: "krunal", label: "Krunal"},
    { id: 14, bgColor: colors[2], value: "haresh", label: "Haresh" },
    { id: 15, bgColor: colors[3], value: "jayant", label: "Jayant" }
  ]);
  const [selectedEleUserDefaultValue, setSelectedEleUserDefaultValue] = React.useState(options[0]);
  const [searchParams] = useSearchParams();

  const [isLoading, setIsLoading] = React.useState(true);
  const [isFetching, setIsFetching] = React.useState(true);
  const [isFileShared, setIsFileShared] = React.useState(false);
  const [isToolSelectionMode, setIsToolSelectionMode] = React.useState(false);
  const [selectedElement, setSelectedElement] = React.useState({});

  const [serverURL, setServerURL] = React.useState(
    "http://winsrv.eruditeworks.com/EwSignApi"
  );
  const uuid = searchParams.get("uuid");
  const uuid_template_instance = searchParams.get("uuid_template_instance");
  const userId = searchParams.get("userid");

  const [activePage, setActivePage] = React.useState(0);
  const [imgLst, setImgLst] = React.useState([
    // 'https://cdn.glitch.global/5790e45e-8028-494f-9443-fac72a396419/Signature_Image.jpg?v=1676700133928',
  ]);
  const [img, setImg] = React.useState(null);

  //fields
  const fields = [
    { id: 1, name: "Signature" },
    { id: 2, name: "Textbox" },
    { id: 3, name: "Datebox" },
  ];

  // SIGNATURE TOOL
  const [signEleCount, setSignEleCount] = React.useState(0);
  const [signElems, setSignElems] = React.useState([]);

  // Textbox Tool
  const [textEleCount, setTextEleCount] = React.useState(0);
  const [textElems, setTextElems] = React.useState([]);

  // Datebox Tool
  const [dateEleCount, setDateEleCount] = React.useState(0);
  const [dateElems, setDateElems] = React.useState([]);

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
    fetch(`${serverURL}/api/fetchImagesData`, {
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
        if (data.cordinatesData.length > 0) {
          let tempSignElems = [];
          data.cordinatesData.forEach((coord, index) => {
            if (coord.fieldType === "Signature") {
              tempSignElems.push(
                signElems.concat({
                  field_id: 1,
                  signatory_id: 12,
                  eleId: `signEle${index}`,
                  pageId: coord.pageId,
                  x: coord.x,
                  y: coord.y,
                  width: coord.width,
                  height: coord.height,
                })
              );
            }
          });
          setSignElems(tempSignElems);
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
        }, 3000);
      });
  }, []);

  React.useEffect(() => {
    getImage(activePage);
  }, [imgLst]); 

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
      case "Textbox":
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
      case "Datebox":
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
        alert("Signature");
        alert("@@@ signElems: " + JSON.stringify(signElems));
        alert("@@@ selectedElement: "+ selectedElement.eleId);

        alert(JSON.stringify(signElems.filter((ele) => ele.eleId !== selectedElement.eleId)));

        setSignElems(
          signElems.filter((ele) => ele.eleId !== selectedElement.eleId)
        );
        break;
      }
      case "Textbox": {
        console.log("Textbox");
        console.log("@@@ textElems: " + JSON.stringify(textElems));

        setTextElems(
          textElems.filter((ele) => ele.eleId !== selectedElement.eleId)
        );
        break;
      }
      case "Datebox": {
        console.log("Datebox");
        console.log("@@@ dateElems: " + JSON.stringify(dateElems));

        setDateElems(
          dateElems.filter((ele) => ele.eleId !== selectedElement.eleId)
        );
        break;
      }
      default: {
        break;
      }

    }
    console.log("@@@ signElems: AFTER DELETE " + JSON.stringify(signElems));
    changeMode({}, false);
  }

  function handleSelectedEleNameChange(event) {
    console.log("@@@ VALUE: " + event.target.value);
    console.log("@@@ selectedElement.type: " + JSON.stringify(selectedElement));
    // selected element
    switch (selectedElement.type) {
      case "Signature": {
        console.log("Signature");
        setSignElems(signElems.map((ele) => (ele.name = event.target.value)));
        break;
      }
      case "Textbox": {
        console.log("Textbox");
        setTextElems(textElems.map((ele) => (ele.name = event.target.value)));
        break;
      }
      case "Datebox": {
        console.log("Datebox");
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
    return {
      bgColor: colors[0],
      field_id: fieldId,
      signatory_id: 12,
      name: name,
      eleId: eleId,
      pageId: activePage,
      x: 0,
      y: 0,
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
          160,
          40
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
          138,
          26
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
          138,
          26
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
      case "Textbox": {
        ele = textElems.filter((ele) => ele.eleId === id);
        break;
      }
      case "Datebox": {
        ele = dateElems.filter((ele) => ele.eleId === id);
        break;
      }
      default: {
        break;
      }
    }
    console.log("@@@ ELE : " + JSON.stringify(ele));
    setSelectedElement(ele[0]);
    setIsToolSelectionMode(true);
    setSelectedEleUserDefaultValue(options.filter(option => option.id === ele[0].signatory_id));
    // changeMode(ele[0], true);
  }

  function handleDragStop(id, toolType, data, e) {
    // console.log("@@@ Data : Parent : handleDragStop : " + JSON.stringify(data));
    // console.log("@@@ toolType : Parent : handleDragStop : " + toolType);
    // console.log("@@@ Id: " + id);

    switch (toolType) {
      case "Signature": {
          signElems.map((ele) => {
            //console.log(ele.eleId);
            if (ele.eleId === id) {
              ele.x = data.x;
              ele.y = data.y;
              return ele;
            }
          })
        break;
      }
      case "Textbox": {
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
      case "Datebox": {
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
      case "Textbox": {
        
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
      case "Datebox": {
       
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
    console.log("@@@ FINAL MAPPING OBJECT: " + JSON.stringify(signElems));

    const body = {
      uuid_template_instance: uuid_template_instance,
      // TODO: Merge all types of element and send a object data.
      data: [...signElems, ...textElems, ...dateElems],
    };

    console.log('@@@ body: handleContinue: '+JSON.stringify(body));
    // setIsLoading(false);
    fetch(`${serverURL}/api/submitCordinatesData`, {
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

  return (
    <>
      {isLoading ? (
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
                    Textbox
                  </p>
                </button>

                <button
                  type="button"
                  className="tool-btn btn-margin working-btn"
                  onClick={handleDateBoxToolClick}
                >
                  <BsCalendar2Date className="tool-icon" />
                  <p style={{ marginLeft: "12px", color: "#ffffff" }}>
                    Datebox
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
                      minWidth={75}
                      minHeight={38}
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
                  let toolName = "Textbox";
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
                      minWidth={85}
                      minHeight={30}
                      maxHeight={30}
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
                  let toolName = "Datebox";
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
                      minWidth={85}
                      minHeight={30}
                      maxHeight={30}
                      maxWidth={120}
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
              {img && <img src={img} style={{ width: "100%" }} />}
            </div>
          </div>
          <div
            className="right-sidebar"
            id="right-sidebar-div"
            style={{ position: "relative" }}
          >
            {isToolSelectionMode ? (
              <>
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
                      let fieldType = fields.find(field => field.id === selectedElement.field_id).name;
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
              </>
            ) : null}

            {!isToolSelectionMode &&
              imgLst &&
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
          <div className="navbar">
            <ProgressIndicator></ProgressIndicator>
            <button className="continue-btn" onClick={handleContinue}>
              continue
            </button>
          </div>
        </div>
      )}
    </>
  );
}
