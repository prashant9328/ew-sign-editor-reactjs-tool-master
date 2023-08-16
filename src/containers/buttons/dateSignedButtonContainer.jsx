import React from "react";
import { BsCalendar2Date } from "react-icons/bs";

function DateSignedButtonContainer({ onDragEnd }) {
  return (
    <button
      type="button"
      className="tool-btn disabled-btn"
      disabled
      onDragEnd={onDragEnd}
      draggable
    >
      <BsCalendar2Date className="tool-icon" /> <p>Date Signed</p>
    </button>
  );
}

export default DateSignedButtonContainer;
