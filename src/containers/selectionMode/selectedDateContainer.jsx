import React from "react";
import { BsCalendar2Date } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { IoMdArrowDropdown } from "react-icons/io";
// import handleSalesforceFields from "../selectionMode/handleSalesforceFields"
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
import { setDateCoordinates } from "../../redux/slices/dateCoordinatesReducer";
import { setActiveCoordinate } from "../../redux/slices/activeCoordinateReducer";
import CustomSelect from "../../components/custom-select";
import CustomToggle from "../../components/custom-toggle";
import { useState } from "react";
import { SalesforceFieldTypeEnum } from "../../constants/salesforceFieldTypeEnum";
import { TbMenu2 } from  "react-icons/tb";


function SelectedDateContainer({sendSalesforceData}) {
  const dispatch = useDispatch();
  const activeCoordinate = useSelector(
    (state) => state.activeCoordinate.activeCoordinate
  );
  const signatoryList = useSelector(
    (state) => state.signatoryList.signatoryList
  );
  const dateCoordinates = useSelector(
    (state) => state.dateCoordinates.dateCoordinates
  );

  const sobjectAPIName = useSelector(
    (state) => state.salesforceFieldsMetadata.sobjectAPIName
  );
  const salesforceFieldsMetadata = useSelector(
    (state) => state.salesforceFieldsMetadata.salesforceFieldsMetadata
  );

  const [dropdown,setDropdown]=useState(true);

  const handleEleDelete = () => {
    const updatedCoords = removeCoordinate(
      dateCoordinates,
      activeCoordinate.eleId
    );
    dispatch(setDateCoordinates({ dateCoordinates: [] }));
    setTimeout(() => {
      dispatch(setDateCoordinates({ dateCoordinates: updatedCoords }));
    }, 0);
    dispatch(
      setActiveCoordinate({ activeCoordinate: {}, isSelectionMode: false })
    );
  };

  const handleCurrentCoordSignatoryChange = (e) => {
    dispatch(
      setDateCoordinates({
        dateCoordinates: updateCoordinateSignatory(
          dateCoordinates,
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
      setDateCoordinates({
        dateCoordinates: updateCoordinateName(
          dateCoordinates,
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

  const [writeback,setWriteback]=useState(false)
  const [updateFieldFromSalesforce,setUpdateFieldFromSalesforce]=useState(false)
  const toggleUpdateFieldFromSalesforce = ()=>{
    if(updateFieldFromSalesforce===true){
      setUpdateFieldFromSalesforce(false)
      console.log("false")

    }
    if(updateFieldFromSalesforce===false){
      setUpdateFieldFromSalesforce(true)
      console.log("true")

    }
  }
  const toggleWriteback = ()=>{
    if(writeback===true){
      setWriteback(false)
      console.log("false")
    }
    if(writeback===false){
      setWriteback(true)
      console.log("true")
    }
  }
  const handleCurrentCoordMappingFieldChange = (e) => {
    console.log("VALUE: " + JSON.stringify(e));
    // if(writeback){
      console.log("values:",writeback)
    // }
    const updatedObj = {...e, "writeback":writeback, "updateFromSalesforce":updateFieldFromSalesforce }
    console.log("updated Object :" + JSON.stringify(updatedObj))
    sendSalesforceData(JSON.stringify(updatedObj))
    // handleSalesforceFields(JSON.stringify(e))
    dispatch(
      setDateCoordinates({
        dateCoordinates: updateCoordinateMappingField(
          dateCoordinates,
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

  const handleCurrentCoordWriteBackSettingsChange = (value) => {
    dispatch(
      setDateCoordinates({
        dateCoordinates: updateCoordinateWriteBackSettings(
          dateCoordinates,
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
      setDateCoordinates({
        dateCoordinates: updateCoordinateIsRequired(
          dateCoordinates,
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
      setDateCoordinates({
        dateCoordinates: updateCoordinateUpdateFromSalesforceSettings(
          dateCoordinates,
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

  const handleCurrentCoordValueChange = (value) => {
    dispatch(
      setDateCoordinates({
        dateCoordinates: updateCoordinateValue(
          dateCoordinates,
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
  <div
  style={{
    display: "block",
    width: "100vw",
    backgroundColor: "white",
    overflowY: "auto",
  }}
  className="right-sidebar-tool-detail-mobile"
>
  <div className="right-sidebar-tool-header">
    <div style={{marginLeft :"30px", alignSelf:"center"}}>
      <BsCalendar2Date
        style={{ color: "#555d65", margin: "0px 5px -3px 0px" }}
      />
      <span
        style={{
          fontSize: "12px",
          color: "#555d65",
          alignSelf : "center"
        }}
      >
        DATE
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
  <div style={{ display: "flex" }} className="right-sidebar-segment">
        <div
          className="right-sidebar-section"
          style={{ overflowY: "visible"}}
        >
          <label
            htmlFor="currentCoordSigner"
            style={{ fontSize: "12px" }}
            className="field-lbl"
          >
            Assigned to
          </label>
          <div id="date-name-select" style={{ height: "30px" }}>
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

        {!activeCoordinate.updateFromSalesforce ? (
          <div
            key={activeCoordinate.value}
            className="right-sidebar-section"
          >
            <label className="field-lbl">Default Value</label>
            <input
              type="date"
              defaultValue={activeCoordinate.value}
              onChange={(event) =>
                handleCurrentCoordValueChange(event.target.value)
              }
              className="input-field"
            />
          </div>
        ) : null}
        
    </div>
        <div
          className="right-sidebar-section-toggles"
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
              // setWriteback(true)
              handleCurrentCoordWriteBackSettingsChange(value);
            }}
          />
          <CustomToggle
            title="Update from Salesforce"
            defaultValue={activeCoordinate.updateFromSalesforce}
            onChange={(value) => {
              // toggleUpdateFieldFromSalesforce()
              handleCurrentCoordUpdateFromSalesforceSettingsChange(value);
            }}
          />

          {activeCoordinate.updateFromSalesforce ||
          activeCoordinate.writeBack ? (
            <>
            
            <hr
              style={{
                marginTop: "2px",
                width: "100vw",
                margin: "5px 0",
              }}
            />
            <div
              style={{ margin: "0 auto" }}
              className="right-sidebar-section"
            >
              <label
                style={{
                  width: "40px",
                  fontSize: "x-small",
                  marginBottom: "2px",
                }}
                className="field-lbl"
              >
                Map with {sobjectAPIName}'s Label
              </label>
              <CustomSelect
                value={activeCoordinate.mappingField}
                name="signer"
                options={salesforceFieldsMetadata.filter(
                  (field) =>
                    field.type === SalesforceFieldTypeEnum.DATE
                )}
                useFor="MAPPING"
                onChange={(e) => {
                  // toggleWriteback()
                  handleCurrentCoordMappingFieldChange(e);
                }}
              />
            </div>
            </>
          ) : null}
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

  <hr style={{ marginTop: "0px" }} />
</div>

    <div className="right-sidebar-tool-detail-desktop">
    <div className="right-sidebar-tool-header">
      <div>
        <BsCalendar2Date
          style={{ color: "#555d65", margin: "0px 5px -3px 0px" }}
          />
        <span
          style={{
            fontSize: "16px",
            color: "#555d65",
          }}
          >
          DATE
        </span>
      </div>
      {/* <MdDelete
        style={{
          cursor: "pointer",
          fontSize: "16px",
          marginRight: "10px",
          color: "#555d65",
        }}
        onClick={handleEleDelete}
        /> */}
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
        <label className="field-lbl">Map with {sobjectAPIName}'s field</label>
        <CustomSelect
          value={activeCoordinate.mappingField}
          name="signer"
          options={salesforceFieldsMetadata.filter(
            (field) => field.type === SalesforceFieldTypeEnum.DATE
          )}
          useFor="MAPPING"
          onChange={(e) => {
            // toggleWriteback()
            handleCurrentCoordMappingFieldChange(e);
          }}
        ></CustomSelect>
      </div>
    ) : null}

    {!activeCoordinate.updateFromSalesforce ? (
      <div key={activeCoordinate.value} className="right-sidebar-section">
        <label className="field-lbl">Default Value</label>
        <input
          type="date"
          defaultValue={activeCoordinate.value}
          onChange={(event) =>
            handleCurrentCoordValueChange(event.target.value)
          }
          className="input-field"
        />
      </div>
    ) : null}

    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
      className="right-sidebar-section"
    >
      <div>

      <CustomToggle
        title="Required"
        defaultValue={activeCoordinate.isRequired}
        onChange={(value) => {
          handleCurrentCoordIsRequiredChange(value);
        }}
        />
        </div>
        <div>

      <CustomToggle
        title="Writeback to Salesforce"
        defaultValue={activeCoordinate.writeBack}
        onChange={(value) => {
          toggleWriteback()
          handleCurrentCoordWriteBackSettingsChange(value);
        }}
        />
        </div>
        <div>

      <CustomToggle
        title="Update from Salesforce"
        defaultValue={activeCoordinate.updateFromSalesforce}
        onChange={(value) => {
          toggleUpdateFieldFromSalesforce()
          handleCurrentCoordUpdateFromSalesforceSettingsChange(value);
        }}
        />
        </div>
        <button onClick={handleEleDelete} style={{
                      cursor: "pointer",
                      fontSize: "small",
                      marginRight: "0px",
                      color: "#ffffff",
                      backgroundColor:'#4d4d4d',
                      borderRadius:'5px',
                      position:'absolute',
                      bottom : '-49px',
                      border:'0',
                      shadown:'0',
                      alignItems:'center',
                      alignSelf:'center',
                      right:'50%',
                      padding:'8px',
                      marginTop:'10px',
                      // bottom:'-60%',
                      width:'40%',
                      display:'flex',
                      zIndex:0
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

export default SelectedDateContainer;
