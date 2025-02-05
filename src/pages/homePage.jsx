import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
//
import CustomSelect from "components/custom-select";
import PdfViewer from "components/PDFViewer";
import { Paggination } from "components/common/paggination";
//
import { ShowToast } from "utils/showToast";
//
import { TiTick } from "react-icons/ti";
import fetchDocumentDataService from "services/fetchDocumentDataService";
import SetTemplateCoordinatesService from "services/setTemplateCoordinatesService";
import updateInstanceStatus from "services/updateInstanceStatus";
//
import { useState,useEffect } from "react";
import {
  CheckboxButtonContainer,
  DateButtonContainer,
  DateSignedButtonContainer,
  EmailButtonContainer,
  SignatureButtonContainer,
  TextBoxButtonContainer,
  //
  SignatureCoordinatesContainer,
  CheckBoxCoordinatesContainer,
  DateCoordinatesContainer,
  TextBoxCoordinatesContainer,
} from "containers";
//
import SelectionModeContainer from "containers/selectionMode/selectionModeContainer";

//
import { setGeneralDocumentData } from "redux/slices/generalDocumentReducer";
import { setActiveSignatory } from "redux/slices/activeSignatoryReducer";
import { setActivePageNumber } from "redux/slices/activePageNumberReducer";
import { setActiveCoordinate } from "redux/slices/activeCoordinateReducer";
import { setSupportedFields } from "redux/slices/supportedFieldsReducer";
import { setSignatoryList } from "redux/slices/signatoryListReducer";
import { setSalesforceFieldsMetadata } from "redux/slices/salesforceFieldsMetadataReducer";
//
import { ToastTypeEnum } from "constants/toastTypeEnum";

//
import loadingGif from "images/loading-cropped.gif";
import SessionTimer from "components/session-timer";
import CustomModal from "components/common/custom-modal";
import { List } from "antd";
import { type } from "@testing-library/user-event/dist/type";
import Confirmation from "components/confirmation";

