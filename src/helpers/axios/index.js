import axios from "axios";
import { store } from "redux/store";

//
import config from "./config";

const axiosInstance = axios.create({
  baseURL: config.apiUrl,
  timeout: 60000,
  headers: {
    "content-type": "application/json",
    Accept: "*/*",
  },
});

const setTokenForAPICall = (authRequired) => {
  if (authRequired) {
    //applying token
    axiosInstance.defaults.headers.common["Authorization"] =
      store.getState().common?.userTokens?.IdToken || "";
  } else {
    //deleting the token from header
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

// export const getRequest = (
//   api: string,
//   authRequired: boolean,
//   controller?: AbortController
// ) => {
//   setTokenForAPICall(authRequired);
//   return new Promise<AxiosResponse>((resolve, reject) => {
//     axiosInstance
//       .get(api, { signal: controller?.signal })
//       .then((result) => resolve(result))
//       .catch((error) => reject(error));
//   });
// };
export const getRequest = (api, authRequired, queryString, controller) => {
  setTokenForAPICall(authRequired);
  return new Promise((resolve, reject) => {
    axiosInstance
      .get(`${api}?${queryString || ""}`, { signal: controller?.signal })
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};

export const postRequest = (api, authRequired, data) => {
  setTokenForAPICall(authRequired);
  return new Promise((resolve, reject) => {
    axiosInstance
      .post(api, data)
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};

export const deleteRequest = (api, authRequired, data) => {
  setTokenForAPICall(authRequired);
  return new Promise((resolve, reject) => {
    axiosInstance
      .delete(api, { data: data })
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};

export const putRequest = (api, authRequired, data) => {
  setTokenForAPICall(authRequired);
  return new Promise((resolve, reject) => {
    axiosInstance
      .put(api, data)
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};

export const patchRequest = (api, authRequired, data) => {
  setTokenForAPICall(authRequired);
  return new Promise((resolve, reject) => {
    axiosInstance
      .patch(api, data)
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};

//
export { default as config } from "./config";
