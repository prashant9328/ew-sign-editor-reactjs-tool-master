import React from "react";
import Toggle from "react-toggle";

function CustomToggle({ title, defaultValue, onChange, toggleValue }) {
  return (
    <>
    <label className="label-mobile">
      <div className="field-container">
      <span className="field">{title}</span>
      <Toggle
        style={{display:"flex",justifyContent:"center"}}
        checked={defaultValue}
        defaultChecked={defaultValue}
        onChange={(event) => {
          onChange(event.target.checked);
        }}
        />
      </div>
    </label>
    <label className="label-desktop">
      <div className="field-container">
        <span className="field">{title}</span>
      <Toggle
        checked={defaultValue}
        defaultChecked={defaultValue}
        onChange={(event) => {
          onChange(event.target.checked);
        }}
        />
      </div>
    </label>
        </>
  );
}

export default CustomToggle;
