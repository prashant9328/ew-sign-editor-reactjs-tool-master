import React from "react";
import { BsCheck2Square } from "react-icons/bs";
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

  return (
    <div className="right-sidebar-tool-detail">
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
            options={signatoryList}
            name="currentCoordSigner"
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
              (field) => field.type === SalesforceFieldTypeEnum.BOOLEAN
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
          <label className="field-lbl">Value</label>
          <div>
            <input
              type="checkbox"
              defaultValue={activeCoordinate.value}
              onChange={(event) =>
                handleCurrentCoordValueChange(event.target.checked)
              }
              className="input-field"
            />
          </div>
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

export default SelectedCheckBoxContainer;
