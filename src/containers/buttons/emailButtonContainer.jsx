import React from "react";
import { MdOutlineAlternateEmail } from "react-icons/md";

function EmailButtonContainer({ onDragEnd }) {
  return (
    <button
      type="button"
      className="tool-btn disabled-btn"
      disabled
      onDragEnd={onDragEnd}
      draggable
    >
      <MdOutlineAlternateEmail className="tool-icon" /> <p>Email</p>
    </button>
  );
}

export default EmailButtonContainer;
