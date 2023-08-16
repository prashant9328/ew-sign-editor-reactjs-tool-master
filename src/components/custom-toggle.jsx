import React from 'react'
import Toggle from 'react-toggle'

function CustomToggle({title, defaultValue, onChange}) {
  return (
    <label className="label">
    <Toggle
        defaultChecked={defaultValue}
        onChange={(event) => {
          console.log(`:::`+event.target.checked);
          onChange(event.target.checked)}} />
    <div className="field-container">
        <span className="field">{title}</span>
    </div>
    </label>
  )
}

export default CustomToggle