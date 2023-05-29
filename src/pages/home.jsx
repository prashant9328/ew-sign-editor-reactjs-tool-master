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
  // Temporary
  // const tools = Object.freeze({
  //   SIGNATURE: "Signature",
  //   INITIALS: "Initials",
  //   TEXT: "Text",
  //   DATE: "Date",
  //   CHECKBOX: "Checkbox"
  // });

  const colorsWithHighOpacity = [
    "rgba(28, 95, 156, 0.8)",
    "rgba(255, 110, 49, 0.8)",
    "rgba(33, 255, 255, 0.8)",
    "rgba(64, 66, 88, 0.8)",
    "rgba(60, 207, 78, 0.8)",
  ];
  const colors = [
    "rgba(28, 95, 156, 0.5)",
    "rgba(255, 110, 49, 0.5)",
    "rgba(33, 255, 255, 0.5)",
    "rgba(64, 66, 88, 0.5)",
    "rgba(60, 207, 78, 0.5)",
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
  const [imgLst, setImgLst] = React.useState([
    // 'https://cdn.glitch.global/5790e45e-8028-494f-9443-fac72a396419/Signature_Image.jpg?v=1676700133928',
  ]);
  const [img, setImg] = React.useState(null);
  //fields
  const [fields, setFields] = React.useState([]);

  // SIGNATURE TOOL
  const [signEleCount, setSignEleCount] = React.useState(0);
  const [signElems, setSignElems] = React.useState([]);

  // Initials Tool
  const [initialsEleCount, setInitialsEleCount] = React.useState(0);
  const [initialsElems, setInitialsElems] = React.useState([]);

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
    //const uuid = JSON.parse(localStorage.getItem('data'));
    // console.log(window.location.href);

    // console.log("@@@ UUID: " + uuid);
    // console.log("@@@ uuid_template_instance: " + uuid_template_instance);
    // console.log("@@@ userId: " + userId);

    const data = {
      uuid: uuid,
      templateInstanceUUID: template_instance_uuid
      // salesforceUserId: userId,
    };
    // setIsLoading(false);
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
        if(data.signatureFlow === "OR") {
          const signatory = { id: 0, bgColor: colors[0], toolColor: colorsWithHighOpacity[0], value: 0, label: "User 1"};
         
          signatoryList.push(signatory);
          signatoryIdList.push(signatory.id);
        } else if (data.signatureFlow === "AND" && data.signatoryList != null && data.signatoryList.length > 0){
          let signatoryIdList = [];
          data.signatoryList.forEach((signatory, index) => {
            signatory.bgColor = colors[index];
            signatory.toolColor = colorsWithHighOpacity[index];
            // signatory.id = signatory.id;
            signatory.value = signatory.name;
            signatory.label = signatory.name;
            signatoryList.push(signatory);
            signatoryIdList.push(signatory.id);
          });
          // console.log("###" + JSON.stringify(signatoryList));
          // const signatory = signatoryList[0];
        }

        setSelectedSigner(signatoryList[0]);
        setOptions(signatoryList);
        setSignatoryIdList(signatoryIdList);

        // if (data.cordinatesData != null && data.cordinatesData.length > 0) {
        //   let tempSignElems = [];
        //   let tempInitialsElems = [];
        //   let tempTextElems = [];
        //   let tempDateElems = [];
        //   let tempCheckElems = [];

        //   let tempSignEleCount = 0;
        //   let tempInitialsEleCount = 0;
        //   let tempTextEleCount = 0;
        //   let tempDateEleCount = 0;
        //   let tempCheckEleCount = 0;

        //   data.cordinatesData.forEach((coord) => {
        //     // console.log("@@@ FIELDS: " + JSON.stringify(tempFields));
        //     const field = tempFields.find(
        //       (field) => field.id === coord.field_id
        //     );
        //     // console.log("@@@ OPTION: " + JSON.stringify(signatoryList));
        //     const option = signatoryList[coord.userIndex];
        //     const bgColor = option.bgColor;

        //     switch (field.name) {
        //       case "Signature":
        //         tempSignElems.push({
        //           field_id: field.id,
        //           signatory_id: option.id,
        //           bgColor: bgColor,
        //           name: `Signature${tempSignEleCount + 1}`,
        //           eleId: `signEle${tempSignEleCount}`,
        //           pageId: coord.pageId,
        //           x: coord.x,
        //           y: coord.y,
        //           width: coord.width,
        //           height: coord.height,
        //         });
        //         tempSignEleCount++;
        //         break;
        //       case "Initials":
        //         tempInitialsElems.push({
        //           field_id: field.id,
        //           signatory_id: option.id,
        //           bgColor: bgColor,
        //           name: `Initials${tempInitialsEleCount + 1}`,
        //           eleId: `initialsEle${tempInitialsEleCount}`,
        //           pageId: coord.pageId,
        //           x: coord.x,
        //           y: coord.y,
        //           width: coord.width,
        //           height: coord.height,
        //         });
        //         tempInitialsEleCount++;
        //         break;
        //       case "Text":
        //         tempTextElems.push(
        //           {
        //             field_id: field.id,
        //             signatory_id: option.id,
        //             bgColor: bgColor,
        //             name: `Text${tempTextEleCount + 1}`,
        //             eleId: `textEle${tempTextEleCount}`,
        //             pageId: coord.pageId,
        //             x: coord.x,
        //             y: coord.y,
        //             width: coord.width,
        //             height: coord.height,
        //           })
        //           tempTextEleCount++;
        //         break;
        //       case "Date":
        //         tempDateElems.push(
        //           {
        //             field_id: field.id,
        //             signatory_id: option.id,
        //             bgColor: bgColor,
        //             name: `Date${tempDateEleCount + 1}`,
        //             eleId: `dateEle${tempDateEleCount}`,
        //             pageId: coord.pageId,
        //             x: coord.x,
        //             y: coord.y,
        //             width: coord.width,
        //             height: coord.height,
        //           })
        //           tempDateEleCount++;
        //         break;
        //       case "Checkbox":
        //         tempCheckElems.push(
        //             {
        //               field_id: field.id,
        //               signatory_id: option.id,
        //               bgColor: bgColor,
        //               name: `Checkbox${tempCheckEleCount + 1}`,
        //               eleId: `checkBoxEle${tempCheckEleCount}`,
        //               pageId: coord.pageId,
        //               x: coord.x,
        //               y: coord.y,
        //               width: coord.width,
        //               height: coord.height,
        //             })
        //             tempCheckEleCount++;
        //           break;
        //       default:
        //         break;
        //     }
        //   });
        //   // console.log(
        //   //   "@@@ PREVIOUS: SIGNELE: " + JSON.stringify(tempSignElems)
        //   // );
        //   // console.log(
        //   //   "@@@ PREVIOUS: TEXTELE: " + JSON.stringify(tempTextElems)
        //   // );
        //   // console.log(
        //   //   "@@@ PREVIOUS: DATEELE: " + JSON.stringify(tempDateElems)
        //   // );
        //   setSignElems(tempSignElems);
        //   setInitialsElems(tempInitialsElems);
        //   setTextElems(tempTextElems);
        //   setDateElems(tempDateElems);
        //   setCheckBoxElems(tempCheckElems);

        //   setSignEleCount(tempSignEleCount);
        //   setInitialsEleCount(tempInitialsEleCount);
        //   setTextEleCount(tempTextEleCount);
        //   setDateEleCount(tempDateEleCount);
        //   setCheckBoxEleCount(tempCheckEleCount);
        // }

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
    
    // console.log("@@@ handleSignatoryChange: fieldType: " + fieldType);
    // console.log("@@@ handleSignatoryChange: effect: " + effect);
    // console.log("@@@ handleSignatoryChange: value: " + JSON.stringify(e));

    if(effect === 'all_tool') {
      // console.log('all_tool: '+ JSON.stringify(e));
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

    

    console.log(
      "@@@ selectedElement: DELETE: BEFORE: " + JSON.stringify(selectedElement)
    );

    let foundField = fields.find(
      (field) => field.id === selectedElement.field_id
    );
    
    console.log('@@@ foundField: '+ JSON.stringify(foundField));
    switch (foundField.name) {
      case "Signature": {
        console.log(
          "@@@ signElems: DELETE: BEFORE: " + JSON.stringify(signElems)
        );
        let tempSignElems = signElems.filter((ele) => ele.eleId !== selectedElement.eleId);
        console.log('@@@ tempSignElems: '+ JSON.stringify(tempSignElems));
        setSignElems(tempSignElems);
        // );
        break;
      }
      case "Text": {
        console.log(
          "@@@ textElems: DELETE: BEFORE: " + JSON.stringify(textElems)
        );
        let tempTextElems = textElems.filter((ele) => ele.eleId !== selectedElement.eleId);
        console.log('@@@ tempSignElems: '+ JSON.stringify(tempTextElems));
        setTextElems(tempTextElems);
        break;
      }
      case "Date": {
        console.log(
          "@@@ dateElems: DELETE: BEFORE: " + JSON.stringify(dateElems)
        );
       
        let tempDateElems = dateElems.filter((ele) => ele.eleId !== selectedElement.eleId);
        console.log('@@@ tempSignElems: '+ JSON.stringify(tempDateElems));
        setDateElems(tempDateElems);
        break;
      }
      case "Checkbox": {
        console.log(
          "@@@ checkBoxElems: DELETE: BEFORE: " + JSON.stringify(checkBoxElems)
        );
        let tempCheckBoxElems = checkBoxElems.filter((ele) => ele.eleId !== selectedElement.eleId)
        console.log('@@@ tempSignElems: '+ JSON.stringify(tempCheckBoxElems));
        setCheckBoxElems(tempCheckBoxElems);

        break;
      }
      default: {
        break;
      }
    }
    
    changeMode({}, false);
  }

  function handleSelectedEleNameChange(event) {
    console.log("@@@ handleSelectedEleNameChange: CLICKED..... ");

    // selected element
    switch (selectedElement.type) {
      case "Signature": {
        setSignElems(signElems.map((ele) => (ele.name = event.target.value)));
        break;
      }
      case "Initials": {
        setInitialsElems(initialsElems.map((ele) => (ele.name = event.target.value)));
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

  function handleInitialToolClick(event) {
    console.log("@@@ handleInitialToolClick: CLICKED..... ");
    const field = fields.find(field => field.type === 'Initials');
    switch (event.detail) {
      case 1: {
        // console.log("Single click");
        let newInitialsEle = addNewElement(
          field.id,
          `Initials${initialsEleCount + 1}`,
          `initialsEle${initialsEleCount}`,
          field.width,
          field.height
        );
        setInitialsElems(initialsElems.concat(newInitialsEle));
        setInitialsEleCount(initialsEleCount + 1);
        changeMode(newInitialsEle, true, selectedSigner);
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
      case "Initials": {
        ele = initialsElems.filter((ele) => ele.eleId === id);
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
    // console.log("@@@ options : " + JSON.stringify(options));
    setSelectedElement(ele[0]);
    setIsToolSelectionMode(true);
    setSelectedEleUserDefaultValue(
      options.filter((option) => option.id === ele[0].signatory_id)
    );
    // changeMode(ele[0], true);
  }

  function handleDragStop(id, toolType, data, e) {
    console.log('@@@ handleDragStop: CALLED.....');
    setPreviousCoord({ x: data.x + 30, y: data.y + 30 });
    switch (toolType) {
      case "Signature": {
        signElems.map((ele) => {
          if (ele.eleId === id) {
            ele.x = data.x;
            ele.y = data.y;
            return ele;
          }
        });

        break;
      }
      case "Initials": {
        initialsElems.map((ele) => {
          if (ele.eleId === id) {
            ele.x = data.x;
            ele.y = data.y;
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
            return ele;
          }
        });
        break;
      }
      default: {
        break;
      }
    }
    //setIsToolSelectionMode(true);
    // console.log(
    //   "@@@ signElems : Parent : handleDragStop : " + JSON.stringify(signElems)
    // );
    return;
  }

  function handleResize(id, toolType, data, e) {
    // console.log("@@@ Data : Parent : handleResize : " + JSON.stringify(data));
    // console.log("@@@ toolType : Parent : handleDragStop : " + toolType);

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
      case "Initials": {
        initialsElems.map((ele) => {
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
    // console.log("@@@ handlePaggination: " + index);
    // console.log("@@@ activePage: " + activePage);
    // console.log("@@@ Data: " + JSON.stringify(signElems));
    // console.log("@@@ Selected Ele: " + JSON.stringify(selectedElement));
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
    console.log(
      "@@@ FINAL MAPPING OBJECT: signElems: " + JSON.stringify(signElems)
    );
    console.log(
      "@@@ FINAL MAPPING OBJECT: textElems: " + JSON.stringify(textElems)
    );
    console.log(
      "@@@ FINAL MAPPING OBJECT: dateElems: " + JSON.stringify(dateElems)
    );
    const finalCoordData = [...signElems, ...initialsElems, ...textElems, ...dateElems, ...checkBoxElems];
    console.log("@@@ finalCoordData: " + JSON.stringify(finalCoordData));
    console.log(
      "@@@ validateCoordinates: " + validateCoordinates(finalCoordData)
    );
    console.log("@@@ signatoryIdList: " + JSON.stringify(signatoryIdList));

    const isValid = validateCoordinates(finalCoordData);
    console.log("@@@ isValid: " + isValid);

    if (!isValid) {
      setIsLoading(false);
      showToast("error", "Please add atleast one field for each user.");
    }

    if (isValid) {
      const body = {
        // uuid_template_instance: uuid_template_instance,
        // TODO: Merge all types of element and send a object data.
        data: finalCoordData,
        uuid: uuid,
        template_instance_uuid: template_instance_uuid
      };

      console.log("@@@ body: handleContinue: " + JSON.stringify(body));
      // setIsLoading(false);
      

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
              <div className="tools-title">Signer</div>
              <CustomSelect 
                value={selectedSigner}
                options={options} 
                name="signer"
                type="all_tool"
                onChange={(effect, e) => {
                  console.log('@@@ EFFECT: '+ effect);
                  handleSignatoryChange('', effect, e);
                }}>            
              </CustomSelect>
              <div className="tools-title">Signature fields</div>
              <div className="signature-tool">
                <button
                  type="button"
                  className="tool-btn signature-btn"
                  style={{ backgroundColor: selectedSigner ? selectedSigner.toolColor : '', boxShadow: `1px 0 5px ${selectedSigner ? selectedSigner.toolColor : ''}`, borderRadius: "3px"}}
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
                  // style={{ backgroundColor: selectedSigner ? selectedSigner.toolColor : '', boxShadow: `1px 0 5px ${selectedSigner ? selectedSigner.toolColor : ''}`, borderRadius: "3px"}}
                  onClick={handleInitialToolClick}
                >
                  <RiFontSize className="tool-icon" />{" "}
                  <p style={{ marginLeft: "12px", color: "#ffffff" }}>
                    Initials
                  </p>
                </button>
              </div>
              <div className="tools-title">Standard fields</div>
              <div className="standard-tool">
                <button
                  type="button"
                  className="tool-btn btn-margin"
                  style={{ backgroundColor: selectedSigner ? selectedSigner.toolColor : '', boxShadow: `1px 0 5px ${selectedSigner ? selectedSigner.toolColor : ''}`, borderRadius: "3px"}}
                  onClick={handleTextBoxToolClick}
                >
                  <BsTextareaT className="tool-icon" />{" "}
                  <p style={{ marginLeft: "12px", color: "#ffffff" }}>Text</p>
                </button>

                <button
                  type="button"
                  className="tool-btn btn-margin"
                  style={{ backgroundColor: selectedSigner ? selectedSigner.toolColor : '', boxShadow: `1px 0 5px ${selectedSigner ? selectedSigner.toolColor : ''}`, borderRadius: "3px"}}
                  onClick={handleDateBoxToolClick}
                >
                  <BsCalendar2Date className="tool-icon" />
                  <p style={{ marginLeft: "12px", color: "#ffffff" }}>Date</p>
                </button>
                <button
                  type="button"
                  className="tool-btn btn-margin"
                  style={{ backgroundColor: selectedSigner ? selectedSigner.toolColor : '', boxShadow: `1px 0 5px ${selectedSigner ? selectedSigner.toolColor : ''}`, borderRadius: "3px"}}
                  onClick={handleCheckBoxToolClick}
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
            {initialsElems.map((ele) => {
                if (ele.pageId === activePage) {
                  console.log('@@@ RENDERING SIGNATURE: INSIDE: '+ JSON.stringify(ele));
                  const toolName = "Initials";
                  const bgColor = ele.bgColor;
                  const field = fields.find(
                    (field) => field.type === toolName
                  );
                  return (
                    <DragTool
                      isEditMode={
                        selectedElement && ele.eleId === selectedElement.eleId
                      }
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
                        <RiFontSize className={`${toolName.toLowerCase()}-tool-icon-position`} />
                      }
                    />
                  );
                }
              })}
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
              {
                /* {img && <img src={img} style={{ width: "100%" }} />} */
                // console.log(`URL : ${process.env.REACT_APP_API_URL}/fetchpdf/?uuid=${uuid}`)
              }
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
                    type="single_tool"
                    onChange={(effect, e) => {
                      let fieldType = fields.find(
                        (field) => field.id === selectedElement.field_id
                      ).type;
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
            {!isToolSelectionMode && (
              <button className="continue-btn" onClick={handleContinue}>
                Save
              </button>
            )}
            {isToolSelectionMode && (
              <button
                className="continue-btn"
                onClick={() => {
                  setIsToolSelectionMode(false);
                }}
              >
                Done
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
