  import React from "react";
  import { BsTextareaT } from "react-icons/bs";
  import { MdDelete } from "react-icons/md";
  import { useDispatch, useSelector } from "react-redux";
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
  import { setTextBoxCoordinates } from "../../redux/slices/textBoxCoordinatesReducer";
  import { setActiveCoordinate } from "../../redux/slices/activeCoordinateReducer";
  import CustomSelect from "../../components/custom-select";
  import CustomToggle from "../../components/custom-toggle";
  import { SalesforceFieldTypeEnum } from "../../constants/salesforceFieldTypeEnum";

  function SelectedTextBoxContainer({}) {
    const dispatch = useDispatch();
    const activeCoordinate = useSelector(
      (state) => state.activeCoordinate.activeCoordinate
    );
    const signatoryList = useSelector(
      (state) => state.signatoryList.signatoryList
    );
    const textBoxCoordinates = useSelector(
      (state) => state.textBoxCoordinates.textBoxCoordinates
    );
    const sobjectAPIName = useSelector(
      (state) => state.salesforceFieldsMetadata.sobjectAPIName
    );
    console.log("sobjectAPIName-JS", sobjectAPIName);
    const salesforceFieldsMetadata = useSelector(
      (state) => state.salesforceFieldsMetadata.salesforceFieldsMetadata
    );

    

    const handleEleDelete = () => {
      const updatedCoords = removeCoordinate(
        textBoxCoordinates,
        activeCoordinate.eleId
      );
      dispatch(setTextBoxCoordinates({ textBoxCoordinates: [] }));
      setTimeout(() => {
        dispatch(setTextBoxCoordinates({ textBoxCoordinates: updatedCoords }));
      }, 0);
      dispatch(
        setActiveCoordinate({ activeCoordinate: {}, isSelectionMode: false })
      );
    };

    const handleCurrentCoordSignatoryChange = (e) => {
      dispatch(
        setTextBoxCoordinates({
          textBoxCoordinates: updateCoordinateSignatory(
            textBoxCoordinates,
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
        setTextBoxCoordinates({
          textBoxCoordinates: updateCoordinateName(
            textBoxCoordinates,
            activeCoordinate.eleId,
            name
          ),
        })
      );

      const updatedActiveCoordinates = {
        ...activeCoordinate,
        name: name,
      };
      console.log("updatedActiveCoordinates");
      dispatch(
        setActiveCoordinate({
          activeCoordinate: updatedActiveCoordinates,
          isSelectionMode: true,
        })
      );
    };

    const handleCurrentCoordValueChange = (value) => {
      console.log("handleCurrentCoordValueChange");
      dispatch(
        setTextBoxCoordinates({
          textBoxCoordinates: updateCoordinateValue(
            textBoxCoordinates,
            activeCoordinate.eleId,
            value
          ),
        })
      );
      
      const updatedActiveCoordinates = {
        ...activeCoordinate,
        value: value,
      };
      console.log("updatedActiveCoordinates");
      dispatch(
        setActiveCoordinate({
          activeCoordinate: updatedActiveCoordinates,
          isSelectionMode: true,
        })
      );
    };

    const handleCurrentCoordIsRequiredChange = (value) => {
      console.log("handleCurrentCoordIsRequiredChange");
      dispatch(
        setTextBoxCoordinates({
          textBoxCoordinates: updateCoordinateIsRequired(
            textBoxCoordinates,
            activeCoordinate.eleId,
            value
          ),
        })
      );
      
      const updatedActiveCoordinates = {
        ...activeCoordinate,
        isRequired: value,
      };
      console.log("updatedActiveCoordinates");
      dispatch(
        setActiveCoordinate({
          activeCoordinate: updatedActiveCoordinates,
          isSelectionMode: true,
        })
      );
    };

    const handleCurrentCoordWriteBackSettingsChange = (value) => {
      dispatch(
        setTextBoxCoordinates({
          textBoxCoordinates: updateCoordinateWriteBackSettings(
            textBoxCoordinates,
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
        setTextBoxCoordinates({
          textBoxCoordinates: updateCoordinateUpdateFromSalesforceSettings(
            textBoxCoordinates,
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
      console.log("VALUE: " + JSON.stringify(e));

      dispatch(
        setTextBoxCoordinates({
          textBoxCoordinates: updateCoordinateMappingField(
            textBoxCoordinates,
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

    console.log("salesforce",JSON.stringify(salesforceFieldsMetadata));
    return (
      <div className="right-sidebar-tool-detail">
        <div className="right-sidebar-tool-header">
          <div>
            <BsTextareaT
              style={{ color: "#555d65", margin: "0px 5px -3px 0px" }}
            />
            <span
              style={{
                fontSize: "16px",
                color: "#555d65",
              }}
            >
              TEXT
            </span>
          </div>
          <MdDelete
            style={{
              cursor: "pointer",
              fontSize: "16px",
              marginRight: "10px",
              color: "#555d65",
            }}
            onClick={handleEleDelete}
          />
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
                (field) =>
                  field.type === SalesforceFieldTypeEnum.STRING ||
                  field.type === SalesforceFieldTypeEnum.TEXTAREA
              )}
              useFor="MAPPING"
              onChange={(e) => {
                handleCurrentCoordMappingFieldChange(e);
              }}
            ></CustomSelect>
          </div>
        ) : null}

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
                  handleCurrentCoordValueChange(e.value);
                }}
              ></CustomSelect>
            </div>
          ) : (
            <div key={activeCoordinate.value} className="right-sidebar-section">
              <label className="field-lbl">Default Value</label>
              <input
                defaultValue={activeCoordinate.value}
                onBlur={(event) => {
                  handleCurrentCoordValueChange(event.target.value);
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
        </div>
      </div>
    );
  }

  export default SelectedTextBoxContainer;
