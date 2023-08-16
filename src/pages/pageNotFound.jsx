import React from "react";
import "../styles/pageNotFound.css";

export default function PageNotFound() {
  return (
    <div className="wrapper">
      <div className="face">
        <div className="band">
          <div className="red" />
          <div className="white" />
          <div className="blue" />
        </div>
        <div className="eyes" />
        <div className="dimples" />
        <div className="mouth" />
      </div>
      <h1 className="message">Oops! Page Not Found!</h1>
    </div>
  );
}
