import React from "react";
import Toggle from "react-toggle";

function CustomToggle({ title, defaultValue, onChange, toggleValue }) {
  return (
    <label className="label">
      <Toggle
        checked={defaultValue}
        defaultChecked={defaultValue}
        onChange={(event) => {
          onChange(event.target.checked);
        }}
      />
      <div className="field-container">
        <span className="field">{title}</span>
      </div>
    </label>
  );
}

export default CustomToggle;
