import axios from "axios";
import appConfig from "../config/config";

const SetTemplateCoordinatesService = async (finalCoordData, uuid, tiUUID) => {
    const url = `${appConfig.serverURL}/${appConfig.setCoordinatesDataAPIURL}`;
    const config = {
        "header": {
            "Content-Type": "application/json",
        }
    };
    const body = {
        data: finalCoordData,
        uuid: uuid,
        templateInstanceUUID: tiUUID,
    };

    console.log(url);


    try {
        const response = await axios.post(
            url,
            body,
            config,
        );

        return response;
    } catch (error) {
        console.log(
            "@@@ FAILED FROM SERVER: EDITOR: " + JSON.stringify(error)
        );
        throw new Error("Something went wrong, failed to fetch data from server.");
    }
}

export default SetTemplateCoordinatesService;