export default function Home() {
  const signatoryList = useSelector(
    (state) => state.signatoryList.signatoryList
  );

  const activeSignatory = useSelector(
    (state) => state.activeSignatory.activeSignatory
  );

  const activeCoordinate = useSelector(
    (state) => state.activeCoordinate.activeCoordinate
  );

  const activePageNumber = useSelector(
    (state) => state.activePageNumber.activePageNumber
  );

  const isSelectionMode = useSelector(
    (state) => state.activeCoordinate.isSelectionMode
  );

  const signatureCoordinates = useSelector(
    (state) => state.signatureCoordinates.signatureCoordinates
  );

  const textBoxCoordinates = useSelector(
    (state) => state.textBoxCoordinates.textBoxCoordinates
  );

  const dateCoordinates = useSelector(
    (state) => state.dateCoordinates.dateCoordinates
  );

  const checkBoxCoordinates = useSelector(
    (state) => state.checkBoxCoordinates.checkBoxCoordinates
  );

  const generalDocumentData = useSelector(
    (state) => state.generalDocumentData.generalDocumentData
  );

  const allCoordinates = [
    ...signatureCoordinates,
    ...textBoxCoordinates,
    ...dateCoordinates,
    ...checkBoxCoordinates,
  ];
  const writebackFields = allCoordinates.filter((coord) => coord.writeBack);
  const updateFromSalesforceFields = allCoordinates.filter((coord) => coord.updateFromSalesforce);
  console.log("updateFromSalesforceFields",updateFromSalesforceFields);
  console.log("updateFromSalesforceFields",JSON.stringify(updateFromSalesforceFields));
 // Create a mapping of fields from `writeback` or `updateFromSalesforce` and their corresponding `mappingField`
 const writebackFieldsData = writebackFields.map((field) => ({
  mappingField: field.mappingField,
}));

const updateFromSalesforceFieldsData = updateFromSalesforceFields.map((field) => ({
  mappingField: field.mappingField,
}));
console.log("updateFromSalesforceFieldsData",JSON.stringify(updateFromSalesforceFieldsData));

  const defaultCanvasScale = "1";
  const scaleForImages = "0.3";

  const [orgId, setOrgId] = React.useState("");

  // const [signatoryIdList, setSignatoryIdList] = React.useState([]);

  const [scale, setScale] = React.useState(1.0);
  const [panningState, setPanningState] = React.useState({ disabled: false });

  // const draggableEle = React.useRef(null);
  const scrollContainer = React.useRef(null);
  const scrollImage = React.useRef(null);
  const documentContainer = React.useRef(null);
  const [searchParams] = useSearchParams();
  const [popup, setPopup]= useState(false) 
  const [isPDFLoading, setIsPDFLoading] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isFetching, setIsFetching] = React.useState(true);
  const [isFileShared, setIsFileShared] = React.useState(false);
  const [isSessionEnded, setIsSessionEnded] = React.useState(false);
  const [isSessionEndedModalOpen, setIsSessionEndedModalOpen] = React.useState(false);
  const [isFinalCountdownActive, setIsFinalCountdownActive] = React.useState(false);
  const [finalCountDownTime, setFinalCountDownTime] = React.useState(0);
  // const sessionTime = 10; // 10 seconds
  const sessionTime = 3600 * 2; // 2 hours session
  
  const uuid = searchParams.get("uuid");
  const template_instance_uuid =
    searchParams.get("template_instance_uuid") ?? null;

  // const [activePage, setActivePage] = React.useState(0);
  const [totalPage, settotalPage] = React.useState([]);
  const [documentBounding, setDocumentBounding] = React.useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });
  const [unfocusDivStyle, setUnfocusDivStyle] = React.useState({
    height: 0,
    width: 0,
  });

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const getDocumentData = async (reqBody, iv, orgId, token) => {
    const {uuid, uuidTemplateInstance} = reqBody;

    dispatch(
      setGeneralDocumentData({
        generalDocumentData: {
          templateUUID: uuid,
          documentUUID: uuidTemplateInstance,
          iv: iv,
          token: token,
          orgId: orgId
        },
      })
    );

    try {
      const apiResult = await fetchDocumentDataService(
        reqBody
      );
      const data = apiResult.data;
      console.log("data",data);
      const sobjectAPIName = apiResult.sobjectAPIName;
      console.log("homepage sobject",sobjectAPIName);
      const signatoryList = apiResult.signatoryList;
      dispatch(
        setSalesforceFieldsMetadata({
          sobjectAPIName: sobjectAPIName,
          salesforceFieldsMetadata: data.sobjectFields,
        })
      );
      setOrgId(data.orgId);
      // signature flow will remain constant
      dispatch(
        setGeneralDocumentData({
          generalDocumentData: {
            orgId: data.orgId,
            templateUUID: uuid,
            documentUUID: uuidTemplateInstance,
            signatureFlow: data.signatureFlow,
            iv: iv,
            token: token,
          },
        })
      );
      dispatch(setSupportedFields({ supportedFields: data.allFieldsData }));
      dispatch(setSignatoryList({ signatoryList: signatoryList }));
      dispatch(
        setActiveSignatory({
          activeSignatory: signatoryList[0],
        })
      );
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } catch (error) {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
      
      if(error && error.message && error.message.includes('Session has expired')) {
        navigate("/session-expired", { replace: true });
        return;
      }
      
    }
  };

  React.useEffect(() => {
    // setup function
    const uuid = searchParams.get("uuid");
    const uuidTemplateInstance = searchParams.get("template_instance_uuid");
    let iv = searchParams.get("iv");
    let token = searchParams.get("token");
    let orgId = searchParams.get("orgId");
    
    console.log("@@@ uuid: " + uuid);
    console.log("@@@ uuidTemplateInstance: " + uuidTemplateInstance);
    
    if (uuid == null && uuidTemplateInstance == null && (token == null || iv == null || orgId == null)) {
      navigate("/page-not-found", { replace: true });
      return;
    }

    iv = decodeURIComponent(iv).trim();
    token = decodeURIComponent(token).trim();
    orgId = orgId.trim();

    const reqBody = {uuid, templateInstanceUUID: uuidTemplateInstance};
    getDocumentData(reqBody, iv, orgId, token);
  }, []);

  React.useEffect(() => {
    const intervalStamp = setInterval(() => {
      if (document.getElementsByTagName("canvas")[0]?.style.height) {
        const element = document.getElementsByTagName("canvas")[0];
        const style = {
          height: element.style.height,
          width: element.style.width,
        };
        setUnfocusDivStyle(style);

        clearInterval(intervalStamp);
      }
    }, 2000);
    return () => {
      clearInterval(intervalStamp);
    };
  }, []);

