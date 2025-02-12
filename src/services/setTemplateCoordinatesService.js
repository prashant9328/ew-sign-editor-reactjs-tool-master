//
import { postRequest } from "helpers/axios";

//
import { API_ROUTES } from "constants/apis";
import { Navigate } from "react-router-dom";

const SetTemplateCoordinatesService = async (finalCoordData, uuid, tiUUID) => {
  try {
    const response = await postRequest(
      API_ROUTES.SET_COORDINATES_DATA_API_URL,
      true,
      {
        data: finalCoordData,
        uuid: uuid,
        templateInstanceUUID: tiUUID
      }
    );

    return response;
  } catch (error) {
    console.log("@@@ FAILED FROM SERVER: EDITOR: " + JSON.stringify(error));
    localStorage.setItem('unexpected-error',error.stack)

    window.location.href='/unexpected-error'    
    throw new Error("Something went wrong, failed to fetch data from server.");
  }
};

export default SetTemplateCoordinatesService;
