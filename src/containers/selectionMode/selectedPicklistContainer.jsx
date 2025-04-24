import React from "react";
import { BsChevronDown, BsPencilSquare, BsTrashFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { IoMdArrowDropdown } from "react-icons/io";

import {
  removeCoordinate,
  updateCoordinateMappingField,
  updateCoordinateValue,
  updateCoordinateOptions,
  updateCoordinateName,
  updateCoordinateSignatory,
  updateCoordinateWriteBackSettings,
  updateCoordinateUpdateFromSalesforceSettings,
  updateCoordinateEditable,
  updateCoordinateIsRequired,
} from "../../utils/updateCoordinates";
import { setPicklistCoordinates } from "../../redux/slices/picklistCoordinatesReducer";
import { setActiveCoordinate } from "../../redux/slices/activeCoordinateReducer";
import CustomSelect from "../../components/custom-select";
import CustomToggle from "../../components/custom-toggle";
import { SalesforceFieldTypeEnum } from "../../constants/salesforceFieldTypeEnum";

function SelectedPicklistContainer({}) {
  const dispatch = useDispatch();
  const activeCoordinate = useSelector(
    (state) => state.activeCoordinate.activeCoordinate
  );
  const signatoryList = useSelector(
    (state) => state.signatoryList.signatoryList
  );
  const picklistCoordinates = useSelector(
    (state) => state.picklistCoordinates.picklistCoordinates
  );
  const sobjectAPIName = useSelector(
    (state) => state.salesforceFieldsMetadata.sobjectAPIName
  );
  const salesforceFieldsMetadata = useSelector(
    (state) => state.salesforceFieldsMetadata.salesforceFieldsMetadata
  );

  const [defaultValue, setDefaultValue] = useState(
    activeCoordinate.value || ""
  );
  const [inputValue, setInputValue] = useState("");
  const [currentCoordOptions, setCurrentCoordOptions] = useState([]);
  const [picklistName, setPicklistName] = useState("");
  const [picklistNameEdited, setPicklistNameEdited] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const handleEleDelete = () => {
    const updatedCoords = removeCoordinate(
      picklistCoordinates,
      activeCoordinate.eleId
    );
    dispatch(setPicklistCoordinates({ picklistCoordinates: [] }));
    setTimeout(() => {
      dispatch(setPicklistCoordinates({ picklistCoordinates: updatedCoords }));
    }, 0);
    dispatch(
      setActiveCoordinate({ activeCoordinate: {}, isSelectionMode: false })
    );
  };

  const handleCurrentCoordSignatoryChange = (e) => {
    dispatch(
      setPicklistCoordinates({
        picklistCoordinates: updateCoordinateSignatory(
          picklistCoordinates,
          activeCoordinate.eleId,
          e.id,
          e.index,
          e.bgColor
        ),
      })
    );

    const updatedActiveCoordinates = {
      ...activeCoordinate,
      value:'',
      signatory_id: e.id,
      user_index_id: e.index,
      options: currentCoordOptions?.join(),
      bgColor: e.bgColor,
    };

    dispatch(
      setActiveCoordinate({
        activeCoordinate: updatedActiveCoordinates,
        isSelectionMode: true,
      })
    );
  };

  const handleCurrentCoordOptionsChange = (updatedOptions) => {
    console.log("Picklist name at 97 : ",picklistName);
    setTimeout(1000);
    const updatedPicklistCoordinates = picklistCoordinates.map((item) => {
      if (item.eleId === activeCoordinate.eleId) {
        const tempItem = {
          ...item,
          // value: "",
          options: updatedOptions,
          name: picklistName,
        };
        console.log("tempItem---->", tempItem);
        return tempItem;
      }
      console.log("item---->", item);
      return item;
    });
    console.log("updatedPicklistCoordinates::", updatedPicklistCoordinates);

    dispatch(
      setPicklistCoordinates({
        picklistCoordinates: updateCoordinateOptions(
          updatedPicklistCoordinates,
          activeCoordinate.eleId,
          updatedOptions
        ),
      })
    );

    const updatedActiveCoordinates = {
      ...activeCoordinate,
      value: '',
      options: updatedOptions,
      name: picklistName,
    };

    dispatch(
      setActiveCoordinate({
        activeCoordinate: updatedActiveCoordinates,
        isSelectionMode: true,
      })
    );

    // setIsDefaultChanged(false);
    setPicklistNameEdited(false);
  };

  const handleCurrentCoordIsRequiredChange = (value) => {
    dispatch(
      setPicklistCoordinates({
        picklistCoordinates: updateCoordinateIsRequired(
          picklistCoordinates,
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
        setPicklistCoordinates({
          picklistCoordinates: updateCoordinateWriteBackSettings(
            picklistCoordinates,
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
      console.log("log at 191 : ",value)

      
    };

  const handleCurrentCoordUpdateFromSalesforceSettingsChange = (value) => {
    dispatch(
      setPicklistCoordinates({
        picklistCoordinates: updateCoordinateUpdateFromSalesforceSettings(
          picklistCoordinates,
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
 
  const handleCurrentCoordMappingFieldChange = (e) => {
    if(activeCoordinate.updateFromSalesforce || activeCoordinate.writeBack){
      dispatch(
        setPicklistCoordinates({
          picklistCoordinates: updateCoordinateMappingField(
            picklistCoordinates,
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
    }
  };

  useEffect(() => {
    setCurrentCoordOptions((activeCoordinate.options)?.toString()?.split(",") || []);
  }, [activeCoordinate.options]);

  const handleAddOrUpdate = () => {
    if (inputValue.trim() === "") return;

    let updatedOptions;

      updatedOptions = currentCoordOptions?.join();
      updatedOptions = updatedOptions.length>0?(updatedOptions+","+inputValue):inputValue; //.substring(1)
        
    setCurrentCoordOptions(updatedOptions?.toString()?.split(","));
    handleCurrentCoordOptionsChange(updatedOptions?.toString());
    setInputValue("");
  };

  const handleEdit = (index) => {
    setInputValue(currentCoordOptions[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedOptions = currentCoordOptions.filter((_, i) => i !== index);
    setCurrentCoordOptions((updatedOptions)?.toString().split(","));
    if (editIndex === index) {
      setEditIndex(null);
      setInputValue("");
    }
    handleCurrentCoordOptionsChange(updatedOptions);
  };

  const [dropdown, setDropdown] = useState(true);

  const toggleDropdown = () => {
    if (dropdown === false) {
      setDropdown(true);
    }
    //
    if (dropdown === true) {
      setDropdown(false);
    }
  };

  useEffect(() => {
    setDefaultValue(activeCoordinate.value || "");
    setCurrentCoordOptions((activeCoordinate.options)?.toString()?.split(",") || []);
    setPicklistName(activeCoordinate.name || "");
  }, [activeCoordinate.value]);

  return (
    <>
      <div className="right-sidebar-tool-detail-mobile">
        <div
          style={{ marginLeft: "30px" }}
          className="right-sidebar-tool-header"
        >
          <div style={{ alignSelf: "center" }}>
            <BsChevronDown
              style={{ color: "#555d65", margin: "0px 5px -3px 0px" }}
            />
            <span
              style={{
                fontSize: "12px",
                alignSelf: "center",
                color: "#555d65",
              }}
            >
              Picklist
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
                />
              </div>
            </div>

           

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                paddingLeft: "0 !important",
              }}
              className="right-sidebar-section"
            >
          
              <CustomToggle
                title="Writeback to Salesforce"
                defaultValue={activeCoordinate.writeBack}
                onChange={(value) => {
                  handleCurrentCoordWriteBackSettingsChange(value);
                 if(value && !activeCoordinate.updateFromSalesforce){
                    handleCurrentCoordUpdateFromSalesforceSettingsChange(value)
                 }
                }}
              />

               <CustomToggle
                title="Update from Salesforce"
                defaultValue={activeCoordinate.updateFromSalesforce}
                onChange={(value) => {
                  if(activeCoordinate.writeBack){

                    handleCurrentCoordUpdateFromSalesforceSettingsChange(true);
                  }else{
                    handleCurrentCoordUpdateFromSalesforceSettingsChange(value);

                  }
                }}
              />
              
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
                        (field) =>
                          field.type === SalesforceFieldTypeEnum.PICKLIST
                          // field.type === SalesforceFieldTypeEnum.TEXTAREA
                      )}
                      useFor="MAPPING"
                      onChange={(e) => {
                        handleCurrentCoordMappingFieldChange(e);
                      }}
                    />
                  </div>f
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
            <BsChevronDown
              style={{ color: "#555d65", margin: "0px 5px -3px 0px" }}
            />
            <span
              style={{
                fontSize: "16px",
                color: "#555d65",
              }}
            >
              Picklist
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
            />
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
                  field.type === SalesforceFieldTypeEnum.PICKLIST 
                  // field.type === SalesforceFieldTypeEnum.TEXTAREA
              )}
              useFor="MAPPING"
              onChange={(e) => {
                handleCurrentCoordMappingFieldChange(e);
              }}
            />
          </div>
        ) : null}
        {picklistNameEdited && (
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
        {(!activeCoordinate.updateFromSalesforce && !activeCoordinate.writeBack) && 
        <>
        <div key={activeCoordinate.value} className="right-sidebar-section">
            <label className="field-lbl">Set PickList</label>
            <div className="picklist-group">
              {/* for picklist name */}
              <input
                className="input-field"
                value={picklistName}
                onChange={(e) => {
                  // console.log("picklist value : ",e.target.value);
                  setPicklistName(e.target.value);
                  setPicklistNameEdited(true)
                  
                }}
                onBlur={()=>{
                  // setTimeout(1000);
                  handleCurrentCoordOptionsChange(currentCoordOptions);

                }}
                placeholder="Enter picklist name"
              />
              <div className="picklist-input-row">
                <input
                  className="input-field"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                  }}
                  placeholder="Enter picklist value"
                />
                <button
                  className="add-update-btn"
                  onClick={handleAddOrUpdate}
                >
                  {editIndex !== null ? "Update" : "Add"}
                </button>
              </div>

              <ul className="picklist-ul">
                {
                currentCoordOptions.map((item, index) => (
                  <li className="picklist-li" key={index}>
                    {item}{" "}
                    <div className="picklist-actoins">
                      <button
                        className="picklist-btn"
                        onClick={() => handleEdit(index)}
                      >
                        <BsPencilSquare />
                      </button>
                      <button
                        className="picklist-btn"
                        onClick={() => handleDelete(index)}
                      >
                        <BsTrashFill />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

          </div>
          
        {
          activeCoordinate.mappingField.type ===
          SalesforceFieldTypeEnum.PICKLIST && (
            
            <div className="right-sidebar-section">
              <label className="field-lbl">Default PickList</label>
              <CustomSelect
                value={{
                  label: activeCoordinate.value,
                  value: activeCoordinate.value,
                }}
                name="picklistValue"
                options={activeCoordinate.mappingField.picklistOption}
                useFor="MAPPING"
                onChange={(e) => {
                  handleCurrentCoordOptionsChange();
                }}
              />
            </div>
          )} 
        </>
        }
        
            
          
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
              if(value && !activeCoordinate.updateFromSalesforce){
                handleCurrentCoordUpdateFromSalesforceSettingsChange(value);

              }
            }}
          />
          <CustomToggle
            title="Update from Salesforce"
            defaultValue={activeCoordinate.updateFromSalesforce}
            onChange={(value) => {
              if(activeCoordinate.writeBack){
                handleCurrentCoordUpdateFromSalesforceSettingsChange(true);
              }else{
                
                handleCurrentCoordUpdateFromSalesforceSettingsChange(value);
              }
            }}
          />


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

export default SelectedPicklistContainer;