function validateCoordinates(finalCoordData) {
  console.log("finalCoordData", finalCoordData);
  console.log("finalCoordData", JSON.stringify(finalCoordData));

  if (finalCoordData.length === 0) {
    return {
      isValidate: false,
      msg: "Please add at least one field for each user.",
    };
  }

  const finalCoordSignatoryIdList = finalCoordData.map(coord => coord.signatory_id);

  let isValidSignatories = finalCoordSignatoryIdList.every(signatoryId =>
    signatoryList.some(signatory => signatory.id === signatoryId)
  );

  if (!isValidSignatories) {
    return {
      isValidate: false,
      msg: "Please add at least one field for each user.",
    };
  }

  let missingRequiredCoordinate = false;
  let signatoryIdx = 0;

  for (let i = 0; i < finalCoordSignatoryIdList.length; i++) {
    const signatoryId = finalCoordSignatoryIdList[i];
    
    for (let j = 0; j < finalCoordData.length; j++) {
      const coord = finalCoordData[j];

      if (coord.signatory_id === signatoryId) {
        if (coord.isRequired === true) {
          missingRequiredCoordinate = true;
          break; 
        }
      }
    }

    if (!missingRequiredCoordinate) {
      return {
        isValidate: false,
        msg: "Please add at least one required field for each user.",
      };
    }

    missingRequiredCoordinate = false;
  }

  let salesforceFieldData = { isValidate: true, item: "" };

  finalCoordData.forEach((item) => {
    if (
      (item.writeBack || item.updateFromSalesforce) &&
      Object.values(item.mappingField).filter(
        (innerItem) => innerItem.length === 0
      ).length > 0
    ) {
      salesforceFieldData.isValidate = false;
      salesforceFieldData.item = item;
    }
  });

  if (!salesforceFieldData.isValidate) {
    dispatch(
      setActiveCoordinate({
        activeCoordinate: salesforceFieldData.item,
        isSelectionMode: true,
      })
    );

    return {
      isValidate: false,
      msg: "Please add field mapping for this field",
    };
  }

  return { isValidate: true, msg: "done" };
}

  

  const handleGlobalSignatoryChange = (selectedSignatory) => {
    dispatch(
      setActiveCoordinate({ activeCoordinate: {}, isSelectionMode: false })
    );
    dispatch(
      setActiveSignatory({
        activeSignatory: selectedSignatory,
      })
    );
  };

  function handleDragLeave(event) {
    // console.log('CURRENT: '+ documentContainer.current);
    const element = documentContainer.current;
    element.style.backgroundColor = "";
    element.style.opacity = 1;
  }

  function handleDragEnter(event) {
    var rect = documentContainer.current.getBoundingClientRect();
    console.log(rect.top, rect.right, rect.bottom, rect.left);
    setDocumentBounding({
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left,
    });

    const element = documentContainer.current;
    element.style.backgroundColor = "#000000";
    element.style.opacity = 0.1;
  }

  function handlePaggination(index) {
    if (index === activePageNumber) return;

    dispatch(setActivePageNumber({ activePageNumber: index }));
    resetSelectionMode();
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

  const changeSignatoryIdToNull = (finalDataList) => {
    return finalDataList.map((data) => ({ ...data, signatory_id: null }));
  };

  const resetSelectionMode = () => {
    console.log("resetSelectionMode");
    dispatch(
      setActiveCoordinate({ activeCoordinate: {}, isSelectionMode: false })
    );
  };

  const [confirmationPopup,setConfirmationPopup]=useState(false)

  const [agreeToTnC, setAgreeToTnC]=useState(false)

 // const continueHandleContinue = async () =>{
  //   let finalCoordData = [
  //     ...signatureCoordinates,
  //     ...textBoxCoordinates,
  //     ...dateCoordinates,
  //     ...checkBoxCoordinates,
  //   ];
  //   console.log("HANDLE CONTINUE: " + JSON.stringify(finalCoordData));

  //   const validation = validateCoordinates(finalCoordData);

  //   if (!validation.isValidate) {
  //     setIsLoading(false);
  //     ShowToast(ToastTypeEnum.ERROR, validation.msg);
  //     return;
  //   }

  //   if (template_instance_uuid == null) {
  //     //
  //     finalCoordData = changeSignatoryIdToNull(finalCoordData);
  //   }

  //   console.log("@@@ finalCoordData: " + JSON.stringify(finalCoordData));

  //   try {
  //     await SetTemplateCoordinatesService(
  //       finalCoordData,
  //       uuid,
  //       template_instance_uuid
  //     );
  //     let state="SENT";
  //     // await updateInstanceStatus(template_instance_uuid,state);

  //     ShowToast(ToastTypeEnum.SUCCESS, "Template saved.");

  //     const message = {
  //       messageFrom: "EW Sign Editor",
  //       status: true,
  //       action:
  //         template_instance_uuid == null ? "Create Template" : "Create TI",
  //     };

  //     if (template_instance_uuid != null) {
  //       console.log("TI NOT NULL");
  //       console.log("@@@ signatureFlow: " + generalDocumentData.signatureFlow);
  //       message.signatureFlow = generalDocumentData.signatureFlow;
  //       message.uuid = uuid;
  //       message.template_instance_uuid = template_instance_uuid;
  //     }
  //     console.log("POST MESSAGE: " + JSON.stringify(message));
  //     window.parent.postMessage(message, "*");
  //     setIsLoading(false);
  //     setConfirmationPopup(false)
  //   } catch (error) {
  //     const message = {
  //       messageFrom: "EW Sign Editor",
  //       status: false,
  //       action:
  //         template_instance_uuid == null ? "Create Template" : "Create TI",
  //       errorMessage: JSON.stringify(error),
  //     };
  //     window.parent.postMessage(message, "*");
  //     // console.log("@@@ Saved coordinate: " + JSON.stringify(error));
  //     ShowToast(ToastTypeEnum.ERROR, JSON.stringify(error));
  //     setIsLoading(false);
  //   }

  // }
  // const handleContinue = async () => {
  //   setIsFetching(false);
  //   if(confirmationPopup===false){
  //     setConfirmationPopup(true)
  //   }else{

  //     setConfirmationPopup(false);
  //   }
  //   handleAgreeToTnc()

  // };
  // const handleAgreeToTnc=()=>{
  //   if(agreeToTnC===true){
  //     setIsLoading(true);
  //     continueHandleContinue()
  //     // setConfirmationPopup(false)
  //   }
  // }
  // const closePopup=()=>{  
  //   setConfirmationPopup(false)
  // }
  // useEffect(()=>{
  //   handleAgreeToTnc();
  // },[agreeToTnC])

  // const getContinueEventFromConfirmation=(evt)=>{
  //   setAgreeToTnC(evt)
  //   console.log('setTNC TO TRUE')
  //   console.log(agreeToTnC)
  // }

  const continueHandleContinue = async () => {
    let finalCoordData = [
      ...signatureCoordinates,
      ...textBoxCoordinates,
      ...dateCoordinates,
      ...checkBoxCoordinates,
    ];

    const validation = validateCoordinates(finalCoordData);

    if (!validation.isValidate) {
      setIsLoading(false);
      ShowToast(ToastTypeEnum.ERROR, validation.msg);
      return;
    }

    // try {
    //   await SetTemplateCoordinatesService(finalCoordData, uuid, template_instance_uuid);
    //   ShowToast(ToastTypeEnum.SUCCESS, "Template saved.");
    //   const message = {
    //     messageFrom: "EW Sign Editor",
    //     status: true,
    //     action:
    //       template_instance_uuid == null ? "Create Template" : "Create TI",
    //   };

    //   if (template_instance_uuid != null) {
    //     console.log("TI NOT NULL");
    //     console.log("@@@ signatureFlow: " + generalDocumentData.signatureFlow);
    //     message.signatureFlow = generalDocumentData.signatureFlow;
    //     message.uuid = uuid;
    //     message.template_instance_uuid = template_instance_uuid;
    //   }
    //   console.log("POST MESSAGE: " + JSON.stringify(message));
    //   window.parent.postMessage(message, "*");

    //   setIsLoading(false);
    //   setConfirmationPopup(false); // Close the popup after save
    // } catch (error) {
    //   ShowToast(ToastTypeEnum.ERROR, JSON.stringify(error));
    //   setIsLoading(false);
    // }
    try {
          await SetTemplateCoordinatesService(
            finalCoordData,
            uuid,
            template_instance_uuid
          );
          let state="SENT";
          // await updateInstanceStatus(template_instance_uuid,state);
    
          ShowToast(ToastTypeEnum.SUCCESS, "Template saved.");
    
          const message = {
            messageFrom: "EW Sign Editor",
            status: true,
            action:
              template_instance_uuid == null ? "Create Template" : "Create TI",
          };
    
          if (template_instance_uuid != null) {
            console.log("TI NOT NULL");
            console.log("@@@ signatureFlow: " + generalDocumentData.signatureFlow);
            message.signatureFlow = generalDocumentData.signatureFlow;
            message.uuid = uuid;
            message.template_instance_uuid = template_instance_uuid;
          }
          console.log("POST MESSAGE: " + JSON.stringify(message));
          window.parent.postMessage(message, "*");
          setIsLoading(false);
          setConfirmationPopup(false)
        } catch (error) {
          const message = {
            messageFrom: "EW Sign Editor",
            status: false,
            action:
              template_instance_uuid == null ? "Create Template" : "Create TI",
            errorMessage: JSON.stringify(error),
          };
          window.parent.postMessage(message, "*");
          // console.log("@@@ Saved coordinate: " + JSON.stringify(error));
          ShowToast(ToastTypeEnum.ERROR, JSON.stringify(error));
          setIsLoading(false);
        }
  };

  const handleContinue = async () => {
    setIsFetching(false);
    if (confirmationPopup === false) {
      setConfirmationPopup(true); // Open confirmation popup
    } else {
      setConfirmationPopup(false); // Close confirmation popup
    }
    handleAgreeToTnc();
  };

  const handleAgreeToTnc = () => {
    if (agreeToTnC === true) {
      setIsLoading(true);
      continueHandleContinue();
    }
  };

  const closePopup = () => {
    setConfirmationPopup(false);
  };

  const getContinueEventFromConfirmation = (evt) => {
    setAgreeToTnC(evt);
  };

  useEffect(() => {
    handleAgreeToTnc();
  }, [agreeToTnC]);

  const handleSessionExpired = () => {
    console.log('Session expired...');
    // session has expired
    // warn user to click "Send To Sign" button in 10 minutes other you will loose all your changes.

    setIsSessionEndedModalOpen(true);
  }
  
  const closeModal = () => {
    setFinalCountDownTime((10 * 60) + sessionTime);
    setIsSessionEnded(true);
    setIsSessionEndedModalOpen(false);
    setIsFinalCountdownActive(true);
    setTimeout(() => {
      // Reload the page
      navigate("/session-expired", { replace: true });
      return;
    }, 200);
  }

  const modalChildren = <p style={{padding: "20px"}}>Your editor access session will expire in 10 minutes. Please save your work before then, as you won't be able to save it after that time and risk losing all of your changes. The system will be reloaded automatically after 10 minutes.</p>;

  const [salesforceFields,setSalesforceFields]=useState({})
 
  const handleSalesforceFields = async (data) => {
    const dt =  await data
    console.log("Data received in parent:", dt);
    setSalesforceFields(dt)  
    const a = await dt
    console.log(a)
    setSalesforceFields(a)
    // return dt
  };

  // const [dateList, setDateList]=useState([])
  // const updateSalesforceData = async () => {
  //   // We will update the lists conditionally based on writeBack and updateFromSalesforce
  //   const obj2 = JSON.parse(salesforceFields)
  //   console.log(obj2.writeback)
  //   console.log(obj2.updateFromSalesforce)
  //   let dateList = []

  //   if(dateList[0] == undefined || dateList[0]== null){
  //     dateList=[...dateList,obj2]
  //     // console.log("undefined")
  //     console.log(dateList)
  //   }else{
  //     console.log("map")
  //     dateList.map((obj,index)=>{
  //       if(obj.apiName === obj2.apiName){
  //         console.log("exists : "+obj2.apiName)
  //         console.log(index)
  //       }
  //       else if(obj.apiName !== obj2.apiName){
  //         dateList=[ ...dateList,obj2]  //[ ...dateList, obj2]
  //         console.log(dateList)
  //         console.log(index)
  //       }else{
  //         console.error("error")
  //       }

        
  //     })
  //   }
  //   console.log(dateList.length)
  // };
  const [dateFieldList,setDateFieldList]=useState([])
  const updateSalesforceData = async () => {

    // let dateList = []; // Initialize the dateList array
    // Parse obj2 from the Salesforce fields
    const obj2 = JSON.parse(salesforceFields);
    console.log(obj2.writeback);
    console.log(obj2.updateFromSalesforce);
    
    console.log("Type of datelist : ", typeof(datelist))
    // Check if the first element of dateList is undefined or null
    if (dateFieldList[0]) {
      console.log("Checking for existing apiName...");
  
      // Check if obj2 already exists based on apiName

      const exists = dateFieldList.some((obj) => obj.apiName === obj2.apiName);
      
      if (exists) {
        console.log("exists : " + obj2.apiName);
        // Optionally, log the index of the existing item
        const index = dateFieldList.findIndex((obj) => obj.apiName === obj2.apiName);
        console.log("Index of existing obj2:", index);
      } else {
        // If obj2 doesn't exist in dateList, add it to the array
        setDateFieldList([...dateFieldList, obj2]);
        console.log("obj2 added to the array:", dateFieldList);
      }


     
    } else {
       // If dateList is empty, add obj2 to it
       const element = obj2
       setDateFieldList(element);
       // dateList.push("demo")
       console.log("dateList after adding obj2 (initial case):", dateFieldList);
       console.log("Type of datelist : " , typeof(dateFieldList))
    }
  
    console.log("Final dateList:", typeof(dateFieldList));
    console.log("Length of dateList:", dateFieldList.length);
  };

  const [pdfUrl, setPdfUrl] = useState('');
  const [isError, setIsError] = useState(false); // For error handling

  const generatePdfUrl = () => {
    try {
      let url;
      // Assuming uuid and template_instance_uuid are available here
      if (template_instance_uuid != null && template_instance_uuid.length > 0) {
        url = `${process.env.REACT_APP_API_URL}/fetchpdf?&uuid=${uuid}&tiUUID=${template_instance_uuid}`;
      } else {
        url = `${process.env.REACT_APP_API_URL}/fetchpdf?uuid=${uuid}`;
      }

      setPdfUrl(url); // Set the generated URL to state
      setIsError(false); // Reset error if URL is successfully generated
    } catch (error) {
      console.error('Error generating PDF URL:', error);
      setIsError(true); // Set error state to true if an error occurs
      window.location.href='/unexpected-error'
    }
  };

  useEffect(() => {
    generatePdfUrl(); // Call the function when the component mounts
  }, [uuid, template_instance_uuid]); // Dependencies if uuid/template_instance_uuid change

  









  

  return (
    <>
      {isSessionEndedModalOpen && !isFinalCountdownActive ? <CustomModal modalHeaderTitle={"Session Will Expire Soon"} children={modalChildren} closeModal={closeModal}/> : null}
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
              fontFamily: "sans-serif",
            }}
          >
            <img
              src={loadingGif}
              alt="Editor Loader"
              style={{ minWidth: "150px", maxWidth: "250px" }}
              width="40%"
            />
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
          <div className="navbar">
            <div className="nav-flex">
            <div>
            <img
              src={`${process.env.REACT_APP_API_URL}/api/admin/branding/fetchBrandLogo?orgId=${orgId}`}
              className="logo"
              id="amazon-logo"
              alt="logo img"
            />
            </div>
            <div>

            {!isSelectionMode && (
              <button className="continue-btn" onClick={handleContinue}>
                {template_instance_uuid == null
                  ? "SAVE TEMPLATE"
                  : "SEND TO SIGN"}
              </button>
            )}
            {isSelectionMode && (
              <button
              className="continue-btn"
              onClick={() => {
                updateSalesforceData()
                dispatch(
                    setActiveCoordinate({
                      activeCoordinate: {},
                      isSelectionMode: false,
                    })
                  );
                }}
                >
                Done
              </button>
            )}
            </div>
            </div>
          </div>
          <div className="mobile-navbar">
          <div className="left-sidebar-mobile"> 
          {/* <div className="tools-title"></div> */}

          
            {/* <div className="tools-title">Fields</div> */}
          <div className="signer">

            <CustomSelect
              value={activeSignatory}
              name="signer"
              id="signer"
              options={signatoryList}
              onChange={(e) => {
                handleGlobalSignatoryChange(e);
              }}
              ></CustomSelect>
              </div>
              
          </div>
            <div className="flex-nav-mobile">
              <SignatureButtonContainer documentBounding={documentBounding} />
              <TextBoxButtonContainer documentBounding={documentBounding} />
              <DateButtonContainer documentBounding={documentBounding} />
              <CheckboxButtonContainer documentBounding={documentBounding} />
              {/* <EmailButtonContainer onDragEnd={() => {}} /> */}
              {/* <DateSignedButtonContainer onDragEnd={() => {}} /> */}
            </div>
          </div>
          <div className="left-sidebar-desktop">
            <div className="tools-title">Signer</div>
            <CustomSelect
              value={activeSignatory}
              name="signer"
              options={signatoryList}
              onChange={(e) => {
                handleGlobalSignatoryChange(e);
              }}
            ></CustomSelect>

            <div className="tools-title">Fields</div>
            <div className="flex-container">
              <SignatureButtonContainer documentBounding={documentBounding} />
              <TextBoxButtonContainer documentBounding={documentBounding} />
              <DateButtonContainer documentBounding={documentBounding} />
              <CheckboxButtonContainer documentBounding={documentBounding} />
              {/* <EmailButtonContainer onDragEnd={() => {}} /> */}
              {/* <DateSignedButtonContainer onDragEnd={() => {}} /> */}
            </div>
              {!isSessionEnded ? 
                <SessionTimer timeInSeconds={sessionTime} onSessionExpired={handleSessionExpired} />
                : null
              }
            
              {isFinalCountdownActive ? 
                <SessionTimer timeInSeconds={finalCountDownTime} onSessionExpired={() => {}} />
                : null
              }
          </div>
          
          {confirmationPopup && ( 
            <div className="confirmationDiv">
                   <Confirmation
                   closePopup={closePopup}
                   getContinueEventFromConfirmation={getContinueEventFromConfirmation}
                   writebackFields={writebackFieldsData} // Pass writebackFields as prop
                   updateFields={updateFromSalesforceFieldsData} // Pass updateFromSalesforceFields as prop
                 />
                 </div>
              )}
          <div>
            <div
              className="document"
              id="center-img-div"
              ref={scrollContainer}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
                event.target.style.cursor = "copy";
              }}
              onDrop={(event) => {
                event.preventDefault();
                event.target.style.cursor = "auto";
                handleDragLeave();
              }}
            >
            

              <TransformWrapper
             
                defaultScale={1}
                maxScale={2.5}
                disablePan={true}
                centerZoomedOut
                disablePadding
                wheel={{ disabled: true }}
                panning={panningState}
                // onPanning={() => resetSelectionMode()}
                doubleClick={{ disabled: true }}
                scale={scale}
              >
                {({ zoomIn, zoomOut }) => (
                  <React.Fragment>
                    {!(isLoading || isPDFLoading) && !isSelectionMode ? (
                      <footer className="footer">
                        <Paggination
                          
                          activePage={activePageNumber}
                          totalPage={totalPage}
                          handlePaggination={handlePaggination}
                        ></Paggination>
                      </footer>
                    ) : null}
                    <TransformComponent>
                      <SignatureCoordinatesContainer
                        scrollContainer={scrollContainer}
                      />
                      <TextBoxCoordinatesContainer
                        scrollContainer={scrollContainer}
                      />
                      <DateCoordinatesContainer
                        scrollContainer={scrollContainer}
                      />
                      <CheckBoxCoordinatesContainer
                        scrollContainer={scrollContainer}
                      />
                      <div
                        ref={documentContainer}
                        onClick={() => resetSelectionMode()}
                        style={{
                          position: "absolute",
                          top: 0,
                          bottom: 0,
                          left: 0,
                          right: 0,
                          zIndex: 1,
                          height: unfocusDivStyle.height,
                          // width: unfocusDivStyle.width,
                          width:"100vw"
                        }}
                      ></div>
                      {/* {console.log(template_instance_uuid != null && template_instance_uuid.length>0 ? `${process.env.REACT_APP_API_URL}/fetchpdf?&uuid=${uuid}&tiUUID=${template_instance_uuid}` : `${process.env.REACT_APP_API_URL}/fetchpdf?uuid=${uuid}`)}    */}
                      <div className="testing">
                       
                      <PdfViewer
                          pdf={
                            template_instance_uuid != null &&
                            template_instance_uuid.length > 0
                              ? `${process.env.REACT_APP_API_URL}/fetchpdf?&uuid=${uuid}&tiUUID=${template_instance_uuid}`
                              : `${process.env.REACT_APP_API_URL}/fetchpdf?uuid=${uuid}`
                          }
                          activePage={activePageNumber}
                          setPDFLoading={setIsPDFLoading}
                          setPageCount={settotalPage}
                          scale={defaultCanvasScale}
                        />
                          {/* <PdfViewer
                            pdf={pdfUrl}
                            activePage={activePageNumber}
                            setPDFLoading={setIsPDFLoading}
                            setPageCount={settotalPage}
                            scale={defaultCanvasScale}
                          /> */}
                     
                      </div>
                    </TransformComponent>
                  </React.Fragment>
                )}
              </TransformWrapper>
            </div>
          </div>
          <div
            className="right-sidebar-desktop"
            id="right-sidebar-div"
            style={{ position: "relative", paddingRight: "10px" }}
          > 
            {/* <SelectionModeContainer handleSalesforceFields={handleSalesforceFields} style={{display:"none"}} /> */}
            {isSelectionMode && activeCoordinate && <SelectionModeContainer handleSalesforceFields={handleSalesforceFields} />
          }
            <div
              ref={scrollImage}
              style={{
                position: "absolute",
                overflowY: "hidden",
                height: "92vh",
              }}
            >
              {!isSelectionMode && totalPage !== 0 &&
                Array.from(Array(totalPage), (e, i) => {
                  return (
                    <div
                      className="flexbox-container paggination"
                      onClick={() => handlePaggination(i)}
                      key={i}
                    >
                      <div className="flexbox-item">
                        <div className="page-count">{i + 1}</div>
                        <div
                          className="page-img"
                          style={{
                            border:
                              i === activePageNumber
                                ? "2px solid #6e859b"
                                : "1px solid #b3b3b34d",
                          }}
                        >
                          <PdfViewer
                            pdf={
                              template_instance_uuid != null &&
                              template_instance_uuid.length > 0
                                ? `${process.env.REACT_APP_API_URL}/fetchpdf?&uuid=${uuid}&tiUUID=${template_instance_uuid}`
                                : `${process.env.REACT_APP_API_URL}/fetchpdf?uuid=${uuid}`
                            }
                            activePage={i}
                            setPDFLoading={setIsPDFLoading}
                            setPageCount={settotalPage}
                            scale={scaleForImages}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="right-sidebar-mobile">
          {isSelectionMode && activeCoordinate && <SelectionModeContainer handleSalesforceFields={handleSalesforceFields}  />}
          {isSelectionMode && (
              <button
              className="done-btn"
              onClick={() => {
                  updateSalesforceData()
                  dispatch(
                    setActiveCoordinate({
                      activeCoordinate: {},
                      isSelectionMode: false,
                    })
                  );
                }}
                >
                <TiTick/>

              </button>
            )}
            <div
              ref={scrollImage}
              style={{
                position: "fixed",
                left :"0",
                right : "0",
                bottom :"0",
                zIndex:"999",
                width : "fit-content",
                // overflowY: "scroll",
                height: "20vh",
                marginBottom :"50px"
              }}
            >
              {totalPage !== 0 &&
                Array.from(Array(totalPage), (e, i) => {
                  return (
                    <div
                      className="flexbox-container paggination"
                      onClick={() => handlePaggination(i)}
                      key={i}
                    >
                      <div className="flexbox-item">
                        <div className="page-count">{i + 1}</div>
                        <div
                          className="page-img"
                          style={{
                            width:"120px",
                            objectFit : "contain",
                            border:
                              i === activePageNumber
                                ? "2px solid #6e859b"
                                : "1px solid #b3b3b34d",
                          }}
                        >
                          <PdfViewer
                            pdf={
                              template_instance_uuid != null &&
                              template_instance_uuid.length > 0
                                ? `${process.env.REACT_APP_API_URL}/fetchpdf?&uuid=${uuid}&tiUUID=${template_instance_uuid}`
                                : `${process.env.REACT_APP_API_URL}/fetchpdf?uuid=${uuid}`
                            }
                            activePage={i}
                            setPDFLoading={setIsPDFLoading}
                            setPageCount={settotalPage}
                            scale={0.2}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          
        </div>
      )}
    </>
  );
}
