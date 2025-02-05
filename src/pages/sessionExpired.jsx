import React from "react";
import session_timeout_warning from "../images/session_timeout_warning.jpg";
import axios from "axios";
import { message } from "antd";

export default function SessionExpired() {

  
  const redirectToSalesforce=async()=>{
    const message = {
      messageFrom: "EW Sign Editor",
      status: true,
      // event : "timedoutEvent",
      action:
        // template_instance_uuid == null ? "Create Template" : "Create TI",
        "Session Timed Out"
    };

    window.parent.postMessage(message, "*");
    console.log("Event Fired to salesforce : ",message,"*")



  }

  return (
    <>
      <div className="session-div-outer">
          <div className="session-div-inner">
            <div>
            <img src={session_timeout_warning} className="error-img" alt="" />
            </div>
            <div style={{textAlign:"center", marginTop:"0px"}}>
              <h2>Session Timed Out!</h2>
              <div style={{width:"50%",margin:"auto auto"}}>
                <br />
                <p style={{fontSize:"medium"}}>Your changes will be lost. Please try again!</p>
                <button className="timeout-button" onClick={redirectToSalesforce} >Return</button>
              </div>            
            </div>
          </div>
      </div>
    </>
  );
}
