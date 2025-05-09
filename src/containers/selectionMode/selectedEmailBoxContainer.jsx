import React from "react";
import { BsEnvelope } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { ShowToast } from "utils/showToast";
import { emailRegex } from "../../constants/validation_constants";
import { ToastTypeEnum } from "constants/toastTypeEnum";


import {
  removeCoordinate,
  updateCoordinateMappingField,
  updateCoordinateValue,
  updateCoordinateName,
  updateCoordinateSignatory,
  updateCoordinateEditable,
  updateCoordinateWriteBackSettings,
  updateCoordinateUpdateFromSalesforceSettings,
  updateCoordinateIsRequired,
} from "../../utils/updateCoordinates";
import {
  setEmailBoxCoordinates,
  setAllDefaultInvalidEmailCount,
} from "../../redux/slices/emailBoxCoordinatesReducer";
import { setActiveCoordinate } from "../../redux/slices/activeCoordinateReducer";
import CustomSelect from "../../components/custom-select";
import CustomToggle from "../../components/custom-toggle";
import { SalesforceFieldTypeEnum } from "../../constants/salesforceFieldTypeEnum";

function SelectedEmailBoxContainer({}) {
  const dispatch = useDispatch();
  const activeCoordinate = useSelector(
    (state) => state.activeCoordinate.activeCoordinate
  );
  const signatoryList = useSelector(
    (state) => state.signatoryList.signatoryList
  );
  const emailBoxCoordinates = useSelector(
    (state) => state.emailBoxCoordinatesReducer?.emailBoxCoordinates || []
  );
  const sobjectAPIName = useSelector(
    (state) => state.salesforceFieldsMetadata.sobjectAPIName
  );
  const salesforceFieldsMetadata = useSelector(
    (state) => state.salesforceFieldsMetadata.salesforceFieldsMetadata
  );
  const allInEmailsValidEmailCount = useSelector((state) => {
    return state.emailBoxCoordinatesReducer.allInvalidEmailCount;
  });

  const [isDefaultChanged, setIsDefaultChanged] = useState(false);
  const [isValidDefaultEmailvalue, setIsValidDefaultEmailvalue] =
    useState(true);
  const [defaultValue, setDefaultValue] = useState(
    activeCoordinate.value || ""
  );

  const checkEmailValidation = (value) => {
    // let count = allInEmailsValidEmailCount;

    if (emailRegex.test(value) && value !== "" && value !== undefined) {
      setIsValidDefaultEmailvalue(true);

      console.log("Email Validation : ",true)
      // count++;
      return true;
    } else {
      setIsValidDefaultEmailvalue(false);
      console.log("Email Validation : ",false)

      // count--;
      return false;
    }

    // dispatch(setAllDefaultInvalidEmailCount(Math.max(count, 0)));
  };

  useEffect(() => {
    checkEmailValidation(activeCoordinate.value || "");
  }, []);

  const handleEleDelete = () => {
    const updatedCoords = removeCoordinate(
      emailBoxCoordinates,
      activeCoordinate.eleId
    );
    dispatch(setEmailBoxCoordinates({ emailBoxCoordinates: [] }));
    setTimeout(() => {
      dispatch(setEmailBoxCoordinates({ emailBoxCoordinates: updatedCoords }));
    }, 0);
    dispatch(
      setActiveCoordinate({ activeCoordinate: {}, isSelectionMode: false })
    );
  };

  const handleCurrentCoordSignatoryChange = (e) => {
    dispatch(
      setEmailBoxCoordinates({
        emailBoxCoordinates: updateCoordinateSignatory(
          emailBoxCoordinates,
          activeCoordinate.eleId,
          e.id,
          e.index,
          e.bgColor
        ),
      })
    );

    const updatedActiveCoordinates = {
      ...activeCoordinate,
      signatory_id: e.id,
      user_index_id: e.index,
      bgColor: e.bgColor,
    };
    dispatch(
      setActiveCoordinate({
        activeCoordinate: updatedActiveCoordinates,
        isSelectionMode: true,
      })
    );
  };

  const handleCurrentCoordValueChange = (value) => {
    //
    // check email validation after clicking on email field
    if(defaultValue && defaultValue !== ""){

      const isEmailValid = checkEmailValidation(defaultValue)
      console.log(isEmailValid);
      if (!isEmailValid) {

        console.log("validation email : ", defaultValue)
        // alert("Invalid Email!");
        ShowToast(ToastTypeEnum.ERROR,"Invalid Email!");
  
        dispatch(
          setEmailBoxCoordinates({
            emailBoxCoordinates: updateCoordinateValue(
              emailBoxCoordinates,
              activeCoordinate.eleId,
              ""
            ),
          })
        );
        const updatedActiveCoordinates = {
          ...activeCoordinate,
          value: '',
        };
  
        dispatch(
          setActiveCoordinate({
            activeCoordinate: updatedActiveCoordinates,
            isSelectionMode: true,
          })
        );
    
        setIsDefaultChanged(false);
  
        // return
      }else{
  
        dispatch(
          setEmailBoxCoordinates({
            emailBoxCoordinates: updateCoordinateValue(
              emailBoxCoordinates,
              activeCoordinate.eleId,
              defaultValue
            ),
          })
        );
    
        const updatedActiveCoordinates = {
          ...activeCoordinate,
          value: defaultValue,
        };
    
        dispatch(
          setActiveCoordinate({
            activeCoordinate: updatedActiveCoordinates,
            isSelectionMode: true,
          })
        );
    
        setIsDefaultChanged(false);
  
      }
    }
  };

  const handleCurrentCoordIsRequiredChange = (value) => {
    dispatch(
      setEmailBoxCoordinates({
        emailBoxCoordinates: updateCoordinateIsRequired(
          emailBoxCoordinates,
          activeCoordinate.eleId,
          value
        ),
      })
    );

    const updatedActiveCoordinates = {
      ...activeCoordinate,
      isRequired: value,
    };

    dispatch(
      setActiveCoordinate({
        activeCoordinate: updatedActiveCoordinates,
        isSelectionMode: true,
      })
    );
  };

  const handleCurrentCoordWriteBackSettingsChange = (value) => {
    dispatch(
      setEmailBoxCoordinates({
        emailBoxCoordinates: updateCoordinateWriteBackSettings(
          emailBoxCoordinates,
          activeCoordinate.eleId,
          value
        ),
      })
    );

    const updatedActiveCoordinates = {
      ...activeCoordinate,
      writeBack: value,
    };
    dispatch(
      setActiveCoordinate({
        activeCoordinate: updatedActiveCoordinates,
        isSelectionMode: true,
      })
    );
  };

  const handleCurrentCoordUpdateFromSalesforceSettingsChange = (value) => {
    dispatch(
      setEmailBoxCoordinates({
        emailBoxCoordinates: updateCoordinateUpdateFromSalesforceSettings(
          emailBoxCoordinates,
          activeCoordinate.eleId,
          value
        ),
      })
    );

    const updatedActiveCoordinates = {
      ...activeCoordinate,
      updateFromSalesforce: value,
    };
    dispatch(
      setActiveCoordinate({
        activeCoordinate: updatedActiveCoordinates,
        isSelectionMode: true,
      })
    );
  };

  const handleCurrentCoordIsEditableChange = (value) => {  
    dispatch(
      setEmailBoxCoordinates({
        emailBoxCoordinates: updateCoordinateEditable(
          emailBoxCoordinates,
          activeCoordinate.eleId,
          value
        ),
      })
    );
  
    const updatedActiveCoordinates = {
      ...activeCoordinate,
      editable: value,
    };
    dispatch(
      setActiveCoordinate({
        activeCoordinate: updatedActiveCoordinates,
        isSelectionMode: true,
      })
    );
  };

  const handleCurrentCoordMappingFieldChange = (e) => {
    dispatch(
      setEmailBoxCoordinates({
        emailBoxCoordinates: updateCoordinateMappingField(
          emailBoxCoordinates,
          activeCoordinate.eleId,
          e
        ),
      })
    );

    const updatedActiveCoordinates = {
      ...activeCoordinate,
      mappingField: e,
      value: "",
    };
    dispatch(
      setActiveCoordinate({
        activeCoordinate: updatedActiveCoordinates,
        isSelectionMode: true,
      })
    );
  };

  const [dropdown, setDropdown] = useState(true);

  const toggleDropdown = () => setDropdown(!dropdown);

  useEffect(() => {
    setDefaultValue(activeCoordinate.value || "");
  }, [activeCoordinate.value]);

  return (
    <>
      <div className="right-sidebar-tool-detail-mobile">
        <div
          style={{ marginLeft: "30px" }}
          className="right-sidebar-tool-header"
        >
          <div style={{ alignSelf: "center" }}>
            <BsEnvelope
              style={{ color: "#555d65", margin: "0px 5px -3px 0px" }}
            />
            <span
              style={{
                fontSize: "12px",
                alignSelf: "center",
                color: "#555d65",
              }}
            >
              EMAIL
            </span>
          </div>
          <MdDelete
            style={{
              cursor: "pointer",
              backgroundColor: "red",
              padding: "5px",
              borderRadius: "100%",
              fontSize: "16px",
              marginRight: "50px",
              color: "white",
            }}
            onClick={handleEleDelete}
          />
        </div>
        {dropdown && (
          <>
            <div className="right-sidebar-section">
              <label htmlFor="currentCoordSigner" className="field-lbl">
                Assigned to
              </label>
              <div>
                <CustomSelect
                  value={signatoryList.find(
                    (signatory) =>
                      signatory.id === activeCoordinate.signatory_id
                  )}
                  name="currentCoordSigner"
                  options={signatoryList}
                  onChange={(e) => {
                    handleCurrentCoordSignatoryChange(e);
                  }}
                ></CustomSelect>
              </div>
            </div>
                
            {(activeCoordinate.isSelectionMode) && 
            <div
              style={{
                position: "absolute",
                width: "100vw",
                height: "100vh",
                zIndex: "9999",
                backgroundColor: "black",
              }}
            >
              &nbsp;
            </div>
            }

            {!activeCoordinate.updateFromSalesforce ? (
              activeCoordinate.mappingField.type ===
              SalesforceFieldTypeEnum.PICKLIST ? (
                <div className="right-sidebar-section">
                  <label className="field-lbl">Default Value</label>
                  <CustomSelect
                    value={{
                      label: activeCoordinate.value,
                      value: activeCoordinate.value,
                    }}
                    name="picklistValue"
                    options={activeCoordinate.mappingField.picklistOption}
                    useFor="MAPPING"
                    onChange={(e) => {
                      handleCurrentCoordValueChange();
                    }}
                  ></CustomSelect>
                </div>
              ) : (
                <div
                  key={activeCoordinate.value}
                  className="right-sidebar-section"
                >
                  <label className="field-lbl">Default Value</label>
                  <input
                    defaultValue={defaultValue}
                    onChange={(e) => {
                      setDefaultValue(e.target.value);
                    }}
                    onBlur={(e) => {
                      
                        handleCurrentCoordValueChange();
                      
                    }}
                    className="input-field"
                  />
                </div>
              )
            ) : null}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                paddingLeft: "0 !important",
              }}
              className="right-sidebar-section"
            >
              <CustomToggle
                title="Required"
                defaultValue={activeCoordinate.isRequired}
                onChange={(value) => {
                  handleCurrentCoordIsRequiredChange(value);
                }}
              />
              <CustomToggle
                title="Writeback to Salesforce"
                defaultValue={activeCoordinate.writeBack}
                onChange={(value) => {
                  handleCurrentCoordWriteBackSettingsChange(value);
                }}
              />

              <CustomToggle
                title="Update from Salesforce"
                defaultValue={activeCoordinate.updateFromSalesforce}
                onChange={(value) => {
                  handleCurrentCoordUpdateFromSalesforceSettingsChange(value);
                }}
              />
              {(activeCoordinate.value!=="" || activeCoordinate.updateFromSalesforce) &&
                <CustomToggle
                  title="Editable"
                  defaultValue={activeCoordinate.updateFromSalesforce}
                  onChange={(value) => {
                    handleCurrentCoordUpdateFromSalesforceSettingsChange(value);
                  }}
                />
              }
              {activeCoordinate.updateFromSalesforce ||
              activeCoordinate.writeBack ? (
                <>
                  <hr style={{ width: "100vw", margin: "5px 0" }} />
                  <div id="textbox-input" className="right-sidebar-section">
                    <label className="field-lbl">
                      Map with {sobjectAPIName}'s field
                    </label>
                    <CustomSelect
                      value={activeCoordinate.mappingField}
                      name="signer"
                      options={salesforceFieldsMetadata.filter(
                        (field) => field.type === SalesforceFieldTypeEnum.EMAIL
                      )}
                      useFor="MAPPING"
                      onChange={(e) => {
                        handleCurrentCoordMappingFieldChange(e);
                      }}
                    ></CustomSelect>
                  </div>
                </>
              ) : null}
            </div>
          </>
        )}
        <div className="mobile-dropdown" style={{ marginTop: "4px" }}>
          <div onClick={toggleDropdown} className="dropdown-toggle-btn">
            <IoMdArrowDropdown
              style={{
                margin: "10px",
                marginTop: "16px",
                position: "absolute",
                top: "0",
                fontSize: "x-large",
                left: "0",
                padding: "0px",
                // backgroundColor: "#4D4D4D",
                color: "black",
                borderRadius: "100%",
                // fontSize: "medium",
              }}
            />
            <hr />
          </div>
        </div>
      </div>
      <div className="right-sidebar-tool-detail-desktop">
        <div className="right-sidebar-tool-header">
          <div>
            <BsEnvelope
              style={{ color: "#555d65", margin: "0px 5px -3px 0px" }}
            />
            <span
              style={{
                fontSize: "16px",
                color: "#555d65",
              }}
            >
              EMAIL
            </span>
          </div>
        </div>

        <div className="right-sidebar-section">
          <label htmlFor="currentCoordSigner" className="field-lbl">
            Assigned to
          </label>
          <div>
            <CustomSelect
              value={signatoryList.find(
                (signatory) => signatory.id === activeCoordinate.signatory_id
              )}
              name="currentCoordSigner"
              options={signatoryList}
              onChange={(e) => {
                handleCurrentCoordSignatoryChange(e);
              }}
            ></CustomSelect>
          </div>
        </div>

        {activeCoordinate.updateFromSalesforce || activeCoordinate.writeBack ? (
          <div className="right-sidebar-section">
            <label className="field-lbl">
              Map with {sobjectAPIName}'s field
            </label>
            <CustomSelect
              value={activeCoordinate.mappingField}
              name="signer"
              options={salesforceFieldsMetadata.filter(
                (field) =>
                  field.type === SalesforceFieldTypeEnum.EMAIL
                  // field.type === SalesforceFieldTypeEnum.EMAIL
              )}
              useFor="MAPPING"
              onChange={(e) => {
                handleCurrentCoordMappingFieldChange(e);
              }}
            ></CustomSelect>
          </div>
        ) : null}
        {isDefaultChanged && defaultValue!=="" && (
          <div
            style={{
              position: "fixed",
              width: "100vw",
              height: "100vh",
              zIndex: "9999",
              left: "0",
              top: "0",
            }}
          >
            &nbsp;
          </div>
        )}
        {!activeCoordinate.updateFromSalesforce ? (
          activeCoordinate.mappingField.type ===
          SalesforceFieldTypeEnum.PICKLIST ? (
            <div className="right-sidebar-section">
              <label className="field-lbl">Default Value</label>
              <CustomSelect
                value={{
                  label: activeCoordinate.value,
                  value: activeCoordinate.value,
                }}
                name="picklistValue"
                options={activeCoordinate.mappingField.picklistOption}
                useFor="MAPPING"
                onChange={(e) => {
                  handleCurrentCoordValueChange();
                }}
              ></CustomSelect>
            </div>
          ) : (
            <div key={activeCoordinate.value} className="right-sidebar-section">
              <form /* onFocus={handleCurrentCoordValueChange()} */>
                <label className="field-lbl">Default Value</label>
               
                <input
                  type="email"
                  value={defaultValue}
                  onChange={(e) => {
                    setDefaultValue(e.target.value);
                    setIsDefaultChanged(true);
                  }}
                  onBlur={(e) => {
                    
                    handleCurrentCoordValueChange();
                  }
                  }
                  className="input-field"
                />
              </form>
            </div>
          )
        ) : null}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
          className="right-sidebar-section"
        >
          <CustomToggle
            title="Required"
            defaultValue={activeCoordinate.isRequired}
            onChange={(value) => {
              handleCurrentCoordIsRequiredChange(value);
            }}
          />
          <CustomToggle
            title="Writeback to Salesforce"
            defaultValue={activeCoordinate.writeBack}
            onChange={(value) => {
              handleCurrentCoordWriteBackSettingsChange(value);
            }}
          />
          <CustomToggle
            title="Update from Salesforce"
            defaultValue={activeCoordinate.updateFromSalesforce}
            onChange={(value) => {
              handleCurrentCoordUpdateFromSalesforceSettingsChange(value);
            }}
          />
          {(defaultValue!=="" || activeCoordinate.updateFromSalesforce) &&
            <CustomToggle
              title="Editable"
              defaultValue={activeCoordinate.editable}
              onChange={(value) => {
                handleCurrentCoordIsEditableChange(value);
              }}
            />
          }
          <button
            onClick={handleEleDelete}
            style={{
              cursor: "pointer",
              fontSize: "small",
              marginRight: "0px",
              color: "#ffffff",
              backgroundColor: "#4d4d4d",
              borderRadius: "5px",
              position: "absolute",
              bottom: "-50px",
              border: "0",
              shadown: "0",
              alignItems: "center",
              alignSelf: "center",
              right: "50%",
              padding: "8px",
              marginTop: "10px",
              width: "40%",
              display: "flex",
              zIndex: "0",
            }}
          >
            <MdDelete />
            DELETE
          </button>
        </div>
      </div>
    </>
  );
}

export default SelectedEmailBoxContainer;
