//
import { postRequest } from "helpers/axios";

//
import { API_ROUTES } from "constants/apis";

const updateInstanceStatus = async (tiUUID) => {
  try {
    const response = await postRequest(
      API_ROUTES.UPDATE_INSTANCE_STATUS,
      false,
      {
        templateInstanceUUID: tiUUID,
      }
    );

    return response;
  } catch (error) {
    console.log("@@@ FAILED FROM SERVER: EDITOR: " + JSON.stringify(error));
    throw new Error("Something went wrong, failed to fetch data from server.");
  }
};

export default updateInstanceStatus;
