import {
  themeCoordColors,
  themeCoordsColorsWithHighOpacity,
} from "../constants/colors";
import { SignatureFlowEnum } from "../constants/signatureFlowEnum";

//
import { postRequest } from "helpers/axios";

//
import { API_ROUTES } from "constants/apis";

const fetchDocumentDataService = async (uuid, tiUUID) => {
  try {
    console.log(" i am here");
    const {
      data: { data },
    } = await postRequest(API_ROUTES.FETCH_DOCUMENT_DATA_API_URL, false, {
      uuid: uuid,
      templateInstanceUUID: tiUUID,
    });

    console.log("@@@ DATA FROM SERVER: EDITOR: " + JSON.stringify(data));
    const sobjectAPIName = data.sobjectAPIName;
    console.log("sobjectAPIName",sobjectAPIName);
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
      signatureFlow !== SignatureFlowEnum.OR &&
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

    return { data: data, signatoryList: signatoryList , sobjectAPIName: sobjectAPIName };
  } catch (error) {
    // console.log("@@@ FAILED FROM SERVER: EDITOR: " + JSON.stringify(error));
    // throw new Error("Something went wrong, failed to fetch data from server.");

    console.log(error.message);
  }
};

export default fetchDocumentDataService;
