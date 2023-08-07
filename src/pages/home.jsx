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
import loadingGif from '../images/loading-cropped.gif';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Paggination } from "../components/paggination";


export default function Home() {
  const defaultCanvasScale = "1";
  const scaleForImages = "0.3";
  // const documentXDistanceFromLeftSideBar = 595;
  const documentXDistanceFromLeftSideBar = 517;
  const documentYDistanceFromTopSideBar = 821;

  const randomWidth = 20;
  const randomHeight = 100;

  const colorsWithHighOpacity = [
    "rgba(207, 233, 254, 1)",
    "rgba(242, 222, 254, 1)",
    "rgba(242, 76, 61, 0.5)",
    "rgba(3, 201, 136, 0.5)",
    "rgba(127, 140, 237, 1)",
    "rgba(81, 107, 120, 0.85)",
    "rgba(50, 30, 30, 0.5)",
    "rgba(14, 131, 136, 0.5)",
    "rgba(109, 103, 228, 0.5)",
    "rgba(193, 71, 233, 0.5)"
  ];

  const colors = [
    "rgba(207, 233, 254, 0.8)",
    "rgba(242, 222, 254, 0.8)",
    "rgba(242, 76, 61, 0.3)",
    "rgba(3, 201, 136, 0.3)",
    "rgba(127, 140, 237, 0.8)",
    "rgba(81, 107, 120, 0.65)",
    "rgba(50, 30, 30, 0.3)",
    "rgba(14, 131, 136, 0.3)",
    "rgba(109, 103, 228, 0.3)",
    "rgba(193, 71, 233, 0.3)"
  ];
  const [offsetTop, setOffsetTop] = React.useState("");


  const [orgId, setOrgId] = React.useState("");

  const [options, setOptions] = React.useState([]);
  const [signatoryIdList, setSignatoryIdList] = React.useState([]);

  const [selectedEleUserDefaultValue, setSelectedEleUserDefaultValue] =
    React.useState(options[0]);

  const [scale, setScale] = React.useState(1.0);
  const [panningState, setPanningState] = React.useState({ disabled: false });

  const [selectedSigner, setSelectedSigner] = React.useState();
  const [selectedSignatoryColor, setSelectedSignatoryColor] = React.useState();
  const [selectedAssignerColor, setSelectedAssignerColor] = React.useState();

  const draggableEle = React.useRef(null);
  const scrollContainer = React.useRef(null);
  const scrollImage = React.useRef(null);
  const documentContainer = React.useRef(null);
  // const documentContainer = React.useCallback(node => {
  //   if (node !== null) {
  //     var rect = node.getBoundingClientRect();
  //     console.log(rect.top, rect.right, rect.bottom, rect.left);
  //     setDocumentBounding({top: rect.top, right: rect.right, bottom: rect.bottom, left: rect.left});
  //   }
  // }, [])

  const [searchParams] = useSearchParams();

  // const [pageCount, setPageCount] = React.useState(0);
  const [isPDFLoading, setIsPDFLoading] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isFetching, setIsFetching] = React.useState(true);
  const [isFileShared, setIsFileShared] = React.useState(false);
  const [isToolSelectionMode, setIsToolSelectionMode] = React.useState(false);
  const [selectedElement, setSelectedElement] = React.useState({});
  const [signatureFlow, setSignatureFlow] = React.useState(null);
  const uuid = searchParams.get("uuid");
  const template_instance_uuid = searchParams.get("template_instance_uuid") ?? null;
  // console.log('tiUUID'+template_instance_uuid);
  // console.log('uuid'+uuid);
  // const userId = searchParams.get("userid");

  const [activePage, setActivePage] = React.useState(0);
  // const [imgLst, setImgLst] = React.useState([]);handlePaggination
  const [totalPage, settotalPage] = React.useState([]);
  // const [img, setImg] = React.useState(null);
  const [documentBounding, setDocumentBounding] = React.useState({ top: 0, right: 0, bottom: 0, left: 0 });
  const [unfocusDivStyle, setUnfocusDivStyle] = React.useState({ height: 0, width: 0 });
  //fields
  const [fields, setFields] = React.useState([]);

  // SIGNATURE TOOL
  const [signEleCount, setSignEleCount] = React.useState(0);
  const [signElems, setSignElems] = React.useState([]);

  const handlePreviousPage = () => {
    changeMode({}, false);
    if (activePage > 0) {
      setActivePage(activePage - 1);
      scrollContainer.current.scrollTop = 0;
      const element = scrollImage.current.children[activePage - 1];
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleNextPage = () => {
    if (activePage < totalPage - 1) {
      changeMode({}, false);
      setActivePage(activePage + 1);
      scrollContainer.current.scrollTop = 0;
      const element = scrollImage.current.children[activePage + 1];
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  const handleZoomIn = (zoomIn) => {
    zoomIn();
  };

  const handleZoomOut = (zoomOut) => {
    zoomOut();
  };

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
    // console.log(`@@@ ${process.env.REACT_APP_API_URL}/api/admin/fetchImagesData`);
    fetch(`${process.env.REACT_APP_API_URL}/api/admin/fetchImagesData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
    .then((res) => res.json())
    .then((response) => {
      console.log("@@@ DATA FROM SERVER: EDITOR: " + JSON.stringify(response));

        // TODO: Add all elements which were saved by user previously.
        let data = response.data;

        setOrgId(data.orgId);

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
        setSignatureFlow(data.signatureFlow);
        const signatureFlow = data.signatureFlow;

        let tempSignatoryIdList = [];

      if(signatureFlow === "OR") {
        const signatory = { id: 0, index: 0, bgColor: colors[0], toolColor: colorsWithHighOpacity[0], value: 0, label: "Signer 1"};
        
        signatoryList.push(signatory);
        tempSignatoryIdList.push(signatory.id);
      } else if ((signatureFlow === "AND" || signatureFlow === "SEQUENCE" || signatureFlow === "INPERSONSIGNING") && data.signatoryList != null && data.signatoryList.length > 0){
        data.signatoryList.forEach((signatory, index) => {
          signatory.index = index;
          signatory.bgColor = colors[index];
          signatory.toolColor = colorsWithHighOpacity[index];
          signatory.value = signatory.name;
          signatory.label = signatory.name;
          signatoryList.push(signatory);
          tempSignatoryIdList.push(signatory.id);
        });
      }

      console.log('@@@ signatoryIdList: FINAL : '+ tempSignatoryIdList);

        setSelectedSigner(signatoryList[0]);
        setSelectedSignatoryColor(signatoryList[0].toolColor);
        setOptions(signatoryList);
        setSignatoryIdList(tempSignatoryIdList);
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      });
    //
  }, []);

  React.useEffect(() => {
    const intervalStamp = setInterval(() => {
      if (document.getElementsByTagName('canvas')[0].style.height) {

        const element = document.getElementsByTagName('canvas')[0];
        const style = {
          height: element.style.height,
          width: element.style.width
        }

        // console.log("style: "+ JSON.stringify(style));
        setUnfocusDivStyle(style)

        clearInterval(intervalStamp)
      }

    }, 2000);
    return () => {
    }
  }, []);

  function showToast(type, message) {
    switch (type) {
      case "info":
        toast.info(message, {
          toastId: 'info'
        });
        break;
      case "success":
        toast.success(message, {
          toastId: 'success'
        });
        break;
      case "warn":
        toast.warn(message, {
          toastId: 'warn'
        });
        break;
      case "error":
        toast.error(message, {
          toastId: 'error'
        });
        break;
      default:
        toast(message);
        break;
    }
  }

  function validateCoordinates(finalCoordData) {
    // check if minimum one field is set for all the users
    if (finalCoordData.length === 0) return false;

    const finalCoordSignatoryIdList = [];
    for (let i = 0; i < finalCoordData.length; i++) {
      finalCoordSignatoryIdList.push(finalCoordData[i].signatory_id);
    }

    // console.log('@signatoryIdList: '+signatoryIdList);
    let checker = (arr, target) => target.every(v => arr.includes(v));
    return checker(finalCoordSignatoryIdList, signatoryIdList);
  }

  function changeMode(selectedEle, isEditMode, selectedOption = options[0]) {
    // console.log("@@@ changeMode: CALLED....");  
    setSelectedElement(selectedEle);
    setIsToolSelectionMode(isEditMode);
    setSelectedEleUserDefaultValue(selectedOption);
  }

  function handleSignatoryChange(fieldType, effect, e) {
    // console.log("@@@ handleSignatoryChange: CALLED....");
    if (effect === 'all_tool') {
      setSelectedSigner(e);
      setSelectedSignatoryColor(e.toolColor);
      setSelectedElement({});
      setIsToolSelectionMode(false);
      setSelectedEleUserDefaultValue(e);
      return;
    }
    else {
      setSelectedAssignerColor(e.toolColor);
    }

    switch (fieldType) {
      case "Signature":
        setSignElems(
          signElems.map((ele) => {
            if (ele.eleId === selectedElement.eleId) {
              ele.signatory_id = e.id;
              ele.user_index_id = e.id;
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
              ele.user_index_id = e.id;
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
              ele.user_index_id = e.id;
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
              ele.user_index_id = e.id;
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

    // console.log('@@@ foundField: '+ JSON.stringify(foundField));
    switch (foundField.name) {
      case "Signature": {
        let currentSignElems = signElems;
        let emptyArr = [];
        setSignElems(emptyArr);
        // console.log(
        //   "@@@ signElems: DELETE: BEFORE: " + JSON.stringify(signElems)
        // );
        let tempSignElems = currentSignElems.filter((ele) => ele.eleId !== selectedElement.eleId);
        // console.log('@@@ tempSignElems: '+ JSON.stringify(tempSignElems));
        setTimeout(() => {
          setSignElems(tempSignElems);
        }, 0);
        // );
        break;
      }
      case "Text": {
        let currentTextElems = textElems;
        let emptyArr = [];
        setTextElems(emptyArr);
        // console.log(
        //   "@@@ textElems: DELETE: BEFORE: " + JSON.stringify(textElems)
        // );
        let tempTextElems = currentTextElems.filter((ele) => ele.eleId !== selectedElement.eleId);
        // console.log('@@@ tempSignElems: '+ JSON.stringify(tempTextElems));
        setTimeout(() => {
          setTextElems(tempTextElems);
        }, 0);

        break;
      }
      case "Date": {
        let currrentDateElems = dateElems;
        let emptyArr = []
        setDateElems(emptyArr);
        // console.log(
        //   "@@@ dateElems: DELETE: BEFORE: " + JSON.stringify(dateElems)
        // );

        let tempDateElems = currrentDateElems.filter((ele) => ele.eleId !== selectedElement.eleId);
        // console.log('@@@ tempSignElems: '+ JSON.stringify(tempDateElems));
        setTimeout(() => {
          setDateElems(tempDateElems);
        }, 0);
        break;
      }
      case "Checkbox": {
        let currenctCheckboxElems = checkBoxElems;
        let emptyArr = [];
        setCheckBoxElems(emptyArr);
        // console.log(
        //   "@@@ checkBoxElems: DELETE: BEFORE: " + JSON.stringify(checkBoxElems)
        // );
        let tempCheckBoxElems = currenctCheckboxElems.filter((ele) => ele.eleId !== selectedElement.eleId)
        // console.log('@@@ tempSignElems: '+ JSON.stringify(tempCheckBoxElems));
        setTimeout(() => {
          setCheckBoxElems(tempCheckBoxElems);
        }, 0);
        break;
      }
      default: {
        break;
      }
    }
    changeMode({}, false, selectedSigner);
  }
  function handleSelectedEleNameChange(event) {
    // console.log("@@@ handleSelectedEleNameChange: CLICKED..... ");

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

  function addNewElement(fieldId, name, eleId, x = 0, y = 0, width, height) {
    // console.log("@@@ addNewElement..... ");

    setSelectedEleUserDefaultValue(selectedSigner);
    setPreviousCoord({ x: previousCoord.x + 30, y: previousCoord.y + 30 });
    return {
      field_id: fieldId,
      signatory_id: selectedSigner.id,
      user_index_id: selectedSigner.index,
      bgColor: selectedSigner.bgColor,
      name: name,
      eleId: eleId,
      pageId: activePage,
      // x: previousCoord.x,
      // y: previousCoord.y,
      x: x,
      y: y,
      width: width,
      height: height,

    };
  }

  function handleDragLeave(event) {
    // console.log('CURRENT: '+ documentContainer.current);
    const element = documentContainer.current;
    element.style.backgroundColor = "";
    element.style.opacity = 1;
  }

  function handleDragEnter(event) {
    // console.log("DRAG...enter: ");
    // console.log("DRAG...enter: X: " + event.pageX);
    // console.log("DRAG...enter: X: " + event.pageY);
    var rect = documentContainer.current.getBoundingClientRect();
    console.log(rect.top, rect.right, rect.bottom, rect.left);
    setDocumentBounding({ top: rect.top, right: rect.right, bottom: rect.bottom, left: rect.left });

    const element = documentContainer.current;
    element.style.backgroundColor = "#000000";
    element.style.opacity = 0.1;

    // const dragElement = draggableEle.current;
    // dragElement.dropEffect = "copy";
  }

  function handleDrag(event) {
    // console.log("DRAG...: ");
    // console.log("DRAG...: X: " + event.pageX);
    // console.log("DRAG...: X: " + event.pageY);
  }

  function handleSignToolDragStart(event) {

  }

  function handleSignToolDragEnd(event) {
    // var rect = documentContainer.current.getBoundingClientRect();
    // console.log(rect.top, rect.right, rect.bottom, rect.left);


    console.log("@@@ handleSignToolDragEnd: DRAG..... ");
    console.log("@@@ handleSignToolDragEnd: X..... " + event.pageX);
    console.log("@@@ handleSignToolDragEnd: Y..... " + event.pageY);
    const field = fields.find(field => field.type === 'Signature');
    const pagex = event.pageX - documentBounding.left;
    const pagey = event.pageY - documentBounding.top;

    setSelectedAssignerColor(selectedSignatoryColor);
    // console.log("Single click");
    let newSignEle = addNewElement(
      field.id,
      `Signature${signEleCount + 1}`,
      `signEle${signEleCount}`,
      pagex,
      pagey,
      field.width,
      field.height
    );

    setSignElems(signElems.concat(newSignEle));
    setSignEleCount(signEleCount + 1);
    changeMode(newSignEle, true, selectedSigner);
  }

  // function handleSignToolClick(event) {
  //   console.log("@@@ handleSignToolClick: CLICKED..... ");
  //   const field = fields.find(field => field.type === 'Signature');
  //   switch (event.detail) {
  //     case 1: {
  //       setSelectedAssignerColor(selectedSignatoryColor);
  //       // console.log("Single click");
  //       let newSignEle = addNewElement(
  //         field.id,
  //         `Signature${signEleCount + 1}`,
  //         `signEle${signEleCount}`,
  //         field.width,
  //         field.height
  //       );

  //       setSignElems(signElems.concat(newSignEle));
  //       setSignEleCount(signEleCount + 1);
  //       changeMode(newSignEle, true, selectedSigner);
  //       break;
  //     }
  //     case 2: {
  //       // console.log("Double click");
  //       break;
  //     }
  //     default: {
  //       break;
  //     }
  //   }
  // }

  function handleTextBoxToolDragEnd(event) {
    const field = fields.find(field => field.type === 'Text');
    const pagex = event.pageX - documentBounding.left;
    const pagey = event.pageY - documentBounding.top;

    setSelectedAssignerColor(selectedSignatoryColor);
    let newTextEle = addNewElement(
      field.id,
      `Text${textEleCount + 1}`,
      `textEle${textEleCount}`,
      pagex,
      pagey,
      field.width,
      field.height
    );
    setTextElems(textElems.concat(newTextEle));
    setTextEleCount(textEleCount + 1);
    changeMode(newTextEle, true, selectedSigner);
  }

  // function handleTextBoxToolClick(event) {
  //   console.log("@@@ handleTextBoxToolClick: CALLED..... ");

  //   // console.log("@@@ TEXT tool is selected!!! ");
  //   const field = fields.find(field => field.type === 'Text');
  //   switch (event.detail) {
  //     case 1: {
  //       // console.log("Single click");
  //       setSelectedAssignerColor(selectedSignatoryColor);
  //       let newTextEle = addNewElement(
  //         field.id,
  //         `Text${textEleCount + 1}`,
  //         `textEle${textEleCount}`,
  //         field.width,
  //         field.height
  //       );
  //       setTextElems(textElems.concat(newTextEle));
  //       setTextEleCount(textEleCount + 1);
  //       changeMode(newTextEle, true, selectedSigner);
  //       break;
  //     }
  //     case 2: {
  //       // console.log("Double click");
  //       break;
  //     }
  //     default: {
  //       break;
  //     }
  //   }
  // }

  function handleDateBoxToolDragEnd(event) {
    const field = fields.find(field => field.type === 'Date');
    const pagex = event.pageX - documentBounding.left;
    const pagey = event.pageY - documentBounding.top;

    setSelectedAssignerColor(selectedSignatoryColor);
    // console.log("Single click");
    let newDateEle = addNewElement(
      field.id,
      `Date${dateEleCount + 1}`,
      `dateEle${dateEleCount}`,
      pagex,
      pagey,
      field.width,
      field.height
    );
    setDateElems(dateElems.concat(newDateEle));
    setDateEleCount(dateEleCount + 1);
    changeMode(newDateEle, true, selectedSigner);
  }

  // function handleDateBoxToolClick(event) {
  //   console.log("@@@ handleDateBoxToolClick: CALLED..... ");

  //   // console.log("@@@ DATE tool is selected!!! ");
  //   const field = fields.find(field => field.type === 'Date');

  //   switch (event.detail) {
  //     case 1: {
  //       setSelectedAssignerColor(selectedSignatoryColor);
  //       // console.log("Single click");
  //       let newDateEle = addNewElement(
  //         field.id,
  //         `Date${dateEleCount + 1}`,
  //         `dateEle${dateEleCount}`,
  //         field.width,
  //         field.height
  //       );
  //       setDateElems(dateElems.concat(newDateEle));
  //       setDateEleCount(dateEleCount + 1);
  //       changeMode(newDateEle, true, selectedSigner);
  //       break;
  //     }
  //     case 2: {
  //       // console.log("Double click");
  //       break;
  //     }
  //     default: {
  //       break;
  //     }
  //   }
  // }

  function handleCheckBoxToolDragEnd(event) {
    const field = fields.find(field => field.type === 'Checkbox');
    const pagex = event.pageX - documentBounding.left;
    const pagey = event.pageY - documentBounding.top;

    setSelectedAssignerColor(selectedSignatoryColor);
    // console.log("Single click");
    let newCheckEle = addNewElement(
      field.id,
      `Checkbox${checkBoxEleCount + 1}`,
      `checkBoxEle${checkBoxEleCount}`,
      pagex,
      pagey,
      field.width,
      field.height
    );
    setCheckBoxElems(checkBoxElems.concat(newCheckEle));
    setCheckBoxEleCount(checkBoxEleCount + 1);
    changeMode(newCheckEle, true, selectedSigner);
  }

  // function handleCheckBoxToolClick(event) {
  //   console.log("@@@ handleCheckBoxToolClick: CALLED..... ");

  //   const field = fields.find(field => field.type === 'Checkbox');
  //   switch (event.detail) {
  //     case 1: {
  //       setSelectedAssignerColor(selectedSignatoryColor);
  //       // console.log("Single click");
  //       let newCheckEle = addNewElement(
  //         field.id,
  //         `Checkbox${checkBoxEleCount + 1}`,
  //         `checkBoxEle${checkBoxEleCount}`,
  //         field.width,
  //         field.height
  //       );
  //       setCheckBoxElems(checkBoxElems.concat(newCheckEle));
  //       setCheckBoxEleCount(checkBoxEleCount + 1);
  //       changeMode(newCheckEle, true, selectedSigner);
  //       break;
  //     }
  //     case 2: {
  //       // console.log("Double click");
  //       break;
  //     }
  //     default: {
  //       break;
  //     }
  //   }
  // } 

  function handleDragStart(id, toolType, e) {
    // console.log('@@@ handleDragStart: CALLED.....');
    setPanningState({ disabled: true });
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
    // console.log("@@@ ELE :" + JSON.stringify(ele));
    setSelectedElement(ele[0]);
    setIsToolSelectionMode(true);
    setSelectedEleUserDefaultValue(
      options.filter((option) => option.id === ele[0].signatory_id)
    );
    setSelectedAssignerColor(options.filter((option) => option.id === ele[0].signatory_id)[0].toolColor);
  }

  function handleDragStop(id, toolType, data, e) {
    let tempEle;
    switch (toolType) {
      case "Signature": {
        tempEle = signElems.filter((ele) => ele.eleId === id);
        break;
      }
      case "Text": {
        tempEle = textElems.filter((ele) => ele.eleId === id);
        break;
      }
      case "Date": {
        tempEle = dateElems.filter((ele) => ele.eleId === id);
        break;
      }
      case "Checkbox": {
        tempEle = checkBoxElems.filter((ele) => ele.eleId === id);
        break;
      }
      default: {
        break;
      }
    }
    let toolWidth = tempEle[0].width;
    let toolHeight = tempEle[0].height;
    // if(data.x < 0){
    //   data.x=0;
    // }
    // else if(data.x > documentXDistanceFromLeftSideBar - toolWidth){
    //   data.x = documentXDistanceFromLeftSideBar - toolWidth;
    // }
    // else{
    //   data.x = data.x;
    // }
    // if(data.y < 0){
    //   data.y=0;
    // }
    // else if(data.y > documentYDistanceFromTopSideBar - toolHeight){
    //   data.y = documentYDistanceFromTopSideBar - toolHeight;
    // }
    // else{
    //   data.y = data.y;
    // }
    setPanningState({ disabled: false });
    // console.log('@@@ handleDragStop: CALLED.....'+JSON.stringify(data));
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

  // function handlePaggination(index) {
  //   // console.log('INDEX: '+ index);
  //   if (index === activePage) return;
  //   setActivePage(index);
  //   changeMode({}, false);
  //   // getImage(index);
  //   // if(scrollContainer) {
  //   //   scrollContainer.current.scrollTop = 0;  
  //   //   const element = scrollImage.current.children[index];

  //   //   element?.scrollIntoView({ behavior: "smooth", block: "start" });
  //   // }
  // }

  function handlePaggination(index) {
    if (index === activePage) return;
    setActivePage(index);
    changeMode({}, false);
    // getImage(index);
    scrollContainer.current.scrollTop = 0;
    const element = scrollImage.current.children[index];
    if (element) {
      const containerRect = scrollImage.current.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const offsetTop = elementRect.top - containerRect.top;
      scrollImage.current.scrollTop += offsetTop;
    }
  }

  function changeSignatoryIdToNull(finalDataList) {
    finalDataList.forEach(data => {
      data.signatory_id = null;
    });
  }

  function handleContinue() {
    setIsLoading(true);
    setIsFetching(false);

    const finalCoordData = [...signElems, ...textElems, ...dateElems, ...checkBoxElems];
    // console.log('HANDLE CONTINUE: '+JSON.stringify(finalCoordData));
    const isValid = validateCoordinates(finalCoordData);

    if (!isValid) {
      setIsLoading(false);
      showToast("error", "Please add atleast one field for each user.");
      return;
    }

    if (template_instance_uuid == null) {
      // 
      changeSignatoryIdToNull(finalCoordData);
    }

    const body = {
      // TODO: Merge all types of element and send a object data.
      data: finalCoordData,
      uuid: uuid,
      templateInstanceUUID: template_instance_uuid
    };
    // console.log('@@@ BODY: '+ JSON.stringify(body));
    fetch(`${process.env.REACT_APP_API_URL}/api/admin/setTemplateCoordinates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((response) => {
        if (template_instance_uuid == null) {
          window.parent.postMessage({ "messageFrom": "EW Sign Editor", "status": true, "action": "Create Template" }, "*");
        } else {
          window.parent.postMessage({ "messageFrom": "EW Sign Editor", "status": true, "action": "Create TI", "signatureFlow": signatureFlow, "uuid": uuid, "template_instance_uuid": template_instance_uuid }, "*");
        }
        // console.log(JSON.stringify(response));
        setIsFileShared(true);
      })
      .catch((error) => {
        window.parent.postMessage({ "messageFrom": "EW Sign Editor", "status": false, "action": template_instance_uuid == null ? "Create Template" : "Create TI", "errorMessage": JSON.stringify(error) }, "*");
        // console.log("@@@ Saved coordinate: " + JSON.stringify(error));
        toast.error(JSON.stringify(error));
      })
      .finally(() => {
        setIsLoading(false);
      });
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
        theme="colored"
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
            backgroundColor: "#fff",
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
            <img src={loadingGif} style={{ minWidth: "150px", maxWidth: "250px" }} width="40%" />
            <br />
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
              color={selectedSignatoryColor}
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
                ref={draggableEle}
                type="button"
                className="flex-item tool-btn signature-btn"
                onDragStart={handleSignToolDragStart}
                onDragEnd={handleSignToolDragEnd}
                draggable
              >
                <RiBallPenLine className="tool-icon" />{" "}
                <p>Signature</p>
              </button>

              <button
                type="button"
                className="tool-btn btn-margin"
                onDragEnd={handleTextBoxToolDragEnd}
                draggable
              >
                <BsTextareaT className="tool-icon" />{" "}
                <p>Text</p>
              </button>

              <button
                type="button"
                className="tool-btn btn-margin flex-item "
                onDragEnd={handleDateBoxToolDragEnd}
                draggable
              >
                <BsCalendar2Date className="tool-icon" />
                <p>Date</p>
              </button>

              <button
                type="button"
                className="tool-btn btn-margin flex-item "
                onDragEnd={handleCheckBoxToolDragEnd}
                draggable
              >
                <BsCheck2Square className="tool-icon" />{" "}
                <p>Checkbox</p>
              </button>

              <button
                type="button"
                disabled
                className="tool-btn btn-margin disabled-btn flex-item">
                <BsCalendar2Date className="tool-icon" />{" "}
                <p>Date Signed</p>
              </button>

              <button
                type="button"
                disabled
                className="tool-btn btn-margin disabled-btn flex-item">
                <BiUser className="tool-icon" />{" "}
                <p>Full Name</p>
              </button>

              <button
                type="button"
                disabled
                className="tool-btn btn-margin disabled-btn flex-item" >
                <MdOutlineAlternateEmail className="tool-icon" />{" "}
                <p>Email</p>
              </button>

              <button
                type="button"
                disabled
                className="tool-btn btn-margin disabled-btn flex-item">
                <BsBuildings className="tool-icon" />{" "}
                <p>Company</p>
              </button>

              <button
                type="button"
                disabled
                className="tool-btn btn-margin disabled-btn flex-item">
                <RiSuitcaseLine className="tool-icon" />{" "}
                <p>Job Title</p>
              </button>
              <div className="flex-item" style={{ marginLeft: '67px' }}></div>
            </div>
          </div>
          <div>

            <div className="document" id="center-img-div" ref={scrollContainer} onDrag={handleDrag} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave}>
              <TransformWrapper defaultScale={1} maxScale={2.5}
                disablePan={true}
                centerZoomedOut
                disablePadding
                wheel={{ disabled: true }}
                panning={panningState}
                onPanning={() => changeMode({}, false)}
                doubleClick={{ disabled: true }}
                scale={scale}>
                {({ zoomIn, zoomOut }) => (
                  <React.Fragment>
                    {isToolSelectionMode ? null : (
                      <footer className="footer">
                        <Paggination activePage={activePage} totalPage={totalPage} handlePaggination={handlePaggination}></Paggination>
                      </footer>
                    )}
                    <TransformComponent>
                      {signElems.map((ele) => {
                        if (ele.pageId === activePage) {
                          // console.log('@@@ RENDERING SIGNATURE: INSIDE: '+ JSON.stringify(ele));
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
                              bounds={scrollContainer}
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
                          // console.log('@@@ RENDERING TEXT: INSIDE: '+ JSON.stringify(ele));
                          const toolName = "Text";
                          const bgColor = ele.bgColor;
                          const field = fields.find((field) => field.type === toolName);
                          return (
                            <DragTool
                              isEditMode={
                                selectedElement && ele.eleId === selectedElement.eleId
                              }
                              enableResizing={
                                { left: true, right: true }
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
                          // console.log('@@@ RENDERING DATE: INSIDE: '+ JSON.stringify(ele));
                          const toolName = "Date";
                          const bgColor = ele.bgColor;
                          const field = fields.find(field => field.type === toolName);
                          return (
                            <DragTool
                              isEditMode={
                                selectedElement && ele.eleId === selectedElement.eleId
                              }
                              enableResizing={
                                { top: true, bottom: true }
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
                          // console.log('@@@ RENDERING DATE: INSIDE: '+ JSON.stringify(ele));
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
                                <div></div>

                                // <BsApp
                                //   className={`${toolName.toLowerCase()}-tool-icon-position`}
                                // />
                              }
                            />
                          );
                        }
                      })}

                      {/* {console.log(img)} */}
                      <div
                        ref={documentContainer}
                        onClick={() => changeMode({}, false)}
                        style={{
                          position: "absolute",
                          top: 0,
                          bottom: 0,
                          left: 0,
                          right: 0,
                          zIndex: 1,
                          height: unfocusDivStyle.height,
                          width: unfocusDivStyle.width
                        }}
                      ></div>
                      {/* {console.log(template_instance_uuid != null && template_instance_uuid.length>0 ? `${process.env.REACT_APP_API_URL}/fetchpdf?&uuid=${uuid}&tiUUID=${template_instance_uuid}` : `${process.env.REACT_APP_API_URL}/fetchpdf?uuid=${uuid}`)}    */}
                      <div class="testing">
                        <PdfViewer
                          pdf={template_instance_uuid != null && template_instance_uuid.length > 0 ? `${process.env.REACT_APP_API_URL}/fetchpdf?&uuid=${uuid}&tiUUID=${template_instance_uuid}` : `${process.env.REACT_APP_API_URL}/fetchpdf?uuid=${uuid}`}
                          activePage={activePage}
                          setPDFLoading={setIsPDFLoading}
                          setPageCount={settotalPage}
                          scale={defaultCanvasScale}
                        />
                      </div>
                    </TransformComponent>
                  </React.Fragment>
                )}
              </TransformWrapper>
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

                <div style={{ padding: "10px", }}>
                  <label htmlFor="currentSignatory" class="field-lbl">Assigned to</label>
                  <div class="remove-margin">
                    <CustomSelect
                      color={selectedAssignerColor}
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

                <div key={selectedElement.name} style={{ padding: "10px", }}>
                  <label class="field-lbl">Field name<span style={{ color: "red" }}>*</span></label>
                  <input defaultValue={selectedElement.name} onChange={(event) => handleSelectedEleNameChange(event)}
                    class="input-field" />
                </div>
                <div style={{ padding: "10px", }}>
                <span class="field-lbl">Required</span>
                  <label className="toggle-button" >
                    <input style={{ padding: "5px", }}
                      type="checkbox"
                      checked="false"
                    />
                    <span className="slider"></span>
                   
                  </label>
                 
                </div>
              </div>
            ) : null}

            <div ref={scrollImage} style={{ position: "absolute",overflowY: "scroll", height: "92vh"}}>
              {/* {console.log('@@@ pageCount: '+totalPage)} */}
              {totalPage !== 0 && Array.from(Array(totalPage), (e, i) => {

                return <div
                  className="flexbox-container paggination"
                  onClick={() => handlePaggination(i)}
                  key={i}
                >
                  <div className="flexbox-item">
                    <div className="page-count">{i + 1}</div>
                    <div className="page-img" style={{ border: i === activePage ? "2px solid #6e859b" : "1px solid #b3b3b34d", }}>
                      <PdfViewer
                        pdf={template_instance_uuid != null && template_instance_uuid.length > 0 ? `${process.env.REACT_APP_API_URL}/fetchpdf?&uuid=${uuid}&tiUUID=${template_instance_uuid}` : `${process.env.REACT_APP_API_URL}/fetchpdf?uuid=${uuid}`}
                        activePage={i}
                        setPDFLoading={setIsPDFLoading}
                        setPageCount={settotalPage}
                        scale={scaleForImages}
                      />
                    </div>
                  </div>
                </div>
              })}
            </div>
          </div>

          <div className="navbar">
            {/* <img src="https://eruditeworksprivatelimited4--partial.sandbox.file.force.com/servlet/servlet.ImageServer?id=0159D0000001Rlv&oid=00D9D0000008fSF&lastMod=1686396736000" class="logo"/> */}
            <img src={`${process.env.REACT_APP_API_URL}/api/admin/branding/fetchBrandLogo?orgId=${orgId}`} class="logo" />

            {!isToolSelectionMode && (
              <button className="continue-btn" onClick={handleContinue} >
                {template_instance_uuid == null ? "SAVE TEMPLATE" : "SEND TO SIGN"}
              </button>
            )}
            {isToolSelectionMode && (
              <button className="continue-btn" onClick={() => { setIsToolSelectionMode(false); }}>
                Done
              </button>
            )}
          </div>

        </div>
      )}
    </>
  );
}