import React from "react";
import { BsCalendar2Date } from "react-icons/bs";
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
import { setDateCoordinates } from "../../redux/slices/dateCoordinatesReducer";
import { setActiveCoordinate } from "../../redux/slices/activeCoordinateReducer";
import CustomSelect from "../../components/custom-select";
import CustomToggle from "../../components/custom-toggle";
import { SalesforceFieldTypeEnum } from "../../constants/salesforceFieldTypeEnum";

function SelectedDateContainer({}) {
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

  const handleCurrentCoordMappingFieldChange = (e) => {
    console.log("VALUE: " + JSON.stringify(e));

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

  return (
    <div className="right-sidebar-tool-detail">
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

      <div key={activeCoordinate.name} className="right-sidebar-section">
        <label className="field-lbl">
          Name<span style={{ color: "red" }}>*</span>
        </label>
        <input
          defaultValue={activeCoordinate.name}
          onChange={(event) => handleCurrentCoordNameChange(event)}
          className="input-field"
        />
      </div>

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

export default SelectedDateContainer;
