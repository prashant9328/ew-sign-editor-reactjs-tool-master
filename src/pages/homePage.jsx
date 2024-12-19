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
import fetchDocumentDataService from "services/fetchDocumentDataService";
import SetTemplateCoordinatesService from "services/setTemplateCoordinatesService";
import updateInstanceStatus from "services/updateInstanceStatus";
//
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

  const [isPDFLoading, setIsPDFLoading] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isFetching, setIsFetching] = React.useState(true);
  const [isFileShared, setIsFileShared] = React.useState(false);

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

  const getDocumentData = async (uuid, uuidTemplateInstance) => {
    try {
      const apiResult = await fetchDocumentDataService(
        uuid,
        uuidTemplateInstance
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
    }
  };

  React.useEffect(() => {
    const uuid = searchParams.get("uuid");
    const uuidTemplateInstance = searchParams.get("template_instance_uuid");

    console.log("@@@ uuid: " + uuid);
    console.log("@@@ uuidTemplateInstance: " + uuidTemplateInstance);
    if (uuid == null && uuidTemplateInstance == null) {
      navigate("/page-not-found", { replace: true });
      return;
    }

    getDocumentData(uuid, uuidTemplateInstance);
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
    return () => {};
  }, []);


  function validateCoordinates(finalCoordData) {
    // check if minimum one field is set for all the users
    console.log("sinalcoordinateData",finalCoordData);
    console.log("sinalcoordinateData",JSON.stringify(finalCoordData));
    if (finalCoordData.length === 0 )
      return {
        isValidate: false,
        msg: "Please add atleast one field for each user.",
      };
  

    const finalCoordSignatoryIdList = [];
    for (let i = 0; i < finalCoordData.length; i++) {
      finalCoordSignatoryIdList.push(finalCoordData[i].signatory_id);
    }


    let checker = (arr, target) => target.every((v) => arr.includes(v.id));

    if (!checker(finalCoordSignatoryIdList, signatoryList)) {
      return {
        isValidate: false,
        msg: "Please add atleast one field for each user.",
      };
    }    

    let missingRequiredCoordinate = false;

  if(missingRequiredCoordinate == false){
    for (let i = 0; i < finalCoordData.length; i++) {
      const coord = finalCoordData[i];
    if (coord.isRequired === true) {
      missingRequiredCoordinate = true; 
    }
  }
}

  if (!missingRequiredCoordinate) {
    return {
      isValidate: false,
      msg: "Please add at least one required field for each user.",
    };
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

  const handleContinue = async () => {
    setIsLoading(true);
    setIsFetching(false);

    let finalCoordData = [
      ...signatureCoordinates,
      ...textBoxCoordinates,
      ...dateCoordinates,
      ...checkBoxCoordinates,
    ];
    console.log("HANDLE CONTINUE: " + JSON.stringify(finalCoordData));

    const validation = validateCoordinates(finalCoordData);

    if (!validation.isValidate) {
      setIsLoading(false);
      ShowToast(ToastTypeEnum.ERROR, validation.msg);
      return;
    }

    if (template_instance_uuid == null) {
      //
      finalCoordData = changeSignatoryIdToNull(finalCoordData);
    }

    console.log("@@@ finalCoordData: " + JSON.stringify(finalCoordData));

    try {
      await SetTemplateCoordinatesService(
        finalCoordData,
        uuid,
        template_instance_uuid
      );
      let state="SENT";
      await updateInstanceStatus(template_instance_uuid,state);

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

  return (
    <>
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
          <div className="left-sidebar">
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
              <EmailButtonContainer onDragEnd={() => {}} />
              <DateSignedButtonContainer onDragEnd={() => {}} />
            </div>
          </div>
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
                          width: unfocusDivStyle.width,
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
            {isSelectionMode && activeCoordinate && <SelectionModeContainer />}
            <div
              ref={scrollImage}
              style={{
                position: "absolute",
                overflowY: "scroll",
                height: "92vh",
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

          <div className="navbar">
            <img
              src={`${process.env.REACT_APP_API_URL}/api/admin/branding/fetchBrandLogo?orgId=${orgId}`}
              className="logo"
              alt="logo img"
            />

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
      )}
    </>
  );
}
