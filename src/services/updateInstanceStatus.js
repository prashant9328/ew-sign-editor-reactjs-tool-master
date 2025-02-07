//
import { postRequest } from "helpers/axios";
import { useNavigate,Navigate } from "react-router-dom";
//
import React from "react";
import { API_ROUTES } from "constants/apis";

const updateInstanceStatus = async (tiUUID,state) => {
  try {
    const response = await postRequest(
    //   API_ROUTES.UPDATE_INSTANCE_STATUS,
    //   true,
    //   {
    //     templateInstanceUUID: tiUUID,
    //     state: state
    //   }
    );

    // return response;
  } catch (error) {
    console.log("@@@ FAILED FROM SERVER: EDITOR: " + JSON.stringify(error));
    localStorage.setItem('unexpected-error',error.stack)
    window.location.href='/unexpected-error'    

    throw new Error("Something went wrong, failed to fetch data from server.");
  } 
};

export default updateInstanceStatus;
