import React from "react";
import { RiBallPenLine } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { removeCoordinate, updateCoordinateName, updateCoordinateSignatory, updateCoordinateIsRequired } from "../../utils/updateCoordinates";
import {
  setSignatureCoordinates
} from "../../redux/slices/signatureCoordinatesReducer";
import {
  setActiveCoordinate
} from "../../redux/slices/activeCoordinateReducer";
import CustomSelect from "../../components/custom-select";
import CustomToggle from "../../components/custom-toggle";

function SelectedSignatureContainer({}) {
  const dispatch = useDispatch();
  const activeCoordinate = useSelector(
    (state) => state.activeCoordinate.activeCoordinate
  );
  const signatoryList = useSelector(
    (state) => state.signatoryList.signatoryList
  );
  const signatureCoordinates = useSelector(
    (state) => state.signatureCoordinates.signatureCoordinates
  );

  const handleEleDelete = () => {
    const updatedCoords = removeCoordinate(signatureCoordinates, activeCoordinate.eleId);
    setTimeout(() => {
      dispatch(setSignatureCoordinates({signatureCoordinates: updatedCoords}));
      dispatch(setActiveCoordinate({activeCoordinate: {}, isSelectionMode: false}));
    }, 0);
  }

  const handleCurrentCoordSignatoryChange = (e) => { 
    dispatch(
      setSignatureCoordinates({signatureCoordinates: updateCoordinateSignatory(signatureCoordinates, activeCoordinate.eleId, e.id, e.index, e.bgColor)})
    );

    const updatedActiveCoordinates = {
      ...activeCoordinate,
      signatory_id: e.id,
      user_index_id: e.index,
      bgColor: e.bgColor
    };
    dispatch(setActiveCoordinate({activeCoordinate: updatedActiveCoordinates, isSelectionMode: true}));
  }

  const handleCurrentCoordNameChange = (e) => {
    const name = e.target.value;
    dispatch(
      setSignatureCoordinates({signatureCoordinates: updateCoordinateName(signatureCoordinates, activeCoordinate.eleId, name)})
    );

    const updatedActiveCoordinates = {
      ...activeCoordinate,
      name: name
    };
    dispatch(setActiveCoordinate({activeCoordinate: updatedActiveCoordinates, isSelectionMode: true}));
  }

  const handleCurrentCoordIsRequiredChange = (value) => {
    dispatch(
      setSignatureCoordinates({signatureCoordinates: updateCoordinateIsRequired(signatureCoordinates, activeCoordinate.eleId, value)})
    );

    const updatedActiveCoordinates = {
      ...activeCoordinate,
      isRequired: value
    };
    dispatch(setActiveCoordinate({activeCoordinate: updatedActiveCoordinates, isSelectionMode: true}));
  }

  return (
    <div className="right-sidebar-tool-detail">
      <div class="right-sidebar-tool-header">
        <div>
          <RiBallPenLine style={{ color: "#555d65", margin: "0px 5px -3px 0px"}} />
          <span
            style={{
              fontSize: "16px",
              color: "#555d65"
            }}
          >
            SIGNATURE
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
            value={signatoryList.find(signatory => signatory.id === activeCoordinate.signatory_id)}
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

        <div
          style={{
            display: "flex",  
            flexDirection: "column",
          }}
          className="right-sidebar-section"
        >
          <CustomToggle title="Required" defaultValue={activeCoordinate.isRequired} onChange={(value) => {handleCurrentCoordIsRequiredChange(value)}}/>
        </div>

  </div>
  );
}

export default SelectedSignatureContainer;
