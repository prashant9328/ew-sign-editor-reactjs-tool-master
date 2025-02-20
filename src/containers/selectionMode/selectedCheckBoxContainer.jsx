import React from "react";
import { BsCheck2Square } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { IoMdArrowDropdown } from "react-icons/io";

import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { TbMenu2 } from  "react-icons/tb";

import {
  removeCoordinate,
  updateCoordinateMappingField,
  updateCoordinateValue,
  updateCoordinateName,
  updateCoordinateSignatory,
  updateCoordinateWriteBackSettings,
  updateCoordinateUpdateFromSalesforceSettings,
  updateCoordinateIsRequired,
} from "../../utils/updateCoordinates";
import { setCheckBoxCoordinates } from "../../redux/slices/checkBoxCoordinatesReducer";
import { setActiveCoordinate } from "../../redux/slices/activeCoordinateReducer";
import CustomSelect from "../../components/custom-select";
import CustomToggle from "../../components/custom-toggle";
import { SalesforceFieldTypeEnum } from "../../constants/salesforceFieldTypeEnum";

function SelectedCheckBoxContainer({}) {
  const dispatch = useDispatch();
  const activeCoordinate = useSelector(
    (state) => state.activeCoordinate.activeCoordinate
  );
  const signatoryList = useSelector(
    (state) => state.signatoryList.signatoryList
  );
  const checkBoxCoordinates = useSelector(
    (state) => state.checkBoxCoordinates.checkBoxCoordinates
  );

  const sobjectAPIName = useSelector(
    (state) => state.salesforceFieldsMetadata.sobjectAPIName
  );
  const salesforceFieldsMetadata = useSelector(
    (state) => state.salesforceFieldsMetadata.salesforceFieldsMetadata
  );

  const handleEleDelete = () => {
    const updatedCoords = removeCoordinate(
      checkBoxCoordinates,
      activeCoordinate.eleId
    );
    dispatch(setCheckBoxCoordinates({ checkBoxCoordinates: [] }));
    setTimeout(() => {
      dispatch(setCheckBoxCoordinates({ checkBoxCoordinates: updatedCoords }));
    }, 0);
    dispatch(
      setActiveCoordinate({ activeCoordinate: {}, isSelectionMode: false })
    );
  };

  const handleCurrentCoordSignatoryChange = (e) => {
    dispatch(
      setCheckBoxCoordinates({
        checkBoxCoordinates: updateCoordinateSignatory(
          checkBoxCoordinates,
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

  const handleCurrentCoordNameChange = (e) => {
    const name = e.target.value;
    dispatch(
      setCheckBoxCoordinates({
        checkBoxCoordinates: updateCoordinateName(
          checkBoxCoordinates,
          activeCoordinate.eleId,
          name
        ),
      })
    );

    const updatedActiveCoordinates = {
      ...activeCoordinate,
      name: name,
    };
    dispatch(
      setActiveCoordinate({
        activeCoordinate: updatedActiveCoordinates,
        isSelectionMode: true,
      })
    );
  };

  const handleCurrentCoordMappingFieldChange = (e) => {
    console.log("VALUE: " + JSON.stringify(e));

    dispatch(
      setCheckBoxCoordinates({
        checkBoxCoordinates: updateCoordinateMappingField(
          checkBoxCoordinates,
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

  const handleCurrentCoordValueChange = (value) => {
    dispatch(
      setCheckBoxCoordinates({
        checkBoxCoordinates: updateCoordinateValue(
          checkBoxCoordinates,
          activeCoordinate.eleId,
          value
        ),
      })
    );

    const updatedActiveCoordinates = {
      ...activeCoordinate,
      value: value,
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
      setCheckBoxCoordinates({
        checkBoxCoordinates: updateCoordinateWriteBackSettings(
          checkBoxCoordinates,
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

  const handleCurrentCoordIsRequiredChange = (value) => {
    dispatch(
      setCheckBoxCoordinates({
        checkBoxCoordinates: updateCoordinateIsRequired(
          checkBoxCoordinates,
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

  const handleCurrentCoordUpdateFromSalesforceSettingsChange = (value) => {
    dispatch(
      setCheckBoxCoordinates({
        checkBoxCoordinates: updateCoordinateUpdateFromSalesforceSettings(
          checkBoxCoordinates,
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

    const [dropdown,setDropdown]=useState(true);
  
    const toggleDropdown = ()=>{
      if (dropdown === false){
        setDropdown(true)
        console.log(true)
      }
      // console.log(dropdown)
      if(dropdown === true){
        setDropdown(false)
        console.log(false)
      }
    }
  return (
    <>
    <div className="right-sidebar-tool-detail-mobile">
      <div className="right-sidebar-tool-header">
        <div style={{marginLeft:"30px",alignSelf:"center"}}>
          <BsCheck2Square
            style={{ color: "#555d65", margin: "0px 5px -3px 0px" }}
          />
          <span
            style={{
              fontSize: "12px",
              color: "#555d65",
            }}
          >
            CHECKBOX
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
              (signatory) => signatory.id === activeCoordinate.signatory_id
            )}
            options={signatoryList}
            name="currentCoordSigner"
            onChange={(e) => {
              handleCurrentCoordSignatoryChange(e);
            }}
          ></CustomSelect>
        </div>
      </div>

      {/* <div key={activeCoordinate.name} className="right-sidebar-section">
        <label className="field-lbl">
          Name<span style={{ color: "red" }}>*</span>
        </label>
        <input
          defaultValue={activeCoordinate.name}
          onChange={(event) => handleCurrentCoordNameChange(event)}
          className="input-field"
        />
      </div> */}
      
      {/* {
          !activeCoordinate.updateFromSalesforce ? 
          (<div key={activeCoordinate.value} className="right-sidebar-section">
            <label className="field-lbl">
              Default Value 
            </label>
              <input 
                className="checkbox-input" 
                type="checkbox"
                defaultValue={activeCoordinate.value}
                onChange={(event) => handleCurrentCoordValueChange(event.target.value)}
              />
        </div>
      ) : null} */}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width :"95vw",
          margin : "0 auto"
        }}
        className="right-sidebar-section"
      >
        {/* <CustomToggle
          title="Required"
          defaultValue={activeCoordinate.isRequired}
          onChange={(value) => {
            handleCurrentCoordIsRequiredChange(value);
          }}
        /> */}
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
        <div>
      {activeCoordinate.updateFromSalesforce || activeCoordinate.writeBack ? (
        <div className="right-sidebar-section" style={{width:"95vw", margin:"0 auto"}}>
          <hr style={{margin:"5px 0", width:"100vw"}} />
          <label  className="field-lbl">Map with {sobjectAPIName}'s field of Salesforce</label>
          <CustomSelect
          
            value={activeCoordinate.mappingField}
            name="signer"
            options={salesforceFieldsMetadata.filter(
              (field) => field.type === SalesforceFieldTypeEnum.BOOLEAN
            )}
            useFor="MAPPING"
            onChange={(e) => {
              handleCurrentCoordMappingFieldChange(e);
            }}
          ></CustomSelect>
      </div> ) : null }
      </div>
      </div>
      </>
      )}
      <div className="mobile-dropdown" style={{ marginTop: "4px"}}>
        <div onClick={toggleDropdown} className="dropdown-toggle-btn">
          < IoMdArrowDropdown
    
            style={{
              margin: "10px",
              marginTop : "16px",
              position : "absolute",
              top : "0",
              fontSize : "x-large",
              left : "0",
              padding: "0px",
              // backgroundColor: "#4D4D4D",
              color: "black",
              borderRadius: "100%",
              // fontSize: "medium",
            }}
          />
        </div>
      </div>
      <hr />
    </div>
    
    <div className="right-sidebar-tool-detail-desktop">
    <div className="right-sidebar-tool-header">
      <div>
        <BsCheck2Square
          style={{ color: "#555d65", margin: "0px 5px -3px 0px" }}
        />
        <span
          style={{
            fontSize: "16px",
            color: "#555d65",
          }}
        >
          CHECKBOX
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
          options={signatoryList}
          name="currentCoordSigner"
          onChange={(e) => {
            handleCurrentCoordSignatoryChange(e);
          }}
        ></CustomSelect>
      </div>
    </div>

    {/* <div key={activeCoordinate.name} className="right-sidebar-section">
      <label className="field-lbl">
        Name<span style={{ color: "red" }}>*</span>
      </label>
      <input
        defaultValue={activeCoordinate.name}
        onChange={(event) => handleCurrentCoordNameChange(event)}
        className="input-field"
      />
    </div> */}

    {activeCoordinate.updateFromSalesforce || activeCoordinate.writeBack ? (
      <div className="right-sidebar-section">
        <label className="field-lbl">Map with {sobjectAPIName}'s field of Salesforce</label>
        <CustomSelect
          value={activeCoordinate.mappingField}
          name="signer"
          options={salesforceFieldsMetadata.filter(
            (field) => field.type === SalesforceFieldTypeEnum.BOOLEAN
          )}
          useFor="MAPPING"
          onChange={(e) => {
            handleCurrentCoordMappingFieldChange(e);
          }}
        ></CustomSelect>
    </div> ) : null }
    {/* {
        !activeCoordinate.updateFromSalesforce ? 
        (<div key={activeCoordinate.value} className="right-sidebar-section">
          <label className="field-lbl">
            Default Value 
          </label>
            <input 
              className="checkbox-input" 
              type="checkbox"
              defaultValue={activeCoordinate.value}
              onChange={(event) => handleCurrentCoordValueChange(event.target.value)}
            />
      </div>
    ) : null} */}

    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
      className="right-sidebar-section"
    >
      {/* <CustomToggle
        title="Required"
        defaultValue={activeCoordinate.isRequired}
        onChange={(value) => {
          handleCurrentCoordIsRequiredChange(value);
        }}
      /> */}
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
      <button onClick={handleEleDelete} style={{
                    cursor: "pointer",
                    fontSize: "small",
                    marginRight: "0px",
                    color: "#ffffff",
                    backgroundColor:'#4d4d4d',
                    borderRadius:'5px',
                    position:'absolute',
                    bottom : '-50px',
                    border:'0',
                    shadown:'0',
                    alignItems:'center',
                    alignSelf:'center',
                    right:'50%',
                    padding:'8px',
                    marginTop:'10px',
                    width:'40%',
                    display:'flex',
                    zIndex:'0'
                  }}>
                <MdDelete
                  
                  
                />
                
                DELETE
                </button>
    </div>
  </div>
  </>
  );
}

export default SelectedCheckBoxContainer;
