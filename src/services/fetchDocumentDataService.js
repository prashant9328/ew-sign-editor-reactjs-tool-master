import {themeCoordColors, themeCoordsColorsWithHighOpacity} from "../constants/colors";
import { SignatureFlowEnum } from "../constants/signatureFlowEnum"; 
import appConfig from "../config/config"
import axios from "axios";

const fetchDocumentDataService = async (uuid, tiUUID) => {
    const url = `${appConfig.serverURL}/${appConfig.fetchDocumentDataAPIURL}`;
    const config = {
        "header": {
            "Content-Type": "application/json",
        }
    };
    const body = {
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

        console.log(
            "@@@ DATA FROM SERVER: EDITOR: " + JSON.stringify(response)
            );
    
        let data = response.data.data;
        console.log(
            "@@@ DATA FROM SERVER: EDITOR: " + JSON.stringify(data)
            );
        const signatureFlow = data.signatureFlow;
        let signatoryList = [];
        if (signatureFlow === SignatureFlowEnum.OR) {
            const defaultSignatory = {
                id: 0,
                index: 0,
                bgColor: themeCoordColors[0],
                toolColor: themeCoordsColorsWithHighOpacity[0],
                value: 0,
                label: "Signer 1",
            };
            signatoryList.push(defaultSignatory);
        }
        // Process signatory list for other cases than "OR"
        if (
            (signatureFlow !== SignatureFlowEnum.OR) &&
            data.signatoryList != null &&
            data.signatoryList.length > 0
        ) {
            signatoryList = data.signatoryList.map((signatory, index) => ({
                ...signatory,
                index,
                bgColor: themeCoordColors[index],
                toolColor: themeCoordsColorsWithHighOpacity[index],
                value: signatory.name,
                label: signatory.name,
            }));
        }
        
        return {data: data, signatoryList: signatoryList}
    } catch (error) {
        console.log(
            "@@@ FAILED FROM SERVER: EDITOR: " + JSON.stringify(error)
        );
        throw new Error("Something went wrong, failed to fetch data from server.");
    }
}

export default fetchDocumentDataService;