import { httpClient } from "../utils/HttpClient";
import {
  HTTP_SENDEMAILPP_SUCCESS,
  HTTP_SENDEMAILPP_FETCHING,
  HTTP_SENDEMAILPP_FAILED,
  HTTP_SENDEMAILPP_CLEAR,
  server,
} from "../constants";
// import * as prheadActions from "./prhead.action";

export const setStateSendEmailPPToSuccess = (payload) => ({
  type: HTTP_SENDEMAILPP_SUCCESS,
  payload,
});

const setStateSendEmailPPToFetching = () => ({
  type: HTTP_SENDEMAILPP_FETCHING,
});

const setStateSendEmailPPToFailed = () => ({
  type: HTTP_SENDEMAILPP_FAILED,
});

const setStateSendEmailPPToClear = () => ({
  type: HTTP_SENDEMAILPP_CLEAR,
});

export const SendEmail = (prefix, ordno, status, submit) => {
  return async (dispatch) => {
    try {
      let result = await httpClient.post(
        `${server.SENDEMAILPP_URL}/${prefix}/${ordno}/${status}/${submit}`
      );

      return result.data;
    } catch (err) {
      alert(err.message);
    }
  };
};
